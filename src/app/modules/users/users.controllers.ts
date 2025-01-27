import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./users.services";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../helpers/pick";

// Get all users
const userFilterableFields = ["role", "status", "name", "email", "searchTerm"];
const paginationFields = ["limit", "page", "sortBy", "sortOrder"];

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await UserServices.getAllUsersFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Get a single user by ID
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserServices.getUserByIdFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User fetched successfully!",
    data: user,
  });
});

// Get a single user by email
const getUserByEmail = catchAsync(async (req: Request, res: Response) => {
  const { userEmail } = req.params;
  const user = await UserServices.getUserByEmailFromDB(userEmail);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User fetched successfully!",
    data: user,
  });
});

// Update user status
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updatedUser = await UserServices.updateUserStatusIntoDB(id, status);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User status updated successfully!",
    data: updatedUser,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  //   console.log(id, role);

  const updatedUser = await UserServices.updateUserRoleIntoDB(id, role);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User role updated successfully!",
    data: updatedUser,
  });
});

// Delete a user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await UserServices.deleteUserFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.NO_CONTENT,
    success: true,
    message: "User deleted successfully!",
  });
});

const addSubscriber = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const subscriber = await UserServices.subscribeToNewsletter(email);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Subscribed to the newsletter successfully!",
    data: subscriber,
  });
});

// Get all subscribers
const fetchAllSubscribers = catchAsync(async (req: Request, res: Response) => {
  const subscribers = await UserServices.getAllSubscribers();
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
  await UserServices.unsubscribeFromNewsletter(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Unsubscribed successfully!",
  });
});

export const UserControllers = {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  updateUserRole,
  getUserById,
  getUserByEmail,
  addSubscriber,
  fetchAllSubscribers,
  removeSubscriber,
};
