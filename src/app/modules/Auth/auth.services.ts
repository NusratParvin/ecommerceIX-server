import { ActiveStatus, User } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { jwtToken } from "../../../helpers/jwtToken";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { Request } from "express";
import { TFile } from "../../interfaces/fileUpload";
import { fileUploader } from "../../../helpers/uploadImageToCloudinary";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/apiErrors";
import { sendEmail } from "../../../helpers/sendEmail";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  console.log(payload.email, payload.password);
  const ok = await prisma.user.findMany();
  console.log(ok, "user");
  try {
    console.log("object");
    const userExists = await prisma.user.findUniqueOrThrow({
      where: { email: payload.email, status: ActiveStatus.ACTIVE },
    });

    const passwordCheck = await bcrypt.compare(
      payload.password,
      userExists.password
    );

    if (!passwordCheck) {
      throw new Error("Password incorrect!");
    }

    const accessToken = jwtToken.generateToken(
      {
        email: userExists.email,
        role: userExists.role,
        name: userExists.name,
        profilePhoto: userExists.profilePhoto,
      },
      config.jwt.access_token_secret as Secret,
      config.jwt.access_token_expires_in as string
    );

    const refreshToken = jwtToken.generateToken(
      {
        email: userExists.email,
        role: userExists.role,
        name: userExists.name,
        profilePhoto: userExists.profilePhoto,
      },
      config.jwt.refresh_token_secret as Secret,
      config.jwt.refresh_token_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Invalid credential!");
  }
};

const registerUserIntoDB = async (
  req: Request
): Promise<{
  user: User;
  token?: string;
}> => {
  const userExists = await prisma.user.findUnique({
    where: { email: req.body.email, status: ActiveStatus.ACTIVE },
  });
  if (userExists) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Email is already in use.");
  }

  // Handle file upload
  const file = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadImageToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  req.body.password = hashedPassword;

  // Create the user in the database
  const user = await prisma.user.create({
    data: req.body,
    // data: {
    //   ...req.body,
    //   needsPasswordChange: true,
    // },
  });

  // Generate token if the user is a VENDOR
  let token: string | undefined;
  if (user.role === "VENDOR") {
    token = jwtToken.generateToken(
      {
        email: user.email,
        role: user.role,
        name: user.name,
        profilePhoto: user.profilePhoto,
      },
      config.jwt.access_token_secret as Secret,
      config.jwt.access_token_expires_in as string
    );
  }

  return { user, token };
};

const forgotPassword = async ({ email }: { email: string }) => {
  console.log(email);
  const user = await prisma.user.findFirst({
    where: {
      email: email,
      status: "ACTIVE",
    },
  });
  console.log(user);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "This user is not found!");
  }

  const resetToken = jwtToken.generateToken(
    {
      email: user.email,
      role: user.role,
      name: user.name,
      profilePhoto: user.profilePhoto,
    },
    config.jwt.access_token_secret as Secret,
    "10m"
  );

  const resetUILink = `${config.reset_pass_ui_link}/reset-password?id=${user.id}&token=${resetToken}`;
  await sendEmail(user.email, resetUILink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: ActiveStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(StatusCodes.NOT_FOUND, "This user is not found!");
  }

  const isValidToken = jwtToken.verifyToken(
    token,
    config.jwt.access_token_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden!");
  }

  const newHashedPassword = await bcrypt.hash(payload.newPassword, 12);

  // Update user's password
  const updatedUser = await prisma.user.update({
    where: { id: userData.id },
    data: {
      password: newHashedPassword,
    },
  });

  return updatedUser;
};

export const AuthServices = {
  loginUserIntoDB,
  registerUserIntoDB,
  forgotPassword,
  resetPassword,
};
