import { Response } from "express";

export const handleValidationErrors = (result: any, res: Response) => {
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  return null;
};

export const handleError = (
  res: Response,
  message: string,
  error: any,
  statusCode: number = 500
) => {
  return res.status(statusCode).json({
    error: message,
    message: error instanceof Error ? error.message : error,
  });
};
