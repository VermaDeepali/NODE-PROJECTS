import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export class APIGateway {
  static async intercept(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const start = Date.now();

    logger.info({
      message: 'Incoming Request',
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      body: req.body
    });

    res.on('finish', () => {
      logger.info({
        message: 'Request Completed',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${Date.now() - start}ms`
      });
    });

    next();
  }
}