import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import routesRouter from './routes/routes';
import seatsRouter from './routes/seats';
import bookingsRouter from './routes/bookings';
import paymentsRouter from './routes/payments';
import adminRouter from './routes/admin';

// Load environment variables
dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make Socket.IO available in routes
app.set('io', io);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Seatly API',
    version: '1.0.0',
    endpoints: {
      routes: '/api/routes',
      seats: '/api/seats',
      bookings: '/api/bookings',
      payments: '/api/payments',
      admin: '/api/admin',
    },
  });
});

app.use('/api/routes', routesRouter);
app.use('/api/seats', seatsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', adminRouter);

// 404 handler - must be before error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle seat selection events
  socket.on('seat:select', (data) => {
    console.log('Seat selected:', data);
    socket.broadcast.emit('seat:updated', data);
  });

  // Handle seat release events
  socket.on('seat:release', (data) => {
    console.log('Seat released:', data);
    socket.broadcast.emit('seat:updated', data);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Socket.IO is ready for connections`);
});

export { io };
