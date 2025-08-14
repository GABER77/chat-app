import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

import formatResponse from './middlewares/formatResponse.js';
import globalErrorHandler from './utils/globalErrorHandler.js';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';

const app = express();

// >>>>>>>>>>>>>>>>>>>>>>>>> GLOBAL MIDDLEWARE >>>>>>>>>>>>>>>>>>>>>>>>>

// Allow requests from other domains
app.use(
  cors({
    origin: 'http://localhost:5173', //frontend URL
    credentials: true, // Allow cookies
  })
);

// Set secure HTTP headers
app.use(helmet());

// Limit requests from same IP
const limiter = rateLimit({
  limit: 500,
  windowMs: 60 * 60 * 1000, // Maximum of 500 request in 1 hour
  message: 'Too many requests from this IP, please try again after an hour',
});
app.use('/api', limiter);

// Body parser, Reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Reading data from the cookies (req.cookies)
app.use(cookieParser());

// Format all responses with API version and data wrapper
app.use(formatResponse);

// Enable compression to speed up response delivery
app.use(compression());

// >>>>>>>>>>>>>>>>>>>>>>>>> ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);

app.use(globalErrorHandler);

export default app;
