import pino from 'pino';
import path from 'path';

const logPath = path.join(__dirname, '../../logs/app.log');

export const logger = pino(
  {
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          options: {
            colorize: true
          }
        },
        {
          target: 'pino/file',
          options: {
            destination: logPath,
            mkdir: true
          }
        }
      ]
    }
  }
);