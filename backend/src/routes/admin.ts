import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET dashboard statistics
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [totalBookings, activeRoutes, totalVehicles, revenueAgg] = await Promise.all([
      prisma.booking.count({ where: { status: { in: ['pending', 'confirmed'] } } }),
      prisma.route.count(),
      prisma.vehicle.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'completed' },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        activeRoutes,
        totalVehicles,
        totalRevenue: revenueAgg._sum.amount ?? 0,
        recentBookings: await prisma.booking.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: true, route: true, payment: true },
        }),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// GET all vehicles
router.get('/vehicles', async (_req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: vehicles, count: vehicles.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch vehicles' });
  }
});

// POST create vehicle
router.post('/vehicles', async (req: Request, res: Response) => {
  try {
    const created = await prisma.vehicle.create({ data: req.body });
    res.status(201).json({ success: true, data: created, message: 'Vehicle created successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to create vehicle' });
  }
});

// GET all users
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: users, count: users.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// PUT update user role
router.put('/users/:id/role', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: req.body.role },
    });
    res.json({ success: true, data: updated, message: 'User role updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to update user role' });
  }
});

export default router;