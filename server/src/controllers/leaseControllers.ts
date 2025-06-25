import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const { id: propertyId } = req.params;

    // Step 1: Find all leases for the given property
    const leases = await prisma.lease.findMany({
      where: { propertyId: Number(propertyId) },
      select: { id: true }, // Only need the lease IDs
    });
  
    const leaseIds = leases.map((lease) => lease.id);
  
    // Step 2: Find all payments tied to those leases
    const payments = await prisma.payment.findMany({
      where: {
        leaseId: {
          in: leaseIds,
        },
      },
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

