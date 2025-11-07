import { Router, Request, Response } from 'express';

const router = Router();

// Mock payments data
const mockPayments = [
  {
    id: '1',
    bookingId: '1',
    method: 'mpesa',
    amount: 1500,
    status: 'completed',
    reference: 'MPESA123456',
    createdAt: new Date(),
  },
];

// GET all payments
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockPayments,
    count: mockPayments.length,
  });
});

// GET single payment
router.get('/:id', (req: Request, res: Response) => {
  const payment = mockPayments.find((p) => p.id === req.params.id);
  
  if (!payment) {
    return res.status(404).json({
      success: false,
      error: 'Payment not found',
    });
  }

  res.json({
    success: true,
    data: payment,
  });
});

// POST initiate payment
router.post('/initiate', (req: Request, res: Response) => {
  const { bookingId, method, amount } = req.body;

  const newPayment = {
    id: String(mockPayments.length + 1),
    bookingId,
    method,
    amount,
    status: 'pending',
    reference: `REF${Date.now()}`,
    createdAt: new Date(),
  };

  res.status(201).json({
    success: true,
    data: newPayment,
    message: 'Payment initiated successfully',
  });
});

// POST verify payment
router.post('/verify', (req: Request, res: Response) => {
  const { reference } = req.body;

  res.json({
    success: true,
    data: {
      reference,
      status: 'completed',
      verified: true,
    },
    message: 'Payment verified successfully',
  });
});

export default router;
