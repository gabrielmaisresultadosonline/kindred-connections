import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Smartphone, 
  Settings2, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  QrCode
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';

const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:4000' : 'http://167.88.42.133:4000';

const Connections = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [showQR, setShowQR] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetchSessions();

    // Initialize Socket.IO
    socketRef.current = io(BACKEND_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to backend');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const setupSocketListeners = (sessionId: string) => {
    if (!socketRef.current) return;

    // Remove existing listeners for this session
    socketRef.current.off(`qr-${sessionId}`);
    socketRef.current.off(`ready-${sessionId}`);
    socketRef.current.off(`error-${sessionId}`);

    socketRef.current.on(`qr-${sessionId}`, (qr: string) => {
      console.log('QR Code received:', qr);
      setQrCode(qr);
    });

    socketRef.current.on(`ready-${sessionId}`, (data: any) => {
      toast.success('WhatsApp Conectado!');
      setShowQR(null);
      setQrCode(null);
      fetchSessions();
    });

    socketRef.current.on(`error-${sessionId}`, (error: string) => {
      toast.error('Erro na conexão: ' + error);
    });
  };

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/sessions`);
      const data = await response.json();
      setSessions(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar sessões: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!newSessionName) {
      toast.error('Informe um nome para a sessão');
      return;
    }

    setIsCreating(true);
    try {
      const sessionId = `session_${Date.now()}`;
      
      const response = await fetch(`${BACKEND_URL}/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, name: newSessionName })
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);
      
      setSessions([{ id: sessionId, name: newSessionName, status: 'DISCONNECTED' }, ...sessions]);
      setNewSessionName('');
      setIsCreating(false);
      
      handleConnect(sessionId, newSessionName);
      fetchSessions(); // Refresh list to show the new item immediately
      
    } catch (error: any) {
      toast.error('Erro ao criar sessão: ' + error.message);
      setIsCreating(false);
    }
  };

  const handleConnect = (sessionId: string, name: string) => {
    setShowQR(sessionId);
    setQrCode(null);
    setupSocketListeners(sessionId);
    
    if (socketRef.current) {
      socketRef.current.emit('request-qr', { sessionId, name });
      toast.info('Iniciando instância do WhatsApp...');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1"><CheckCircle2 size={12} /> Conectado</Badge>;
      case 'DISCONNECTED':
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 gap-1"><AlertCircle size={12} /> Desconectado</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1"><RefreshCw size={12} className="animate-spin" /> Conectando</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Conexões WhatsApp</h1>
            <p className="text-slate-400 text-sm">Gerencie suas instâncias e escaneie o QR Code para conectar.</p>
          </div>
          <div className="flex items-center gap-3">
            <Input 
              placeholder="Nome da sessão (ex: Vendas)" 
              className="bg-slate-900 border-slate-800 text-white w-full md:w-64"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
            />
            <Button 
              onClick={handleCreateSession}
              disabled={isCreating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shrink-0"
            >
              {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              Nova Sessão
            </Button>
          </div>
        </div>

        {showQR && (
          <Card className="bg-slate-900 border-indigo-500/50 text-white animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <QrCode className="text-indigo-400" />
                Conectar WhatsApp
              </CardTitle>
              <CardDescription className="text-slate-400">
                Abra o WhatsApp no seu celular {'>'} Aparelhos Conectados {'>'} Conectar um Aparelho.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8">
              <div className="bg-white p-6 rounded-xl mb-6 shadow-2xl shadow-indigo-500/10 border-4 border-indigo-500/10">
                {qrCode ? (
                  <QRCodeSVG value={qrCode} size={256} />
                ) : (
                  <div className="w-64 h-64 bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                    <div className="text-center">
                      <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto mb-2" />
                      <p className="text-slate-500 text-xs font-medium">Iniciando motor WhatsApp...</p>
                      <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-wider">Aguarde alguns segundos</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="border-slate-800 text-slate-400 hover:bg-slate-800" onClick={() => setShowQR(null)}>
                  Cancelar
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Atualizar QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800 animate-pulse h-48" />
            ))
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <Card key={session.id} className="bg-slate-900 border-slate-800 text-white group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Smartphone size={100} />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold">{session.name}</CardTitle>
                    {getStatusBadge(session.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-xs text-slate-500 font-mono">
                    ID: {session.id.substring(0, 8)}...
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white gap-2"
                      onClick={() => handleConnect(session.id, session.name)}
                    >
                      <QrCode size={14} /> Conectar
                    </Button>
                    <Button size="icon" variant="outline" className="border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white">
                      <Settings2 size={16} />
                    </Button>
                    <Button size="icon" variant="outline" className="border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-400/5">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-slate-900/50 border border-slate-800 rounded-2xl border-dashed">
              <Smartphone size={48} className="mx-auto text-slate-700 mb-4" />
              <h3 className="text-white font-medium">Nenhuma sessão encontrada</h3>
              <p className="text-slate-500 text-sm mt-1">Comece criando sua primeira conexão acima.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Connections;