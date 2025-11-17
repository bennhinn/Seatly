import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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

export const joinRoute = (routeId: string): void => {
  const s = getSocket();
  s.emit('join:route', routeId);
  console.log(`Joined route room: ${routeId}`);
};

export const leaveRoute = (routeId: string): void => {
  const s = getSocket();
  s.emit('leave:route', routeId);
  console.log(`Left route room: ${routeId}`);
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
