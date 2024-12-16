import express from "express";
import { PaymentsControllers } from "./payments.controllers";

const router = express.Router();

// Payment routes
router.post("/create-payment-intent", PaymentsControllers.createPaymentIntent);
router.post("/confirm-payment", PaymentsControllers.confirmPayment);

export const PaymentsRoutes = router;
