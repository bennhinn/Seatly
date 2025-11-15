import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET all routes
router.get('/', async (_req: Request, res: Response) => {
  try {
    const routes = await prisma.route.findMany({
      include: {
        vehicle: true,
      },
      orderBy: { departure: 'asc' },
    });
    res.json({ success: true, data: routes, count: routes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch routes' });
  }
});

// GET single route
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const route = await prisma.route.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true },
    });
    if (!route) return res.status(404).json({ success: false, error: 'Route not found' });
    res.json({ success: true, data: route });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch route' });
  }
});

// POST create route
router.post('/', async (req: Request, res: Response) => {
  try {
    const { origin, destination, departure, arrival, price, vehicleId } = req.body;
    const created = await prisma.route.create({
      data: {
        origin,
        destination,
        departure: new Date(departure),
        arrival: new Date(arrival),
        price: Number(price),
        vehicleId,
      },
    });
    res.status(201).json({ success: true, data: created, message: 'Route created successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to create route' });
  }
});

// PUT update route
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { origin, destination, departure, arrival, price, vehicleId } = req.body;
    const updated = await prisma.route.update({
      where: { id: req.params.id },
      data: {
        origin,
        destination,
        departure: departure ? new Date(departure) : undefined,
        arrival: arrival ? new Date(arrival) : undefined,
        price: price !== undefined ? Number(price) : undefined,
        vehicleId,
      },
    });
    res.json({ success: true, data: updated, message: 'Route updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to update route' });
  }
});

// DELETE route
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.route.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Route deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to delete route' });
  }
});

export default router;