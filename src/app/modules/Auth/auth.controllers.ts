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
  console.log("login");
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

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  // console.log("forgot");
  await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Check your email!",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  // const token = req.headers.authorization?.split(" ")[1] || "";
  console.log(token);
  const { email, newPassword } = req.body;
  const payload = { email, newPassword };
  await AuthServices.resetPassword(payload, token);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password Reset!",
    data: null,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    const result = await AuthServices.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password Changed successfully",
      data: result,
    });
  }
);

export const AuthControllers = {
  loginUser,
  registerUser,
  resetPassword,
  forgotPassword,
  changePassword,
};
