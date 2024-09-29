import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import bodyParser from 'body-parser';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// CORS Configuration
app.use(
  cors({
    origin: [
      'http://localhost:5173', // Localhost frontend
      'https://your-frontend-domain.com', // Deployed frontend domain
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
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
