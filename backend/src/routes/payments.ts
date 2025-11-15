import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET all payments
router.get('/', async (_req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { booking: { include: { route: true, user: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: payments, count: payments.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch payments' });
  }
});

// GET single payment
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: { booking: { include: { route: true, user: true } } },
    });
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch payment' });
  }
});

// POST initiate payment
router.post('/initiate', async (req: Request, res: Response) => {
  try {
    const { bookingId, method, amount } = req.body;

    // Ensure booking exists
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        method,
        amount: Number(amount),
        status: 'pending',
        reference: `REF${Date.now()}`,
      },
    });

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment initiated successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to initiate payment' });
  }
});

// POST verify payment
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { reference } = req.body;

    const payment = await prisma.payment.findFirst({ where: { reference } });
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'completed' },
    });

    res.json({
      success: true,
      data: { ...updated, verified: true },
      message: 'Payment verified successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to verify payment' });
  }
});

export default router;