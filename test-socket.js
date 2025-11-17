#!/usr/bin/env node

/**
 * Simple Socket.io connection test
 * Run this to verify the socket server is working
 */

const { io } = require('socket.io-client');

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:5000';
const ROUTE_ID = 'test-route-123';

console.log('🧪 Testing Socket.io connection...');
console.log(`📡 Connecting to: ${SOCKET_URL}\n`);

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 3,
});

socket.on('connect', () => {
  console.log('✅ Connected to Socket.io server');
  console.log(`   Socket ID: ${socket.id}\n`);

  // Test joining a route room
  console.log(`📥 Joining route room: route:${ROUTE_ID}`);
  socket.emit('join:route', ROUTE_ID);

  // Wait a moment then emit a test event
  setTimeout(() => {
    console.log('\n📤 Emitting test seat update...');
    socket.emit('seat:select', {
      routeId: ROUTE_ID,
      seatNumber: 'A1',
      status: 'reserved',
    });
  }, 1000);

  // Test leaving after a delay
  setTimeout(() => {
    console.log(`\n📤 Leaving route room: route:${ROUTE_ID}`);
    socket.emit('leave:route', ROUTE_ID);

    setTimeout(() => {
      console.log('\n✅ Test completed successfully!');
      console.log('   Disconnecting...');
      socket.disconnect();
      process.exit(0);
    }, 500);
  }, 2000);
});

socket.on('seat:updated', (data) => {
  console.log('📬 Received seat update:', data);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from Socket.io server');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.log('\n💡 Make sure the backend server is running on', SOCKET_URL);
  process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error('\n⏱️  Test timeout - server may not be responding');
  socket.disconnect();
  process.exit(1);
}, 10000);
