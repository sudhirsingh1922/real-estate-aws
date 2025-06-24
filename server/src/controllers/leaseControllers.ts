import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import crypto from "crypto";

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY!,
  key_secret: process.env.RAZOR_PAY_SECRET!,
});

export const getLeases = async (req: Request, res: Response): Promise<void> => {
  try {
    const leases = await prisma.lease.findMany({
      include: {
        tenant: true,
        property: true,
      },
    });
    res.json(leases);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving leases: ${error.message}` });
  }
};

export const getLeasePayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const payments = await prisma.payment.findMany({
      where: { leaseId: Number(id) },
    });
    res.json(payments);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving lease payments: ${error.message}` });
  }
};

export const getSingleLease = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const leases = await prisma.lease.findMany({
      where: {
        propertyId: Number(id), // Replace with the property ID you want
      },
      include: {
        tenant: {
          select: {
            name: true, // Only fetch the name
            phoneNumber: true,
          },
        },
      },
    });

    res.json(leases);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving lease : ${error.message}` });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  const tenantId = req.user!.id; // from authMiddleware

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        lease: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    // Validate tenant owns this payment
    if (payment.lease.tenantCognitoId !== tenantId) {
      res.status(403).json({ message: "Unauthorized" });
    }

    if (payment.paymentStatus === "Paid") {
      res.status(400).json({ message: "Payment already completed" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: payment.amountDue * 100, // in paisa
      currency: "INR",
      receipt: `receipt_${payment.id}`,
    });

    console.log("Order created payment id:  ", paymentId);

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not initiate payment" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      leaseId,
    } = req.body;

    // Compute expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_PAY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ success: false, message: "Invalid signature" });
      return;
    }

    // Fetch payment to update
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) {
      res.status(404).json({ success: false, message: "Payment not found" });
      return;
    }

    // Update payment as Paid
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentStatus: "Paid",
        amountPaid: payment.amountDue,
        amountDue: 0,
        paymentDate: new Date(),
      },
    });

    console.log("Tenant paid rend of due " + payment.amountDue);

    // Check lease details for creating next payment
    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: { property: true },
    });
    if (!lease) {
      res.status(404).json({ success: false, message: "Lease not found" });
      return;
    }

    // If lease not expired, create next month's payment
    const today = new Date();
    if (lease.endDate > today) {
      // Calculate next due date — assuming monthly payments, next due date is one month after last payment dueDate
      // For simplicity, assuming last payment dueDate is payment.dueDate; adjust if you track last payment differently
      const lastDueDate = payment.dueDate;
      const nextDueDate = new Date(lastDueDate);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);

      // Create next payment with status Pending
      await prisma.payment.create({
        data: {
          amountDue: lease.property.pricePerMonth,
          amountPaid: 0,
          dueDate: nextDueDate,
          paymentDate: null,
          paymentStatus: "Pending",
          lease: {
            connect: { id: leaseId },
          },
        },
      });
    }

    console.log("Payment for next month created");

    res
      .status(200)
      .json({ success: true, message: "Payment verified and updated" });
    return;
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};
