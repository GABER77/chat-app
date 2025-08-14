import './config/loadEnv.js';
import app from './app.js';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import { initSocket } from './utils/socket.js';
import http from 'http';

// synchronous errors
process.on('uncaughtException', (err) => {
  console.log('❌ Uncaught Exception, Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Database & Cloudinary connections
await connectDB();
await connectCloudinary();

// Create an HTTP server from the Express app
// This step is important because Socket.IO binds to the raw HTTP server
const httpServer = http.createServer(app);

// Pass the HTTP server to our Socket.IO initiate function
// This lets Socket.IO listen for WebSocket upgrade requests on the same server
initSocket(httpServer);

const port = process.env.PORT || 8000;
const server = httpServer.listen(port, () =>
  console.log(`🚀 App running on port ${port}`)
);

// asynchronous errors caused by a rejected Promise
process.on('unhandledRejection', (err) => {
  console.log('❌ Unhandled Rejection, Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
