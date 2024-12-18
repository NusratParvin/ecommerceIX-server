import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { jwtToken } from "../../helpers/jwtToken";
import ApiError from "../errors/apiErrors";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      // console.log(req.headers);
      const token = req.headers.authorization;
      // console.log(token);
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = jwtToken.verifyToken(
        token,
        config.jwt.access_token_secret as Secret
      );

      req.user = verifiedUser;
      // console.log(req.user, "auth");
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden!");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
