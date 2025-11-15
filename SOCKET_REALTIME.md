# Socket.io Real-time Features

This document explains the real-time seat availability features implemented using Socket.io.

## Overview

The Seatly platform now includes real-time seat updates using Socket.io, allowing multiple users to see seat availability changes instantly without refreshing the page.

## Architecture

### Backend (Express + Socket.io)

The backend implements a modular Socket.io setup with the following components:

#### Socket Module (`backend/src/lib/socket.ts`)

- **`initSocket(server)`**: Initializes Socket.io server with CORS configuration
- **`emitSeatUpdate(routeId, seatData)`**: Broadcasts seat updates to all clients in a specific route room
- **`getIO()`**: Returns the Socket.io server instance

#### Room-based Connections

Clients join route-specific rooms using the pattern `route:{routeId}`. This ensures that seat updates are only sent to users viewing the same route.

```typescript
// Client joins a route room
socket.emit('join:route', routeId);

// Client leaves a route room
socket.emit('leave:route', routeId);
```

#### Seat Update Events

When a seat is reserved or released, the backend emits a `seat:updated` event to all clients in that route's room:

```typescript
// Event payload
{
  routeId: string;
  seatNumber: string;
  status: 'reserved' | 'available';
}
```

### Frontend (Next.js + Socket.io Client)

#### Socket Client (`frontend/app/lib/socket.ts`)

- **`getSocket()`**: Returns a singleton Socket.io client instance
- **`joinRoute(routeId)`**: Joins a specific route room
- **`leaveRoute(routeId)`**: Leaves a specific route room
- **`disconnectSocket()`**: Disconnects from the Socket.io server

#### SeatMap Component (`frontend/app/components/SeatMap.tsx`)

A reusable React component that displays a visual seat map with real-time updates:

**Props:**
- `routeId`: The route identifier
- `seats`: Array of seat objects
- `onSeatSelect`: Callback when a seat is selected
- `selectedSeat`: Currently selected seat number
- `rows`: Number of seat rows (default: 10)
- `seatsPerRow`: Seats per row (default: 4)

**Features:**
- Color-coded seats (available, reserved, selected)
- Premium seat highlighting (window seats)
- Real-time updates via Socket.io
- Automatic room joining/leaving on mount/unmount

## Usage

### Backend - Emitting Seat Updates

In your route handlers, use `emitSeatUpdate()` after modifying seat status:

```typescript
import { emitSeatUpdate } from '../lib/socket';

// After reserving a seat
await prisma.booking.create({ /* ... */ });
emitSeatUpdate(routeId, { seatNumber: 'A1', status: 'reserved' });

// After releasing a seat
await prisma.booking.update({ /* ... */ });
emitSeatUpdate(routeId, { seatNumber: 'A1', status: 'available' });
```

### Frontend - Using the SeatMap Component

```tsx
import SeatMap from '../components/SeatMap';

function BookingPage() {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState();

  const handleSeatSelect = async (seatNumber) => {
    // Reserve the seat via API
    await api.post(`/api/seats/${routeId}/select`, {
      seatNumber,
      userId: currentUser.id,
    });
    setSelectedSeat(seatNumber);
  };

  return (
    <SeatMap
      routeId={routeId}
      seats={seats}
      onSeatSelect={handleSeatSelect}
      selectedSeat={selectedSeat}
      rows={10}
      seatsPerRow={4}
    />
  );
}
```

## Testing

### Manual Testing

1. Start the backend and frontend servers
2. Open the demo page at `http://localhost:3000/demo`
3. Open the same page in multiple browser tabs
4. Select a seat in one tab and observe real-time updates in other tabs

### Socket.io Connection Test

Run the included test script to verify Socket.io connectivity:

```bash
# Make sure backend is running first
node test-socket.js
```

Expected output:
```
🧪 Testing Socket.io connection...
📡 Connecting to: http://localhost:5000

✅ Connected to Socket.io server
   Socket ID: xyz123

📥 Joining route room: route:test-route-123
📤 Emitting test seat update...
📤 Leaving route room: route:test-route-123

✅ Test completed successfully!
   Disconnecting...
```

## Environment Variables

Make sure these environment variables are configured:

### Backend (.env)
```env
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Docker Setup

The Socket.io server runs on the same port as the Express backend (5000). The docker-compose.yml is already configured with proper CORS settings:

```yaml
backend:
  environment:
    FRONTEND_URL: http://localhost:3000
  ports:
    - "5000:5000"
```

## API Endpoints

The following endpoints trigger Socket.io events:

### Reserve a Seat
```http
POST /api/seats/:routeId/select
Content-Type: application/json

{
  "seatNumber": "A1",
  "userId": "user-id"
}
```

Emits: `seat:updated` with status `reserved`

### Release a Seat
```http
POST /api/seats/:routeId/release
Content-Type: application/json

{
  "seatNumber": "A1",
  "userId": "user-id"
}
```

Emits: `seat:updated` with status `available`

## Troubleshooting

### Connection Issues

If clients can't connect to Socket.io:

1. Verify backend is running on the correct port
2. Check CORS configuration in `backend/src/lib/socket.ts`
3. Ensure `NEXT_PUBLIC_SOCKET_URL` points to the backend URL
4. Check browser console for connection errors

### Real-time Updates Not Working

1. Verify client is joining the correct route room
2. Check backend logs for Socket.io connection messages
3. Use browser dev tools Network tab to monitor WebSocket connections
4. Ensure `emitSeatUpdate()` is being called after seat changes

### CORS Errors

Make sure `FRONTEND_URL` environment variable matches your frontend URL exactly, including protocol and port.

## Performance Considerations

- Rooms are used to limit broadcast scope (only users viewing the same route receive updates)
- Socket.io automatically handles reconnection on network interruptions
- The SeatMap component efficiently updates only affected seats using React state

## Future Enhancements

- [ ] Add seat reservation timeouts (auto-release after X minutes)
- [ ] Implement optimistic UI updates
- [ ] Add connection status indicator
- [ ] Implement seat locking during selection process
- [ ] Add analytics for real-time user activity
