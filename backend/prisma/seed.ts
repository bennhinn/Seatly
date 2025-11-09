import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data in reverse order of dependencies
  console.log('🧹 Cleaning existing data...');
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.route.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  console.log('👥 Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Kamau',
        email: 'john.kamau@example.com',
        password: hashedPassword,
        role: 'admin',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Mary Wanjiku',
        email: 'mary.wanjiku@example.com',
        password: hashedPassword,
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Omondi',
        email: 'david.omondi@example.com',
        password: hashedPassword,
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Grace Achieng',
        email: 'grace.achieng@example.com',
        password: hashedPassword,
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Peter Kipchoge',
        email: 'peter.kipchoge@example.com',
        password: hashedPassword,
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Njeri',
        email: 'sarah.njeri@example.com',
        password: hashedPassword,
        role: 'admin',
      },
    }),
    prisma.user.create({
      data: {
        name: 'James Mwangi',
        email: 'james.mwangi@example.com',
        password: hashedPassword,
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alice Wambui',
        email: 'alice.wambui@example.com',
        password: hashedPassword,
        role: 'user',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create Vehicles
  console.log('🚌 Creating vehicles...');
  const busLayout = {
    rows: 12,
    seatsPerRow: 4,
    layout: '2-2',
    totalSeats: 48,
  };

  const matatuLayout = {
    rows: 7,
    seatsPerRow: 2,
    layout: '2-2',
    totalSeats: 14,
  };

  const airplaneLayout = {
    rows: 20,
    seatsPerRow: 6,
    layout: '3-3',
    totalSeats: 120,
  };

  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        name: 'Modern Coast Express',
        type: 'bus',
        seatLayout: busLayout,
      },
    }),
    prisma.vehicle.create({
      data: {
        name: 'Easy Coach',
        type: 'bus',
        seatLayout: busLayout,
      },
    }),
    prisma.vehicle.create({
      data: {
        name: 'Citi Hoppa Matatu',
        type: 'matatu',
        seatLayout: matatuLayout,
      },
    }),
    prisma.vehicle.create({
      data: {
        name: 'Prestige Matatu',
        type: 'matatu',
        seatLayout: matatuLayout,
      },
    }),
    prisma.vehicle.create({
      data: {
        name: 'Kenya Airways Dash 8',
        type: 'airplane',
        seatLayout: airplaneLayout,
      },
    }),
  ]);

  console.log(`✅ Created ${vehicles.length} vehicles`);

  // Create Routes
  console.log('🗺️  Creating routes...');
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const routes = await Promise.all([
    // Bus routes
    prisma.route.create({
      data: {
        origin: 'Nairobi',
        destination: 'Mombasa',
        departure: new Date(tomorrow.setHours(8, 0, 0, 0)),
        arrival: new Date(tomorrow.setHours(16, 30, 0, 0)),
        price: 1500,
        vehicleId: vehicles[0].id,
      },
    }),
    prisma.route.create({
      data: {
        origin: 'Nairobi',
        destination: 'Kisumu',
        departure: new Date(tomorrow.setHours(7, 0, 0, 0)),
        arrival: new Date(tomorrow.setHours(13, 0, 0, 0)),
        price: 1200,
        vehicleId: vehicles[0].id,
      },
    }),
    prisma.route.create({
      data: {
        origin: 'Nairobi',
        destination: 'Eldoret',
        departure: new Date(tomorrow.setHours(9, 30, 0, 0)),
        arrival: new Date(tomorrow.setHours(15, 0, 0, 0)),
        price: 1000,
        vehicleId: vehicles[1].id,
      },
    }),
    prisma.route.create({
      data: {
        origin: 'Mombasa',
        destination: 'Malindi',
        departure: new Date(tomorrow.setHours(10, 0, 0, 0)),
        arrival: new Date(tomorrow.setHours(12, 30, 0, 0)),
        price: 800,
        vehicleId: vehicles[1].id,
      },
    }),
    // Matatu routes
    prisma.route.create({
      data: {
        origin: 'Nairobi',
        destination: 'Nakuru',
        departure: new Date(tomorrow.setHours(6, 0, 0, 0)),
        arrival: new Date(tomorrow.setHours(8, 30, 0, 0)),
        price: 500,
        vehicleId: vehicles[2].id,
      },
    }),
    prisma.route.create({
      data: {
        origin: 'Nairobi',
        destination: 'Thika',
        departure: new Date(tomorrow.setHours(7, 30, 0, 0)),
        arrival: new Date(tomorrow.setHours(8, 30, 0, 0)),
        price: 200,
        vehicleId: vehicles[2].id,
      },
    }),
    prisma.route.create({
      data: {
        origin: 'Kisumu',
        destination: 'Kakamega',
        departure: new Date(tomorrow.setHours(8, 0, 0, 0)),
        arrival: new Date(tomorrow.setHours(9, 30, 0, 0)),
        price: 300,
        vehicleId: vehicles[3].id,
      },
    }),
    prisma.route.create({
      data: {
        origin: 'Nairobi',
        destination: 'Nakuru',
        departure: new Date(nextWeek.setHours(14, 0, 0, 0)),
        arrival: new Date(nextWeek.setHours(16, 30, 0, 0)),
        price: 600,
        vehicleId: vehicles[3].id,
      },
    }),
    // Flight routes
    prisma.route.create({
      data: {
        origin: 'Nairobi',
        destination: 'Mombasa',
        departure: new Date(tomorrow.setHours(11, 0, 0, 0)),
        arrival: new Date(tomorrow.setHours(12, 0, 0, 0)),
        price: 12000,
        vehicleId: vehicles[4].id,
      },
    }),
    prisma.route.create({
      data: {
        origin: 'Nairobi',
        destination: 'Kisumu',
        departure: new Date(tomorrow.setHours(15, 0, 0, 0)),
        arrival: new Date(tomorrow.setHours(15, 45, 0, 0)),
        price: 9000,
        vehicleId: vehicles[4].id,
      },
    }),
    prisma.route.create({
      data: {
        origin: 'Nairobi',
        destination: 'Eldoret',
        departure: new Date(nextWeek.setHours(9, 0, 0, 0)),
        arrival: new Date(nextWeek.setHours(9, 45, 0, 0)),
        price: 8500,
        vehicleId: vehicles[4].id,
      },
    }),
    prisma.route.create({
      data: {
        origin: 'Mombasa',
        destination: 'Nairobi',
        departure: new Date(nextWeek.setHours(16, 0, 0, 0)),
        arrival: new Date(nextWeek.setHours(17, 0, 0, 0)),
        price: 12000,
        vehicleId: vehicles[4].id,
      },
    }),
  ]);

  console.log(`✅ Created ${routes.length} routes`);

  // Create Bookings
  console.log('🎫 Creating bookings...');
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        seatNumber: 'A12',
        userId: users[1].id,
        routeId: routes[0].id,
        status: 'confirmed',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: 'B8',
        userId: users[2].id,
        routeId: routes[0].id,
        status: 'confirmed',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: 'C5',
        userId: users[3].id,
        routeId: routes[1].id,
        status: 'confirmed',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: 'A1',
        userId: users[4].id,
        routeId: routes[2].id,
        status: 'pending',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: 'D15',
        userId: users[6].id,
        routeId: routes[3].id,
        status: 'confirmed',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: '3',
        userId: users[7].id,
        routeId: routes[4].id,
        status: 'confirmed',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: '7',
        userId: users[1].id,
        routeId: routes[5].id,
        status: 'cancelled',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: '12',
        userId: users[2].id,
        routeId: routes[6].id,
        status: 'confirmed',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: '5A',
        userId: users[3].id,
        routeId: routes[8].id,
        status: 'confirmed',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: '12C',
        userId: users[4].id,
        routeId: routes[9].id,
        status: 'confirmed',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: '18F',
        userId: users[6].id,
        routeId: routes[10].id,
        status: 'pending',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: 'A10',
        userId: users[7].id,
        routeId: routes[2].id,
        status: 'confirmed',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: 'B3',
        userId: users[1].id,
        routeId: routes[7].id,
        status: 'pending',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: '8',
        userId: users[5].id,
        routeId: routes[4].id,
        status: 'cancelled',
      },
    }),
    prisma.booking.create({
      data: {
        seatNumber: '15B',
        userId: users[2].id,
        routeId: routes[11].id,
        status: 'confirmed',
      },
    }),
  ]);

  console.log(`✅ Created ${bookings.length} bookings`);

  // Create Payments for confirmed bookings
  console.log('💳 Creating payments...');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        bookingId: confirmedBookings[0].id,
        method: 'mpesa',
        amount: 1500,
        status: 'completed',
        reference: 'QGH7KL9M2P',
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: confirmedBookings[1].id,
        method: 'mpesa',
        amount: 1500,
        status: 'completed',
        reference: 'RBM3NP8K5T',
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: confirmedBookings[2].id,
        method: 'card',
        amount: 1200,
        status: 'completed',
        reference: 'CARD-2024-001',
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: confirmedBookings[3].id,
        method: 'mpesa',
        amount: 800,
        status: 'completed',
        reference: 'TYU9BNM4K7',
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: confirmedBookings[4].id,
        method: 'cash',
        amount: 500,
        status: 'completed',
        reference: 'CASH-2024-001',
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: confirmedBookings[5].id,
        method: 'mpesa',
        amount: 300,
        status: 'completed',
        reference: 'VFR6CLN8M3',
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: confirmedBookings[6].id,
        method: 'mpesa',
        amount: 12000,
        status: 'completed',
        reference: 'XPL2VBN9K5',
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: confirmedBookings[7].id,
        method: 'card',
        amount: 9000,
        status: 'completed',
        reference: 'CARD-2024-002',
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: confirmedBookings[8].id,
        method: 'mpesa',
        amount: 1000,
        status: 'pending',
        reference: 'ZKL4MNP7Q2',
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: confirmedBookings[9].id,
        method: 'mpesa',
        amount: 12000,
        status: 'completed',
        reference: 'WQR8TYU3N6',
      },
    }),
  ]);

  console.log(`✅ Created ${payments.length} payments`);

  console.log('\n✨ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${users.length} (${users.filter(u => u.role === 'admin').length} admins, ${users.filter(u => u.role === 'user').length} regular users)`);
  console.log(`   - Vehicles: ${vehicles.length}`);
  console.log(`   - Routes: ${routes.length}`);
  console.log(`   - Bookings: ${bookings.length} (${confirmedBookings.length} confirmed, ${bookings.filter(b => b.status === 'pending').length} pending, ${bookings.filter(b => b.status === 'cancelled').length} cancelled)`);
  console.log(`   - Payments: ${payments.length}`);
  console.log('\n💡 Test credentials:');
  console.log('   Admin: john.kamau@example.com / password123');
  console.log('   User: mary.wanjiku@example.com / password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
