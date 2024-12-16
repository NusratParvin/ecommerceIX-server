import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentServices } from "./payments.services";

const createPaymentIntent = catchAsync(async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await PaymentServices.createPaymentIntent(amount);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment intent created successfully",
    data: paymentIntent,
  });
});

const confirmPayment = catchAsync(async (req, res) => {
  const { paymentIntentId, orderId, userId } = req.body;
  const transaction = await PaymentServices.confirmPayment(
    paymentIntentId,
    orderId,
    userId
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment confirmed successfully",
    data: transaction,
  });
});

export const PaymentsControllers = { confirmPayment, createPaymentIntent };
