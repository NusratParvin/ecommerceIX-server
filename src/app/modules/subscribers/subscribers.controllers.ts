import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SubscriberServices } from "./subscribers.services";

const addSubscriber = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const subscriber = await SubscriberServices.subscribeToNewsletter(email);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Subscribed to the newsletter successfully!",
    data: subscriber,
  });
});

// Get all subscribers
const fetchAllSubscribers = catchAsync(async (req: Request, res: Response) => {
  const subscribers = await SubscriberServices.getAllSubscribers();
  console.log(subscribers);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Fetched all newsletter subscribers successfully!",
    data: subscribers,
  });
});

// Unsubscribe a user
const removeSubscriber = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await SubscriberServices.unsubscribeFromNewsletter(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Unsubscribed successfully!",
  });
});

export const SubscriberControllers = {
  addSubscriber,
  fetchAllSubscribers,
  removeSubscriber,
};
