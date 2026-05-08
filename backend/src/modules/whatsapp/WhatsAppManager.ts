import { Client, LocalAuth } from 'whatsapp-web.js';
import { Server } from 'socket.io';
import { supabase } from '../../config/supabase';

export class WhatsAppManager {
  private sessions: Map<string, Client> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async initialize() {
    // Load existing sessions from DB that were connected
    const { data: sessions, error } = await supabase
      .from('whatsapp_sessions')
      .select('*');

    if (error) {
      console.error('Error fetching sessions:', error);
      return;
    }

    // In a real scenario, we might not auto-connect all sessions on boot to save resources
    // but we'll prepare the mechanism.
  }

  async createSession(sessionId: string, name: string) {
    if (this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId);
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

    client.on('qr', (qr) => {
      console.log(`QR Code generated for session ${sessionId}`);
      this.io.emit(`qr-${sessionId}`, qr);
      
      // Update status in DB
      supabase
        .from('whatsapp_sessions')
        .update({ status: 'QR_READY' })
        .eq('id', sessionId)
        .then();
    });

    client.on('ready', () => {
      console.log(`Session ${sessionId} is ready!`);
      this.io.emit(`ready-${sessionId}`, { status: 'CONNECTED' });
      
      supabase
        .from('whatsapp_sessions')
        .update({ status: 'CONNECTED', last_connected: new Date().toISOString() })
        .eq('id', sessionId)
        .then();
    });

    client.on('authenticated', () => {
      console.log(`Session ${sessionId} authenticated`);
    });

    client.on('auth_failure', (msg) => {
      console.error(`Auth failure for session ${sessionId}:`, msg);
      this.io.emit(`error-${sessionId}`, 'Falha na autenticação');
    });

    client.on('disconnected', (reason) => {
      console.log(`Session ${sessionId} disconnected:`, reason);
      this.io.emit(`disconnected-${sessionId}`, reason);
      
      supabase
        .from('whatsapp_sessions')
        .update({ status: 'DISCONNECTED' })
        .eq('id', sessionId)
        .then();
      
      this.sessions.delete(sessionId);
    });

    try {
      await client.initialize();
      this.sessions.set(sessionId, client);
      return client;
    } catch (error) {
      console.error(`Failed to initialize session ${sessionId}:`, error);
      throw error;
    }
  }

  async getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }
}
