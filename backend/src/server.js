import './config/loadEnv.js';
import app from './app.js';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import initSocket from './utils/socket.js';
import http from 'http';

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
