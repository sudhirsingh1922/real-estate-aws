import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {createOrder,verifyPayment} from "../controllers/paymentControllers"

const router = express.Router();

router.post("/:id",authMiddleware(["tenant"]),createOrder)
router.post("/:id/verify",authMiddleware(["tenant"]),verifyPayment)

export default router;