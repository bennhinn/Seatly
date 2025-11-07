import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    socket = io(url, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
