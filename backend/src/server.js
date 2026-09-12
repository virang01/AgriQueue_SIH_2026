import http from 'http';
import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSocketConfig } from './config/socket.js';

const server = http.createServer(app);

// Initialize Socket.IO with room support
initSocketConfig(server);

// Connect MongoDB Database
connectDB();

server.listen(config.port, () => {
  console.log(`\n🌾 AgriQueue Backend Engine Server running on port ${config.port}`);
  console.log(`🔗 REST API v1 : http://localhost:${config.port}/api/v1`);
  console.log(`⚡ Socket.IO   : http://localhost:${config.port}\n`);
});
