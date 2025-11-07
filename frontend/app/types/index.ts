export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'bus' | 'matatu' | 'airplane';
  seatLayout: SeatLayout;
  createdAt: Date;
}

export interface SeatLayout {
  rows: number;
  columns: number;
  seats: Seat[];
}

export interface Seat {
  number: string;
  row: number;
  column: number;
  type: 'standard' | 'premium' | 'driver';
  available: boolean;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  departure: Date;
  arrival: Date;
  vehicleId: string;
  vehicle?: Vehicle;
  price: number;
}

export interface Booking {
  id: string;
  seatNumber: string;
  userId: string;
  user?: User;
  routeId: string;
  route?: Route;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  booking?: Booking;
  method: 'mpesa' | 'card' | 'cash';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  createdAt: Date;
}
