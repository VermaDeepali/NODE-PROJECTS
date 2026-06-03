import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export class APIGateway {
  static async intercept(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    logger.info({
      method: req.method,
      path: req.path,
      ip: req.ip
    });

    next();
  }
}