"use client";

import Loading from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAuthUserQuery,
  useGetLeasesQuery,
  useGetPaymentsQuery,
  useGetPropertyQuery,
} from "@/state/api";
import { Lease, Payment, Property } from "@/types/prismaTypes";
import {
  ArrowDownToLineIcon,
  Check,
  CreditCard,
  Download,
  Edit,
  FileText,
  Mail,
  MapPin,
  User,
  CalendarDays,
  IndianRupee,
  Clock,
} from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResidenceLeasePDF from "@/components/pdf/ResidentLease";
import InvoicePDF from "@/components/pdf/InvoicePDF";
import loadRazorpayScript from "@/lib/loadRazorpay";
import { fetchAuthSession } from "aws-amplify/auth";

const PaymentMethod = ({
  payments,
  leaseId,
  tenant,
}: {
  payments: Payment[];
  leaseId: number;
  tenant: User;
}) => {
  const today = new Date();

  const nextPayment = payments.find(
    (payment) =>
      payment.leaseId === leaseId &&
      (payment.paymentStatus === "Pending" ||
        payment.paymentStatus === "PartiallyPaid") &&
      (new Date(payment.dueDate) >= today || new Date(payment.dueDate) < today)
  );

  if (!nextPayment) return null;

  const handlePayment = async () => {

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay SDK. Please try again later.");
      return;
    }

    const session = await fetchAuthSession();
    const { idToken } = session.tokens ?? {};
    const token = idToken;

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${nextPayment.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          amount: nextPayment.amountDue * 100,
          currency: "INR",
          receipt: `receipt_${nextPayment.id}`,
        }),
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    ).then((t) => t.json());

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // from .env
      amount: data.amount,
      currency: data.currency,
      name: "RentiFul",
      description: "Rent Payment ",
      image: "/logo.png", // optional
      order_id: data.orderId,
      handler: async function (response: any) {

        // Confirm payment with backend
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${nextPayment?.id}/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: nextPayment.id,
              leaseId: leaseId,
            }),
          }
        );
        alert("Payment Successful!");
        window.location.reload(); // or update state
      },
      prefill: {
        name: tenant?.userInfo.name,
        email: tenant?.userInfo.email,
        contact: tenant?.userInfo.phoneNumber,
      },
      theme: {
        color: "#f59e0b",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mt-10 md:mt-0 flex-1">
      <h2 className="text-2xl font-bold mb-4">Next Payment</h2>
      <p className="mb-4">Your upcoming rent payment details.</p>
      <div className="border rounded-lg p-6">
        <div className="flex gap-10">
          {/* Icon Block */}
          <div className="w-36 h-20 bg-yellow-500 flex items-center justify-center rounded-md">
            <IndianRupee className="text-white w-10 h-10" />
          </div>

          {/* Payment Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-5">
                <h3 className="text-lg font-semibold">
                  Rs {nextPayment.amountDue.toFixed(2)} Due
                </h3>
                <span className="text-sm font-medium border border-yellow-700 text-yellow-700 px-3 py-1 rounded-full">
                  {nextPayment.paymentStatus}
                </span>
              </div>
              <div className="text-sm text-gray-500 flex items-center mt-2">
                <CalendarDays className="w-4 h-4 mr-1" />
                Due Date:{" "}
                {new Date(nextPayment.dueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              {nextPayment.paymentDate && (
                <div className="text-sm text-gray-500 flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  Paid On:{" "}
                  {new Date(nextPayment.paymentDate).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="my-4" />
        <div className="flex justify-end">
          <button
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50"
            onClick={handlePayment}
          >
            <span>Pay Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ResidenceCard = ({
  property,
  currentLease,
  payments,
}: {
  property: Property;
  currentLease: Lease;
  payments: Payment[];
}) => {
  const today = new Date();

  const nextPayment = payments.find(
    (payment) =>
      payment.leaseId === currentLease.id &&
      (payment.paymentStatus === "Pending" ||
        payment.paymentStatus === "PartiallyPaid") &&
      (new Date(payment.dueDate) >= today || new Date(payment.dueDate) < today)
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 flex-1 flex flex-col justify-between">
      {/* Header */}
      <div className="flex gap-5">
        <div className="w-64 h-32 object-cover bg-slate-500 rounded-xl"></div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="bg-green-500 w-fit text-white px-4 py-1 rounded-full text-sm font-semibold">
              Active Leases
            </div>

            <h2 className="text-2xl font-bold my-2">{property.name}</h2>
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 mr-1" />
              <span>
                {property.location.city}, {property.location.country}
              </span>
            </div>
          </div>
          <div className="text-xl font-bold">
            Rs {currentLease.rent}{" "}
            <span className="text-gray-500 text-sm font-normal">/ night</span>
          </div>
        </div>
      </div>
      {/* Dates */}
      <div>
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <div className="xl:flex">
            <div className="text-gray-500 mr-2">Start Date: </div>
            <div className="font-semibold">
              {nextPayment
                ? new Date(currentLease.startDate).toLocaleDateString()
                : "-"}
            </div>
          </div>
          <div className="border-[0.5px] border-primary-300 h-4" />
          <div className="xl:flex">
            <div className="text-gray-500 mr-2">End Date: </div>
            <div className="font-semibold">
              {nextPayment
                ? new Date(currentLease.endDate).toLocaleDateString()
                : "-"}
            </div>
          </div>
          <div className="border-[0.5px] border-primary-300 h-4" />
          <div className="xl:flex">
            <div className="text-gray-500 mr-2">Next Payment: </div>
            <div className="font-semibold">
              {nextPayment
                ? new Date(nextPayment?.dueDate).toLocaleDateString()
                : "-"}
            </div>
          </div>
        </div>
        <hr className="my-4" />
      </div>
      {/* Buttons */}
      <div className="flex justify-end gap-2 w-full">
        <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50">
          <User className="w-5 h-5 mr-2" />
          Manager
        </button>
        <PDFDownloadLink
          document={
            <ResidenceLeasePDF
              property={property}
              currentLease={currentLease}
            />
          }
          fileName={`Lease_${property.name.replaceAll(" ", "_")}.pdf`}
        >
          {({ loading }) => (
            <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50">
              <Download className="w-5 h-5 mr-2" />
              {loading ? "Preparing..." : "Download Agreement"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

const BillingHistory = ({ payments }: { payments: Payment[] }) => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Billing History</h2>
          <p className="text-sm text-gray-500">
            Download your previous plan receipts and usage details.
          </p>
        </div>
        {/* <div>
          <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50">
            <Download className="w-5 h-5 mr-2" />
            <span>Download All</span>
          </button>
        </div> */}
      </div>
      <hr className="mt-4 mb-1" />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Billing Date</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Amount Due</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="h-16">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Invoice #{payment.id} -{" "}
                    {new Date(
                      payment.paymentDate || payment.dueDate
                    ).toLocaleString("default", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                      payment.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-yellow-100 text-yellow-800 border-yellow-300"
                    }`}
                  >
                    {payment.paymentStatus === "Paid" ? (
                      <Check className="w-4 h-4 inline-block mr-1" />
                    ) : null}
                    {payment.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(payment.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>Rs {payment.amountPaid.toFixed(2)}</TableCell>
                <TableCell>Rs {payment.amountDue.toFixed(2)}</TableCell>
                <TableCell>
                  {/* <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center font-semibold hover:bg-primary-700 hover:text-primary-50">
                    <ArrowDownToLineIcon className="w-4 h-4 mr-1" />
                    Download
                  </button> */}
                  <PDFDownloadLink
                    document={<InvoicePDF payment={payment} />}
                    fileName={`Invoice_${payment.id}.pdf`}
                  >
                    {({ loading }) => (
                      <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center font-semibold hover:bg-primary-700 hover:text-primary-50">
                        <ArrowDownToLineIcon className="w-4 h-4 mr-1" />
                        {loading ? "Generating..." : "Download"}
                      </button>
                    )}
                  </PDFDownloadLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const Residence = () => {
  const { id } = useParams();
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: property,
    isLoading: propertyLoading,
    error: propertyError,
  } = useGetPropertyQuery(Number(id));

  const { data: leases, isLoading: leasesLoading } = useGetLeasesQuery(
    parseInt(authUser?.cognitoInfo?.userId || "0"),
    { skip: !authUser?.cognitoInfo?.userId }
  );
  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery(
    // leases?.[0]?.id || 0,
    // { skip: !leases?.[0]?.id }
    Number(id)
  );

  if (propertyLoading || leasesLoading || paymentsLoading) return <Loading />;
  if (!property || propertyError) return <div>Error loading property</div>;

  const currentLease = leases?.find(
    (lease) => lease.propertyId === property.id
  );

  return (
    <div className="dashboard-container">
      <div className="w-full mx-auto">
        <div className="md:flex gap-10">
          {currentLease && (
            <ResidenceCard
              property={property}
              currentLease={currentLease}
              payments={payments}
            />
          )}
          {currentLease && (
            <PaymentMethod
              payments={payments || []}
              leaseId={currentLease.id}
              tenant={authUser}
            />
          )}
        </div>
        <BillingHistory payments={payments || []} />
      </div>
    </div>
  );
};

export default Residence;
