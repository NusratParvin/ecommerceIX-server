import express from "express";
import { TransactionControllers } from "./transactions.controllers";

const router = express.Router();

// Transaction routes
router.get("/admin", TransactionControllers.getAllTransactionsForAdmin);

export const TransactionRoutes = router;
