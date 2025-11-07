import { Router, Request, Response } from 'express';

const router = Router();

// Mock admin statistics
const mockStats = {
  totalBookings: 0,
  activeRoutes: 0,
  totalRevenue: 0,
  totalVehicles: 0,
  recentBookings: [],
};

// GET dashboard statistics
router.get('/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockStats,
  });
});

// GET all vehicles
router.get('/vehicles', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    count: 0,
  });
});

// POST create vehicle
router.post('/vehicles', (req: Request, res: Response) => {
  const newVehicle = {
    id: '1',
    ...req.body,
    createdAt: new Date(),
  };

  res.status(201).json({
    success: true,
    data: newVehicle,
    message: 'Vehicle created successfully',
  });
});

// GET all users
router.get('/users', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    count: 0,
  });
});

// PUT update user role
router.put('/users/:id/role', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'User role updated successfully',
  });
});

export default router;
