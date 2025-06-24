import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getLeasePayments, getLeases, getSingleLease,createOrder,verifyPayment } from "../controllers/leaseControllers";

const router = express.Router();

router.get("/", authMiddleware(["manager", "tenant"]), getLeases);
router.get("/:id", authMiddleware(["manager", "tenant"]), getSingleLease);
router.get(
  "/:id/payments",
  authMiddleware(["manager", "tenant"]),
  getLeasePayments
);

router.post("/:id/payments",authMiddleware(["tenant"]),createOrder)
router.post("/:id/payments/verify",authMiddleware(["tenant"]),verifyPayment)

export default router;
