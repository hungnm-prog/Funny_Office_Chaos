import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// Serve static assets from dist
app.use(express.static(DIST_DIR));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    activeClients: wss.clients.size,
    timestamp: new Date().toISOString(),
  });
});

// Real-time connected players store (in-memory)
const activePlayers = new Map();

// WebSocket connection handling
wss.on('connection', (ws) => {
  let playerId = null;

  // Send current active players to newly connected client
  const currentPlayers = Array.from(activePlayers.values());
  ws.send(
    JSON.stringify({
      type: 'INIT_STATE',
      data: {
        players: currentPlayers,
        totalOnline: wss.clients.size,
      },
    })
  );

  ws.on('message', (messageRaw) => {
    try {
      const payload = JSON.parse(messageRaw.toString());
      const { type, data } = payload;

      switch (type) {
        case 'PLAYER_JOIN':
          playerId = data.id;
          activePlayers.set(playerId, { ...data, lastSeen: Date.now() });
          broadcastExcept(ws, {
            type: 'PLAYER_JOINED',
            data: data,
          });
          break;

        case 'PLAYER_MOVE':
          if (playerId && activePlayers.has(playerId)) {
            const player = activePlayers.get(playerId);
            player.position = data.position;
            player.direction = data.direction;
            player.isMoving = data.isMoving;
            player.isSitting = data.isSitting;
            player.sittingSeatId = data.sittingSeatId;
            player.currentAction = data.currentAction;
            player.lastSeen = Date.now();

            broadcastExcept(ws, {
              type: 'PLAYER_MOVED',
              data: {
                id: playerId,
                position: data.position,
                direction: data.direction,
                isMoving: data.isMoving,
                isSitting: data.isSitting,
                sittingSeatId: data.sittingSeatId,
                currentAction: data.currentAction,
              },
            });
          }
          break;

        case 'NEW_CHAT':
          if (data && data.senderId) {
            if (activePlayers.has(data.senderId)) {
              const p = activePlayers.get(data.senderId);
              p.lastMessage = data.content;
              p.lastMessageTime = data.timestamp;
            }
            broadcastAll({
              type: 'NEW_CHAT',
              data: data,
            });
          }
          break;

        case 'PLAYER_STATUS':
          if (playerId && activePlayers.has(playerId)) {
            const player = activePlayers.get(playerId);
            player.status = data.status;
            broadcastExcept(ws, {
              type: 'PLAYER_STATUS_CHANGED',
              data: { id: playerId, status: data.status },
            });
          }
          break;

        case 'HEARTBEAT':
          if (playerId && activePlayers.has(playerId)) {
            activePlayers.get(playerId).lastSeen = Date.now();
          }
          break;

        default:
          break;
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    if (playerId) {
      activePlayers.delete(playerId);
      broadcastAll({
        type: 'PLAYER_LEFT',
        data: { id: playerId },
      });
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket client error:', err.message);
  });
});

// Broadcast helper functions
function broadcastAll(payload) {
  const json = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

function broadcastExcept(senderWs, payload) {
  const json = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

// Fallback all non-file routes to index.html for SPA
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Công Sở Ảo Game Server is running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`⚡ WebSocket path: ws://localhost:${PORT}/ws`);
});
