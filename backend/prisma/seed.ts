import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function getOrCreateUser(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return existing;
  const hashed = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role ?? "user",
    },
  });
}

async function getOrCreateVehicle(data: {
  name: string;
  type: string;
  seatLayout: any;
}) {
  const existing = await prisma.vehicle.findFirst({ where: { name: data.name, type: data.type } });
  if (existing) return existing;
  return prisma.vehicle.create({ data });
}

async function getOrCreateRoute(data: {
  origin: string;
  destination: string;
  departure: Date;
  arrival: Date;
  price: number;
  vehicleId: string;
}) {
  const existing = await prisma.route.findFirst({
    where: {
      origin: data.origin,
      destination: data.destination,
      departure: data.departure,
      vehicleId: data.vehicleId,
    },
  });
  if (existing) return existing;
  return prisma.route.create({ data });
}

async function getOrCreateBooking(data: {
  seatNumber: string;
  userId: string;
  routeId: string;
  status?: string;
}) {
  const existing = await prisma.booking.findFirst({
    where: {
      seatNumber: data.seatNumber,
      userId: data.userId,
      routeId: data.routeId,
    },
  });
  if (existing) return existing;
  return prisma.booking.create({ data: { ...data } });
}

async function getOrCreatePayment(data: {
  bookingId: string;
  method: string;
  amount: number;
  status?: string;
  reference?: string;
}) {
  const existing = await prisma.payment.findUnique({ where: { bookingId: data.bookingId } });
  if (existing) return existing;
  return prisma.payment.create({
    data: {
      bookingId: data.bookingId,
      method: data.method,
      amount: data.amount,
      status: data.status ?? "pending",
      reference: data.reference ?? "",
    },
  });
}

async function main() {
  console.log("Seeding database...");

  // Users (admin + regular)
  const users = [
    { name: "John Kamau", email: "john.kamau@example.com", password: "Password123!", role: "admin" },
    { name: "Mary Wanjiku", email: "mary.wanjiku@example.com", password: "Password123!", role: "user" },
    { name: "Peter Ochieng", email: "peter.ochieng@example.com", password: "Password123!", role: "user" },
    { name: "Grace Njeri", email: "grace.njeri@example.com", password: "Password123!", role: "user" },
    { name: "Samuel Otieno", email: "samuel.otieno@example.com", password: "Password123!", role: "user" },
  ];

  const createdUsers = [];
  for (const u of users) {
    const user = await getOrCreateUser(u);
    createdUsers.push(user);
  }

  // Vehicles
  const busLayout = { rows: 12, seatsPerRow: 4, layout: "2-2", totalSeats: 48 };
  const matatuLayout = { rows: 7, seatsPerRow: 2, layout: "1-1", totalSeats: 14 };
  const airplaneLayout = { rows: 20, seatsPerRow: 6, layout: "3-3", totalSeats: 120 };

  const vehiclesData = [
    { name: "Coaster Coach", type: "bus", seatLayout: busLayout },
    { name: "Nissan Matatu", type: "matatu", seatLayout: matatuLayout },
    { name: "Domestic ATR", type: "airplane", seatLayout: airplaneLayout },
  ];

  const createdVehicles = [];
  for (const v of vehiclesData) {
    const vehicle = await getOrCreateVehicle(v);
    createdVehicles.push(vehicle);
  }

  // Routes (future dates)
  const now = new Date();
  function daysFromNow(d: number, hour: number = 9) {
    const x = new Date(now);
    x.setDate(x.getDate() + d);
    x.setHours(hour, 0, 0, 0); // Set a specific time, e.g., 9:00 AM
    return x;
  }

  const routesData = [
    // Bus routes
    {
      origin: "Nairobi",
      destination: "Mombasa",
      departure: daysFromNow(3, 8), // Departs at 8 AM
      durationHours: 8,
      price: 1500,
      vehicleId: createdVehicles.find(v => v.type === "bus")!.id,
    },
    {
      origin: "Nairobi",
      destination: "Kisumu",
      departure: daysFromNow(4, 9), // Departs at 9 AM
      durationHours: 7,
      price: 1200,
      vehicleId: createdVehicles.find(v => v.type === "bus")!.id,
    },
    {
      origin: "Nairobi",
      destination: "Eldoret",
      departure: daysFromNow(5, 10), // Departs at 10 AM
      durationHours: 6,
      price: 1000,
      vehicleId: createdVehicles.find(v => v.type === "bus")!.id,
    },
    {
      origin: "Mombasa",
      destination: "Malindi",
      departure: daysFromNow(6, 14), // Departs at 2 PM
      durationHours: 2,
      price: 800,
      vehicleId: createdVehicles.find(v => v.type === "bus")!.id,
    },

    // Matatu routes
    {
      origin: "Nairobi",
      destination: "Nakuru",
      departure: daysFromNow(2, 7), // Departs at 7 AM
      durationHours: 3,
      price: 400,
      vehicleId: createdVehicles.find(v => v.type === "matatu")!.id,
    },
    {
      origin: "Nairobi",
      destination: "Thika",
      departure: daysFromNow(1, 11), // Departs at 11 AM
      durationHours: 1,
      price: 250,
      vehicleId: createdVehicles.find(v => v.type === "matatu")!.id,
    },
    {
      origin: "Kisumu",
      destination: "Kakamega",
      departure: daysFromNow(3, 13), // Departs at 1 PM
      durationHours: 1.5,
      price: 300,
      vehicleId: createdVehicles.find(v => v.type === "matatu")!.id,
    },

    // Flight routes (use airplane vehicle)
    {
      origin: "Nairobi",
      destination: "Mombasa",
      departure: daysFromNow(2, 15), // Departs at 3 PM
      durationHours: 1,
      price: 12000,
      vehicleId: createdVehicles.find(v => v.type === "airplane")!.id,
    },
    {
      origin: "Nairobi",
      destination: "Kisumu",
      departure: daysFromNow(4, 16), // Departs at 4 PM
      durationHours: 1,
      price: 9000,
      vehicleId: createdVehicles.find(v => v.type === "airplane")!.id,
    },
    {
      origin: "Nairobi",
      destination: "Eldoret",
      departure: daysFromNow(5, 17), // Departs at 5 PM
      durationHours: 1,
      price: 8000,
      vehicleId: createdVehicles.find(v => v.type === "airplane")!.id,
    },
  ];

  const createdRoutes = [];
  for (const r of routesData) {
    const arrival = new Date(r.departure);
    arrival.setHours(arrival.getHours() + r.durationHours);

    const route = await getOrCreateRoute({
      origin: r.origin,
      destination: r.destination,
      departure: r.departure,
      arrival,
      price: r.price,
      vehicleId: r.vehicleId,
    });
    createdRoutes.push(route);
  }

  // Sample bookings (mix of statuses)
  const bookingsData = [
    { seatNumber: "A1", userEmail: "mary.wanjiku@example.com", routeIndex: 0, status: "confirmed" },
    { seatNumber: "A2", userEmail: "peter.ochieng@example.com", routeIndex: 0, status: "pending" },
    { seatNumber: "B1", userEmail: "grace.njeri@example.com", routeIndex: 1, status: "confirmed" },
    { seatNumber: "B2", userEmail: "samuel.otieno@example.com", routeIndex: 1, status: "cancelled" },
    { seatNumber: "C1", userEmail: "mary.wanjiku@example.com", routeIndex: 7, status: "confirmed" }, // flight
    { seatNumber: "C2", userEmail: "john.kamau@example.com", routeIndex: 7, status: "pending" },
    { seatNumber: "D1", userEmail: "peter.ochieng@example.com", routeIndex: 4, status: "confirmed" }, // matatu
    { seatNumber: "D2", userEmail: "samuel.otieno@example.com", routeIndex: 5, status: "pending" },
    { seatNumber: "E1", userEmail: "grace.njeri@example.com", routeIndex: 2, status: "confirmed" },
    { seatNumber: "E2", userEmail: "john.kamau@example.com", routeIndex: 3, status: "pending" },
  ];

  const createdBookings = [];
  for (const b of bookingsData) {
    const user = createdUsers.find(u => u.email === b.userEmail)!;
    const route = createdRoutes[b.routeIndex];
    if (!user || !route) continue;
    const booking = await getOrCreateBooking({
      seatNumber: b.seatNumber,
      userId: user.id,
      routeId: route.id,
      status: b.status,
    });
    createdBookings.push(booking);
  }

  // Sample payments for confirmed bookings
  for (const bk of createdBookings.filter(b => b.status === "confirmed")) {
    const exists = await prisma.payment.findUnique({ where: { bookingId: bk.id } });
    if (exists) continue;
    // random method
    const method = Math.random() > 0.5 ? "mpesa" : "card";
    const ref = method === "mpesa" ? `MPESA${Date.now().toString().slice(-6)}` : `CARD${Date.now().toString().slice(-6)}`;
    await getOrCreatePayment({
      bookingId: bk.id,
      method,
      amount: 1000 + Math.floor(Math.random() * 5000),
      status: "completed",
      reference: ref,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });