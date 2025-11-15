import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

/**
 * Initialize Socket.IO server with CORS configuration
 * @param server - HTTP server instance
 * @returns Socket.IO server instance
 */
export function initSocket(server: HTTPServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Handle joining a route room
    socket.on('join:route', (routeId: string) => {
      socket.join(`route:${routeId}`);
      console.log(`Client ${socket.id} joined route:${routeId}`);
    });

    // Handle leaving a route room
    socket.on('leave:route', (routeId: string) => {
      socket.leave(`route:${routeId}`);
      console.log(`Client ${socket.id} left route:${routeId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

/**
 * Get the Socket.IO server instance
 * @returns Socket.IO server instance or null if not initialized
 */
export function getIO(): SocketIOServer | null {
  return io;
}

/**
 * Emit seat update to all clients in a specific route room
 * @param routeId - Route identifier
 * @param seatData - Seat update data including seatNumber and status
 */
export function emitSeatUpdate(
  routeId: string,
  seatData: { seatNumber: string; status: 'reserved' | 'available' }
): void {
  if (!io) {
    console.warn('Socket.IO not initialized. Cannot emit seat update.');
    return;
  }

  io.to(`route:${routeId}`).emit('seat:updated', {
    routeId,
    ...seatData,
  });

  console.log(`Emitted seat update for route:${routeId}`, seatData);
}
