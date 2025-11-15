'use client';

import { useEffect, useState } from 'react';
import SeatMap from '../components/SeatMap';
import { api } from '../lib/api';

interface Seat {
  number: string;
  available: boolean;
  type: 'standard' | 'premium' | 'unknown';
}

interface SeatsResponse {
  success: boolean;
  data: {
    routeId: string;
    seats: Seat[];
  };
}

export default function DemoPage() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | undefined>();
  const [routeId, setRouteId] = useState<string>('demo-route-123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadSeats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<SeatsResponse>(`/api/seats/${routeId}`);
      if (response.success && response.data.seats) {
        setSeats(response.data.seats);
      }
    } catch (err) {
      console.error('Failed to load seats:', err);
      setError('Failed to load seats. Using demo data instead.');
      // Generate demo seats if API fails
      const demoSeats: Seat[] = [];
      for (let row = 0; row < 10; row++) {
        const rowLetter = String.fromCharCode(65 + row);
        for (let col = 1; col <= 4; col++) {
          const seatNumber = `${rowLetter}${col}`;
          demoSeats.push({
            number: seatNumber,
            available: Math.random() > 0.3, // 70% available
            type: col === 1 || col === 4 ? 'premium' : 'standard',
          });
        }
      }
      setSeats(demoSeats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeats();
  }, [routeId]);

  const handleSeatSelect = async (seatNumber: string) => {
    console.log('Selected seat:', seatNumber);
    setSelectedSeat(seatNumber);

    // Try to reserve the seat via API
    try {
      const response = await api.post(`/api/seats/${routeId}/select`, {
        seatNumber,
        userId: 'demo-user-123',
      });
      console.log('Seat reserved:', response);
    } catch (err) {
      console.error('Failed to reserve seat:', err);
      // Still allow selection in demo mode
    }
  };

  const handleReleaseSeat = async () => {
    if (!selectedSeat) return;

    try {
      const response = await api.post(`/api/seats/${routeId}/release`, {
        seatNumber: selectedSeat,
        userId: 'demo-user-123',
      });
      console.log('Seat released:', response);
      setSelectedSeat(undefined);
    } catch (err) {
      console.error('Failed to release seat:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SeatMap Component Demo
          </h1>
          <p className="text-gray-600 mb-4">
            This page demonstrates the real-time seat selection component with Socket.io integration.
          </p>

          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-yellow-800">{error}</p>
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="routeId" className="block text-sm font-medium text-gray-700 mb-1">
                Route ID
              </label>
              <input
                type="text"
                id="routeId"
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter route ID"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={loadSeats}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Loading...' : 'Load Seats'}
              </button>
            </div>
          </div>

          {selectedSeat && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <div className="flex justify-between items-center">
                <p className="text-blue-800 font-medium">
                  Selected Seat: {selectedSeat}
                </p>
                <button
                  onClick={handleReleaseSeat}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                >
                  Release Seat
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {seats.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No seats loaded. Click "Load Seats" to fetch seat data.</p>
            </div>
          ) : (
            <SeatMap
              routeId={routeId}
              seats={seats}
              onSeatSelect={handleSeatSelect}
              selectedSeat={selectedSeat}
              rows={10}
              seatsPerRow={4}
            />
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Features Demonstrated:
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Real-time seat updates via Socket.io</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Visual seat grid with color-coded availability</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Premium seats (window seats) highlighted in yellow</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Room-based socket connections per route</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Seat selection and release functionality</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Open this page in multiple browser tabs to see real-time updates in action.
          </p>
        </div>
      </div>
    </div>
  );
}
