import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { emitSeatUpdate } from '../lib/socket';

const router = Router();

type Seat = { number: string; available: boolean; type: 'standard' | 'premium' | 'unknown' };

function rowLetter(index: number) {
  // A, B, C ... Z, AA, AB ...
  let s = '';
  index += 1;
  while (index > 0) {
    const mod = (index - 1) % 26;
    s = String.fromCharCode(65 + mod) + s;
    index = Math.floor((index - mod) / 26);
  }
  return s;
}

function generateSeatCodes(rows: number, seatsPerRow: number): string[] {
  const codes: string[] = [];
  for (let r = 0; r < rows; r++) {
    const letter = rowLetter(r);
    for (let c = 1; c <= seatsPerRow; c++) {
      codes.push(`${letter}${c}`);
    }
  }
  return codes;
}

// GET seats for a route
router.get('/:routeId', async (req: Request, res: Response) => {
  try {
    const route = await prisma.route.findUnique({
      where: { id: req.params.routeId },
      include: { vehicle: true },
    });
    if (!route || !route.vehicle) {
      return res.json({ success: true, data: { routeId: req.params.routeId, seats: [] } });
    }

    // Honor the seatLayout JSON
    const layout = route.vehicle.seatLayout as any;
    const rows = Number(layout?.rows ?? 0);
    const seatsPerRow = Number(layout?.seatsPerRow ?? 0);

    const allCodes = generateSeatCodes(rows, seatsPerRow);

    const activeBookings = await prisma.booking.findMany({
      where: {
        routeId: route.id,
        status: { in: ['pending', 'confirmed'] },
      },
      select: { seatNumber: true },
    });

    const taken = new Set(activeBookings.map((b) => b.seatNumber));
    const seats: Seat[] = allCodes.map((code) => ({
      number: code,
      available: !taken.has(code),
      // Optional: mark first/last in row as 'premium' (window)
      type: code.endsWith('1') || code.endsWith(String(seatsPerRow)) ? 'premium' : 'standard',
    }));

    res.json({ success: true, data: { routeId: route.id, seats } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch seats' });
  }
});

// POST select/reserve a seat
router.post('/:routeId/select', async (req: Request, res: Response) => {
  try {
    const { seatNumber, userId } = req.body as { seatNumber: string; userId: string };

    if (!seatNumber || !userId) {
      return res.status(400).json({ success: false, error: 'seatNumber and userId are required' });
    }

    // Ensure route exists
    const route = await prisma.route.findUnique({ where: { id: req.params.routeId } });
    if (!route) return res.status(404).json({ success: false, error: 'Route not found' });

    // Check if seat is already booked (pending or confirmed)
    const exists = await prisma.booking.findFirst({
      where: { routeId: route.id, seatNumber, status: { in: ['pending', 'confirmed'] } },
    });
    if (exists) {
      return res.status(409).json({
        success: false,
        error: `Seat ${seatNumber} is already reserved`,
      });
    }

    const booking = await prisma.booking.create({
      data: {
        routeId: route.id,
        userId,
        seatNumber,
        status: 'pending', // later: auto-timeout and confirmation flow
      },
    });

    // Emit real-time seat update to all clients in this route room
    emitSeatUpdate(route.id, { seatNumber, status: 'reserved' });

    res.json({
      success: true,
      message: `Seat ${seatNumber} reserved successfully`,
      data: { seatNumber: booking.seatNumber, status: booking.status, bookingId: booking.id },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to reserve seat' });
  }
});

// POST release a seat
router.post('/:routeId/release', async (req: Request, res: Response) => {
  try {
    const { seatNumber, userId } = req.body as { seatNumber: string; userId?: string };
    if (!seatNumber) return res.status(400).json({ success: false, error: 'seatNumber is required' });

    // Cancel the most recent pending booking for this seat/route (optionally scoped by user)
    const booking = await prisma.booking.findFirst({
      where: {
        routeId: req.params.routeId,
        seatNumber,
        status: 'pending',
        ...(userId ? { userId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!booking) {
      return res.status(404).json({ success: false, error: 'No pending booking found to release' });
    }

    await prisma.booking.update({ where: { id: booking.id }, data: { status: 'cancelled' } });

    // Emit real-time seat update to all clients in this route room
    emitSeatUpdate(req.params.routeId, { seatNumber, status: 'available' });

    res.json({
      success: true,
      message: `Seat ${seatNumber} released successfully`,
      data: { seatNumber, status: 'available' },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to release seat' });
  }
});

export default router;