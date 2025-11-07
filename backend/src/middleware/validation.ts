import { Request, Response, NextFunction } from 'express';

export const validateBooking = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { seatNumber, userId, routeId } = req.body;

  if (!seatNumber || !userId || !routeId) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields: seatNumber, userId, routeId',
    });
    return;
  }

  next();
};

export const validateRoute = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { origin, destination, departure, arrival, vehicleId } = req.body;

  if (!origin || !destination || !departure || !arrival || !vehicleId) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
    return;
  }

  next();
};

export const validatePayment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { bookingId, method, amount } = req.body;

  if (!bookingId || !method || !amount) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields: bookingId, method, amount',
    });
    return;
  }

  if (amount <= 0) {
    res.status(400).json({
      success: false,
      error: 'Amount must be greater than 0',
    });
    return;
  }

  next();
};
