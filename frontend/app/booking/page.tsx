'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { api } from '../lib/api';
import SeatMap from '../components/SeatMap';

interface Route {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  totalSeats: number;
  bookedSeats: number;
}

interface Seat {
  number: string;
  available: boolean;
  type: 'standard' | 'premium' | 'unknown';
}

interface ApiRoute {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  totalSeats: number;
  bookedSeats: number;
}

export default function BookingPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchFrom, setSearchFrom] = useState<string>('');
  const [searchTo, setSearchTo] = useState<string>('');
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Fetch routes on mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await api.get<{ success: boolean; data: ApiRoute[] }>('/api/seats');
        if (response.success && response.data) {
          setRoutes(response.data);
          setFilteredRoutes(response.data);
        }
      } catch (err) {
        setError('Failed to load routes');
        console.error(err);
      }
    };
    fetchRoutes();
  }, []);

  // Fetch or create user on mount
  useEffect(() => {
    const initUser = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Array<{ id: string; email: string }> }>('/api/admin/users');
        if (response.success && response.data.length > 0) {
          setCurrentUserId(response.data[0].id);
          console.log('Using user:', response.data[0].email);
        }
      } catch (err) {
        console.error('Failed to get user:', err);
      }
    };
    initUser();
  }, []);

  // Filter routes when search criteria changes
  useEffect(() => {
    if (!searchFrom && !searchTo) {
      setFilteredRoutes(routes);
      return;
    }

    const filtered = routes.filter((route) => {
      const matchFrom = !searchFrom || route.origin.toLowerCase().includes(searchFrom.toLowerCase());
      const matchTo = !searchTo || route.destination.toLowerCase().includes(searchTo.toLowerCase());
      return matchFrom && matchTo;
    });

    setFilteredRoutes(filtered);
  }, [searchFrom, searchTo, routes]);

  // Handle route selection and fetch seats
  const handleRouteSelect = async (route: Route) => {
    setSelectedRoute(route);
    setSelectedSeat('');
    setLoading(true);
    setError('');
    try {
      const response = await api.get<{ success: boolean; data: { seats: Seat[] } }>(`/api/seats/${route.id}`);
      if (response.success && response.data.seats) {
        setSeats(response.data.seats);
        console.log(`Loaded ${response.data.seats.length} seats for route ${route.id}`);
      } else {
        setSeats([]);
        setError('No seats available for this route');
      }
    } catch (err) {
      setError('Failed to load seats');
      console.error(err);
      setSeats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = async (seatNumber: string) => {
    if (!currentUserId) {
      setError('Please wait, initializing session...');
      return;
    }

    setSelectedSeat(seatNumber);
    
    if (selectedRoute) {
      try {
        await api.post(`/api/seats/${selectedRoute.id}/select`, {
          seatNumber,
          userId: currentUserId,
        });
        console.log(`Seat ${seatNumber} reserved successfully`);
      } catch (err: any) {
        console.error('Failed to reserve seat:', err);
        setError('Failed to reserve seat. It may already be taken.');
        setSelectedSeat('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Seatly
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/booking" className="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Book Now
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Your Seat</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Search Form */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Search Routes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    id="from"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter origin (e.g., Nairobi)"
                  />
                </div>
                <div>
                  <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    id="to"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter destination (e.g., Mombasa)"
                  />
                </div>
              </div>
              {(searchFrom || searchTo) && (
                <p className="mt-2 text-sm text-gray-600">
                  Found {filteredRoutes.length} route{filteredRoutes.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Route Selection */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Available Routes</h2>
              {error && !loading && <p className="text-red-500 mb-4">{error}</p>}
              {filteredRoutes.length === 0 ? (
                <p className="text-gray-500">
                  {routes.length === 0 ? 'Loading routes...' : 'No routes found. Try different search criteria.'}
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredRoutes.map((route) => (
                    <div
                      key={route.id}
                      onClick={() => handleRouteSelect(route)}
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedRoute?.id === route.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-lg">{route.origin} → {route.destination}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(route.departureTime).toLocaleString('en-KE', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {route.totalSeats - route.bookedSeats} available
                          </p>
                          <p className="text-xs text-gray-500">
                            of {route.totalSeats} seats
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Seat Map */}
            {selectedRoute && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Select Your Seat</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-500">Loading seats...</p>
                  </div>
                ) : seats.length > 0 ? (
                  <SeatMap
                    routeId={selectedRoute.id}
                    seats={seats}
                    onSeatSelect={handleSeatSelect}
                    selectedSeat={selectedSeat}
                  />
                ) : (
                  <p className="text-gray-500 text-center py-8">No seats available for this route.</p>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium text-right text-sm">{selectedRoute ? `${selectedRoute.origin} → ${selectedRoute.destination}` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat:</span>
                  <span className="font-medium">{selectedSeat || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-right text-sm">
                    {selectedRoute ? new Date(selectedRoute.departureTime).toLocaleDateString('en-KE') : '-'}
                  </span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>KES {selectedSeat ? '1,500' : '0'}</span>
                </div>
              </div>
              <button
                disabled={!selectedSeat}
                className={`w-full mt-6 px-4 py-2 rounded-md transition-colors ${
                  selectedSeat ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
