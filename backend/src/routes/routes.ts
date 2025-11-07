import { Router, Request, Response } from 'express';

const router = Router();

// Mock data for development
const mockRoutes = [
  {
    id: '1',
    origin: 'Nairobi',
    destination: 'Mombasa',
    departure: new Date('2024-01-15T08:00:00'),
    arrival: new Date('2024-01-15T16:00:00'),
    price: 1500,
    vehicleId: '1',
  },
  {
    id: '2',
    origin: 'Nairobi',
    destination: 'Kisumu',
    departure: new Date('2024-01-15T09:00:00'),
    arrival: new Date('2024-01-15T15:00:00'),
    price: 1200,
    vehicleId: '2',
  },
];

// GET all routes
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockRoutes,
    count: mockRoutes.length,
  });
});

// GET single route
router.get('/:id', (req: Request, res: Response) => {
  const route = mockRoutes.find((r) => r.id === req.params.id);
  
  if (!route) {
    return res.status(404).json({
      success: false,
      error: 'Route not found',
    });
  }

  res.json({
    success: true,
    data: route,
  });
});

// POST create route
router.post('/', (req: Request, res: Response) => {
  const newRoute = {
    id: String(mockRoutes.length + 1),
    ...req.body,
  };

  res.status(201).json({
    success: true,
    data: newRoute,
    message: 'Route created successfully',
  });
});

// PUT update route
router.put('/:id', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Route updated successfully',
  });
});

// DELETE route
router.delete('/:id', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Route deleted successfully',
  });
});

export default router;
