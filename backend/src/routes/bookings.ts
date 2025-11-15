import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET all bookings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: true, route: { include: { vehicle: true } }, payment: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: bookings, count: bookings.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// GET single booking
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { user: true, route: { include: { vehicle: true } }, payment: true },
    });
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch booking' });
  }
});

// POST create booking (useful for admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { seatNumber, userId, routeId, status = 'pending' } = req.body;
    // Prevent double booking
    const conflict = await prisma.booking.findFirst({
      where: { routeId, seatNumber, status: { in: ['pending', 'confirmed'] } },
    });
    if (conflict) return res.status(409).json({ success: false, error: 'Seat already reserved' });

    const created = await prisma.booking.create({
      data: { seatNumber, userId, routeId, status },
    });
    res.status(201).json({ success: true, data: created, message: 'Booking created successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to create booking' });
  }
});

// PUT update booking
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.booking.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: updated, message: 'Booking updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to update booking' });
  }
});

// DELETE cancel booking
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.booking.update({ where: { id: req.params.id }, data: { status: 'cancelled' } });
    res.json({ success: true, data: updated, message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to cancel booking' });
  }
});

export default router;