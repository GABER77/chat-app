import './config/loadEnv.js';
import app from './app.js';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import http from 'http';

// Database & Cloudinary connections
await connectDB();
await connectCloudinary();

// Create an HTTP server from the Express app
// This step is important because Socket.IO binds to the raw HTTP server
const httpServer = http.createServer(app);

const port = process.env.PORT || 8000;
const server = httpServer.listen(port, () =>
  console.log(`🚀 App running on port ${port}`)
);
