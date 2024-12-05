import { Response } from "express";

type TResponseData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T | null;
  meta?: {
    page: number;
    limit: number;
    total?: number;
  };
};

const sendResponse = <T>(res: Response, params: TResponseData<T>) => {
  const responseBody: Record<string, any> = {
    status: params.statusCode,
    success: params.success,
    message: params.message,
    meta: params.meta || null || undefined,
  };

  if (params.data !== undefined) {
    responseBody.data = params.data;
  }

  res.status(params.statusCode).json(responseBody);
};

export default sendResponse;
