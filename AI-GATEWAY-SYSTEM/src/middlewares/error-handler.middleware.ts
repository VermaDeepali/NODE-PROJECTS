import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const statusCode =
    error.response?.status || 500;

  const message =
    error.response?.data?.error?.message ||
    error.message ||
    'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
};