import express from 'express';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import formatResponse from './middlewares/formatResponse.js';

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

export default app;
