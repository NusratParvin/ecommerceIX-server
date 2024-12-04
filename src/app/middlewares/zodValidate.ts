import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const zodValidate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      return next();
    } catch (err) {
      next(err);
    }
  };

export default zodValidate;
