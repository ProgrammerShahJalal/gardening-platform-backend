import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import bodyParser from 'body-parser';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import { WebhookController } from './app/modules/payment/webhook.controller';

const app: Application = express();

// CORS Configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Localhost frontend
      'https://your-frontend-domain.com', // Deployed frontend domain
    ],
    methods: ['GET', 'POST', 'PUT', "PATCH", 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// Stripe requires the raw body to construct events properly
app.post(
  '/api/webhook',
  bodyParser.raw({ type: 'application/json' }),
  WebhookController.stripeWebhook,
);

// Body parser for JSON
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/v1', router);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Gardening Tips & Advice Platform 🌱');
});

// Error handling
app.use(globalErrorHandler);

// 404 Not Found handler
app.use(notFound);

export default app;
