import { Response } from "express";

type TResponseData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T | null;
};

const sendResponse = <T>(res: Response, params: TResponseData<T>) => {
  const responseBody: Record<string, any> = {
    status: params.statusCode,
    success: params.success,
    message: params.message,
  };

  if (params.data !== undefined) {
    responseBody.data = params.data;
  }

  res.status(params.statusCode).json(responseBody);
};

export default sendResponse;
