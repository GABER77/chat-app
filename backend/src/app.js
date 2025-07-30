import express from 'express';

import authRouter from './routes/auth.routes.js';
import formatResponse from './middlewares/formatResponse.js';

const app = express();

// Body parser, Reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Format all responses with API version and data wrapper
app.use(formatResponse);

// >>>>>>>>>>>>>>>>>>>>>>>>> ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>

app.use('/api/auth', authRouter);

export default app;
