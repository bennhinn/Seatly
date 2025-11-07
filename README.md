# Seatly 🚌✈️

A full-stack seat booking and payment platform for buses, matatus, and airplanes — with real-time seat selection, M-Pesa integration, and digital ticketing.

## 🌟 Features

- **Real-time Seat Selection**: Live updates using Socket.io
- **Multiple Vehicle Types**: Support for buses, matatus, and airplanes
- **M-Pesa Integration**: Secure mobile payments (ready for integration)
- **Digital Ticketing**: Instant ticket generation and delivery
- **Admin Dashboard**: Manage routes, vehicles, and bookings
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type-Safe**: Full TypeScript implementation
- **Modern Stack**: Next.js 14+ and Express.js

## 🏗️ Project Structure

```
seatly/
├── frontend/              # Next.js 14+ application
│   ├── app/
│   │   ├── components/   # Reusable React components
│   │   ├── lib/          # Utility functions and configurations
│   │   ├── types/        # TypeScript type definitions
│   │   ├── booking/      # Booking page
│   │   ├── admin/        # Admin dashboard
│   │   └── page.tsx      # Home page
│   ├── public/           # Static assets
│   └── package.json
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── middleware/   # Auth and validation middleware
│   │   └── index.ts      # Server entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
├── docker-compose.yml     # Development environment
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (if running without Docker)

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/bennhinn/Seatly.git
   cd Seatly
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec backend npx prisma migrate dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Prisma Studio: `docker-compose exec backend npx prisma studio`

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at http://localhost:5000

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3000

## 📚 API Endpoints

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get single route
- `POST /api/routes` - Create new route
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route

### Seats
- `GET /api/seats/:routeId` - Get seats for a route
- `POST /api/seats/:routeId/select` - Select/reserve a seat
- `POST /api/seats/:routeId/release` - Release a seat

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/verify` - Verify payment

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/vehicles` - Get all vehicles
- `POST /api/admin/vehicles` - Create vehicle
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role

## 🗄️ Database Schema

The application uses Prisma ORM with PostgreSQL:

- **User**: User accounts and authentication
- **Vehicle**: Bus, matatu, and airplane configurations
- **Route**: Travel routes with departure/arrival times
- **Booking**: Seat reservations
- **Payment**: Payment transactions

## 🎨 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Real-time**: Socket.io Client
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.io
- **Authentication**: JWT

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload with Nodemon

## 🔧 Development

### Running Tests
```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

### Database Management
```bash
# Open Prisma Studio
cd backend
npx prisma studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

### Building for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/seatly
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Built with ❤️ for the Seatly platform

## 🐛 Known Issues

- M-Pesa integration is prepared but requires actual credentials
- User authentication endpoints need to be implemented
- Email notifications are not yet configured

## 🗺️ Roadmap

- [ ] Complete M-Pesa payment integration
- [ ] Add user authentication and registration
- [ ] Implement email notifications
- [ ] Add booking history and user profiles
- [ ] Mobile app development
- [ ] Multi-language support (i18n)
- [ ] Advanced seat layouts for different vehicle types
- [ ] Reporting and analytics dashboard

## 💬 Support

For support, email support@seatly.com or open an issue in the GitHub repository.

