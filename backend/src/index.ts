import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { WhatsAppManager } from './modules/whatsapp/WhatsAppManager';
import { getDb } from './config/database';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const whatsappManager = new WhatsAppManager(io);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ZapMRO Backend Running');
});

// Endpoint to list sessions
app.get('/sessions', async (req, res) => {
  try {
    const db = await getDb();
    const sessions = await db.all('SELECT * FROM whatsapp_sessions ORDER BY created_at DESC');
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to start a new session
app.post('/sessions/start', async (req, res) => {
  const { sessionId, name } = req.body;
  try {
    await whatsappManager.createSession(sessionId, name);
    res.json({ success: true, message: 'Session initialization started' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('request-qr', async (data) => {
    const { sessionId, name } = data;
    try {
      await whatsappManager.createSession(sessionId, name);
    } catch (error) {
      socket.emit('error', 'Failed to start session');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  whatsappManager.initialize();
});
