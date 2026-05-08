import { Client, LocalAuth } from 'whatsapp-web.js';
import { Server } from 'socket.io';
import { getDb } from '../../config/database';

export class WhatsAppManager {
  private sessions: Map<string, Client> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async initialize() {
    const db = await getDb();
    const sessions = await db.all('SELECT * FROM whatsapp_sessions');
    console.log(`Loaded ${sessions.length} sessions from local database.`);
  }

  async createSession(sessionId: string, name: string) {
    console.log(`Creating session for ${name} (${sessionId})`);
    if (this.sessions.has(sessionId)) {
      console.log(`Session ${sessionId} already exists, returning existing client.`);
      const existingClient = this.sessions.get(sessionId)!;
      // If it exists but we need a QR, it might be waiting
      return existingClient;
    }

    const db = await getDb();
    
    // Ensure session exists in local DB
    const existing = await db.get('SELECT id FROM whatsapp_sessions WHERE id = ?', sessionId);
    if (!existing) {
      await db.run(
        'INSERT INTO whatsapp_sessions (id, name, status) VALUES (?, ?, ?)',
        sessionId, name, 'DISCONNECTED'
      );
    }

    const client = new Client({
      authStrategy: new LocalAuth({ clientId: sessionId }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ],
        executablePath: process.env.CHROME_PATH || '/usr/bin/chromium-browser'
      }
    });

    client.on('qr', async (qr) => {
      console.log(`QR Code generated for session ${sessionId}`);
      this.io.emit(`qr-${sessionId}`, qr);
      
      const db = await getDb();
      await db.run('UPDATE whatsapp_sessions SET status = ? WHERE id = ?', 'QR_READY', sessionId);
    });

    client.on('ready', async () => {
      console.log(`Session ${sessionId} is ready!`);
      this.io.emit(`ready-${sessionId}`, { status: 'CONNECTED' });
      
      const db = await getDb();
      await db.run(
        'UPDATE whatsapp_sessions SET status = ?, last_connected = ? WHERE id = ?',
        'CONNECTED', new Date().toISOString(), sessionId
      );
    });

    client.on('disconnected', async (reason) => {
      console.log(`Session ${sessionId} disconnected:`, reason);
      this.io.emit(`disconnected-${sessionId}`, reason);
      
      const db = await getDb();
      await db.run('UPDATE whatsapp_sessions SET status = ? WHERE id = ?', 'DISCONNECTED', sessionId);
      
      this.sessions.delete(sessionId);
    });

    try {
      console.log(`Initializing WhatsApp client for session ${sessionId}...`);
      client.initialize().catch(err => {
        console.error(`Client initialize failed for ${sessionId}:`, err);
      });
      this.sessions.set(sessionId, client);
      return client;
    } catch (error) {
      console.error(`Failed to setup session ${sessionId}:`, error);
      throw error;
    }
  }

  async getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }
}

