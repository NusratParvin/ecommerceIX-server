import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.services";
import config from "../../../config";

// const registerUser = catchAsync(async (req: Request, res: Response) => {
//   console.log(req.file);
//   const result = await AuthServices.registerUserIntoDB(req);
//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     success: true,
//     message: "User Created successfully!",
//     data: result,
//   });
// });

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUserIntoDB(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged in successfully!",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

const registerUser = catchAsync(async (req: Request, res: Response) => {
  console.log(req.file);
  const result = await AuthServices.registerUserIntoDB(req);

  // Check if a token exists in the result
  if (result.token) {
    const { token: accessToken } = result;

    // Set the access token as an HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      secure: true, // Set to true in production
      httpOnly: true,
    });

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Vendor registered successfully!",
      data: { accessToken },
    });
  } else {
    // If no token (for USER registration)
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User registered successfully!",
      data: result.user,
    });
  }
});

export const AuthControllers = {
  loginUser,
  registerUser,
};
