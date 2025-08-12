import { Server } from 'socket.io';

// Map to store online users: userId -> socketId
const onlineUsers = new Map();

export function initSocket(server) {
  // Create a new Socket.IO server and bind it to the HTTP server
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Frontend URL
      credentials: true, // Allow cookies
    },
  });

  // Listen for new users connections
  io.on('connection', (socket) => {
    console.log('🔌 New user connected:', socket.id);

    // Get the userId which is passed from the frontend when creating the socket connection
    const userId = socket.handshake.query.userId;
    // If a valid userId is provided, store it in onlineUsers
    if (userId) {
      onlineUsers.set(userId, socket.id);
      // Broadcast the updated list of online users to all connected users
      io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    }

    // Disconnect Event
    socket.on('disconnect', () => {
      console.log('🔌❌ User disconnected:', socket.id);

      // If this socket was associated with a userId, remove them from the online list
      if (userId) {
        onlineUsers.delete(userId);
        // Broadcast the updated list of online users to all connected users
        io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
      }
    });
  });
}

export function getReceiverSocketId(userId) {
  return onlineUsers.get(userId);
}
