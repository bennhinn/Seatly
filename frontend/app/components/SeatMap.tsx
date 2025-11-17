'use client';

import { useEffect, useState } from 'react';
import { getSocket, joinRoute, leaveRoute } from '../lib/socket';

interface Seat {
  number: string;
  available: boolean;
  type: 'standard' | 'premium' | 'unknown';
}

interface SeatMapProps {
  routeId: string;
  seats: Seat[];
  onSeatSelect?: (seatNumber: string) => void;
  selectedSeat?: string;
  rows?: number;
  seatsPerRow?: number;
}

export default function SeatMap({
  routeId,
  seats,
  onSeatSelect,
  selectedSeat,
  rows = 10,
  seatsPerRow = 4,
}: SeatMapProps) {
  const [seatStates, setSeatStates] = useState<Seat[]>(seats);

  useEffect(() => {
    setSeatStates(seats);
  }, [seats]);

  useEffect(() => {
    // Connect to socket and join route room
    const socket = getSocket();
    joinRoute(routeId);

    // Listen for real-time seat updates
    const handleSeatUpdate = (data: {
      routeId: string;
      seatNumber: string;
      status: 'reserved' | 'available';
    }) => {
      if (data.routeId === routeId) {
        setSeatStates((prev) =>
          prev.map((seat) =>
            seat.number === data.seatNumber
              ? { ...seat, available: data.status === 'available' }
              : seat
          )
        );
      }
    };

    socket.on('seat:updated', handleSeatUpdate);

    // Cleanup on unmount
    return () => {
      socket.off('seat:updated', handleSeatUpdate);
      leaveRoute(routeId);
    };
  }, [routeId]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.available && onSeatSelect) {
      onSeatSelect(seat.number);
    }
  };

  const getSeatColor = (seat: Seat): string => {
    if (selectedSeat === seat.number) {
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
    if (!seat.available) {
      return 'bg-gray-300 cursor-not-allowed text-gray-500';
    }
    if (seat.type === 'premium') {
      return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-400 cursor-pointer';
    }
    return 'bg-green-100 hover:bg-green-200 border-green-400 cursor-pointer';
  };

  // Organize seats into grid layout
  const seatGrid: Seat[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: Seat[] = [];
    for (let j = 0; j < seatsPerRow; j++) {
      const index = i * seatsPerRow + j;
      if (index < seatStates.length) {
        row.push(seatStates[index]);
      }
    }
    if (row.length > 0) {
      seatGrid.push(row);
    }
  }

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 border border-green-400 rounded"></div>
          <span>Available (Standard)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-100 border border-yellow-400 rounded"></div>
          <span>Available (Premium)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <span>Reserved</span>
        </div>
      </div>

      {/* Bus front indicator */}
      <div className="text-center mb-4">
        <div className="inline-block px-6 py-2 bg-gray-200 rounded-t-lg font-medium text-gray-700">
          🚌 Front
        </div>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col items-center gap-2">
        {seatGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((seat, seatIndex) => {
              // Add aisle in the middle
              const showAisle = seatsPerRow === 4 && seatIndex === 2;
              return (
                <div key={seat.number} className="flex gap-2">
                  {showAisle && <div className="w-8"></div>}
                  <button
                    onClick={() => handleSeatClick(seat)}
                    disabled={!seat.available}
                    className={`
                      w-12 h-12 rounded border-2 font-medium text-xs
                      transition-all duration-200
                      ${getSeatColor(seat)}
                      ${seat.available ? 'hover:scale-105' : ''}
                    `}
                    title={`Seat ${seat.number} - ${
                      seat.available ? 'Available' : 'Reserved'
                    } (${seat.type})`}
                  >
                    {seat.number}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bus back indicator */}
      <div className="text-center mt-4">
        <div className="inline-block px-6 py-2 bg-gray-200 rounded-b-lg font-medium text-gray-700">
          🚪 Back
        </div>
      </div>
    </div>
  );
}
