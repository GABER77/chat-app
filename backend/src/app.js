import express from 'express';
import cookieParser from 'cookie-parser';

import formatResponse from './middlewares/formatResponse.js';
import globalErrorHandler from './utils/globalErrorHandler.js';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';

const app = express();

// >>>>>>>>>>>>>>>>>>>>>>>>> GLOBAL MIDDLEWARE >>>>>>>>>>>>>>>>>>>>>>>>>

// Body parser, Reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Reading data from the cookies (req.cookies)
app.use(cookieParser());

// Format all responses with API version and data wrapper
app.use(formatResponse);

// >>>>>>>>>>>>>>>>>>>>>>>>> ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);

app.use(globalErrorHandler);

export default app;
