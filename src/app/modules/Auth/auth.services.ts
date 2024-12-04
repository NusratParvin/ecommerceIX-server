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

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  try {
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

const registerUserIntoDB = async (req: Request): Promise<User> => {
  const userExists = await prisma.user.findUnique({
    where: { email: req.body.email, status: ActiveStatus.ACTIVE },
  });
  if (userExists)
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Email is in use");

  const file = req.file as TFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadImageToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  req.body.password = hashedPassword;
  const result = await prisma.user.create({
    data: req.body,
  });
  return result;
};

export const AuthServices = {
  loginUserIntoDB,
  registerUserIntoDB,
};
