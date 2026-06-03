import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';

const aiService = new AIService();

export class AIController {
  async ask(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider, prompt } = req.body;

      const response = await aiService.ask(provider, prompt);

      return res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  }
}