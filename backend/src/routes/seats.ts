import { Router, Request, Response } from 'express';

const router = Router();

// Mock seat data
const mockSeats = [
  {
    routeId: '1',
    seats: [
      { number: 'A1', available: true, type: 'standard' },
      { number: 'A2', available: true, type: 'standard' },
      { number: 'A3', available: false, type: 'standard' },
      { number: 'B1', available: true, type: 'premium' },
      { number: 'B2', available: true, type: 'premium' },
    ],
  },
];

// GET seats for a route
router.get('/:routeId', (req: Request, res: Response) => {
  const seatData = mockSeats.find((s) => s.routeId === req.params.routeId);
  
  if (!seatData) {
    return res.json({
      success: true,
      data: { routeId: req.params.routeId, seats: [] },
    });
  }

  res.json({
    success: true,
    data: seatData,
  });
});

// POST select/reserve a seat
router.post('/:routeId/select', (req: Request, res: Response) => {
  const { seatNumber } = req.body;

  res.json({
    success: true,
    message: `Seat ${seatNumber} selected successfully`,
    data: { seatNumber, status: 'reserved' },
  });
});

// POST release a seat
router.post('/:routeId/release', (req: Request, res: Response) => {
  const { seatNumber } = req.body;

  res.json({
    success: true,
    message: `Seat ${seatNumber} released successfully`,
    data: { seatNumber, status: 'available' },
  });
});

export default router;
