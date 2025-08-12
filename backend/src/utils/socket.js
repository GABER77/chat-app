import { Server } from 'socket.io';

export default function initSocket(server) {
  // Create a new Socket.IO server and bind it to the HTTP server
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Frontend URL
      credentials: true, // Allow cookies
    },
  });

  // Listen for new client connections
  io.on('connection', (socket) => {
    console.log('🔌 New user connected:', socket.id);

    // Disconnect Event
    socket.on('disconnect', () => {
      console.log('🔌❌ User disconnected:', socket.id);
    });
  });
}
