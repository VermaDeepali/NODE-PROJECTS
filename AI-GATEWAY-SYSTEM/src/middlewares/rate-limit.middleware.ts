import { Request, Response, NextFunction } from 'express';

const memoryStore = new Map();

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;

  const current = memoryStore.get(ip) || {
    count: 0,
    startTime: Date.now()
  };

  if (Date.now() - current.startTime > 60000) {
    current.count = 0;
    current.startTime = Date.now();
  }

  current.count += 1;

  memoryStore.set(ip, current);

  if (current.count > 100) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests'
    });
  }

  next();
};