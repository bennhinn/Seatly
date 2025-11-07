import { Router, Request, Response } from 'express';

const router = Router();

// Mock bookings data
const mockBookings = [
  {
    id: '1',
    seatNumber: 'A1',
    userId: '1',
    routeId: '1',
    status: 'confirmed',
    createdAt: new Date(),
  },
];

// GET all bookings
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockBookings,
    count: mockBookings.length,
  });
});

// GET single booking
router.get('/:id', (req: Request, res: Response) => {
  const booking = mockBookings.find((b) => b.id === req.params.id);
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found',
    });
  }

  res.json({
    success: true,
    data: booking,
  });
});

// POST create booking
router.post('/', (req: Request, res: Response) => {
  const newBooking = {
    id: String(mockBookings.length + 1),
    ...req.body,
    status: 'pending',
    createdAt: new Date(),
  };

  res.status(201).json({
    success: true,
    data: newBooking,
    message: 'Booking created successfully',
  });
});

// PUT update booking
router.put('/:id', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Booking updated successfully',
  });
});

// DELETE cancel booking
router.delete('/:id', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Booking cancelled successfully',
  });
});

export default router;
