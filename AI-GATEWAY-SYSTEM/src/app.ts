import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import aiRoutes from './routes/ai.route';
import { rateLimiter } from './middlewares/rate-limit.middleware';
import { APIGateway } from './gateway/api-gateway';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(APIGateway.intercept);
app.use(rateLimiter);

app.use('/api/v1/ai', aiRoutes);

export default app;