import './config/loadEnv.js';
import app from './app.js';
import connectDB from './config/mongodb.js';

await connectDB();

const port = process.env.PORT || 8000;
const server = app.listen(port, () =>
  console.log(`🚀 App running on port ${port}`)
);
