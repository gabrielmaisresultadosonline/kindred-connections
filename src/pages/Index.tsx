import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Zap, BarChart3, Clock, TrendingUp, Settings } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const StatCard = ({ title, value, icon: Icon, description, trend }: any) => (
  <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden relative group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
      <Icon size={80} />
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
        <Icon size={16} className="text-indigo-400" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center gap-2 mt-1">
        <span className={trend > 0 ? "text-emerald-400 text-xs font-medium" : "text-rose-400 text-xs font-medium"}>
          {trend > 0 ? "+" : ""}{trend}%
        </span>
        <span className="text-slate-500 text-xs">{description}</span>
      </div>
    </CardContent>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600/20 group-hover:bg-indigo-600 transition-colors" />
  </Card>
);

const Index = () => {
  const stats = [
    { title: 'Total de Chats', value: '1,284', icon: MessageSquare, description: 'vs mês passado', trend: 12 },
    { title: 'Contatos Ativos', value: '852', icon: Users, description: 'vs mês passado', trend: 8 },
    { title: 'Campanhas Enviadas', value: '45', icon: Zap, description: 'vs mês passado', trend: 15 },
    { title: 'Taxa de Conversão', value: '24.8%', icon: BarChart3, description: 'vs mês passado', trend: -2 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400">Bem-vindo ao ZapMRO Cloud. Aqui está o resumo das suas operações.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} className="text-indigo-400" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <MessageSquare size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Novo chat de +55 11 99999-9999</p>
                      <p className="text-xs text-slate-500">Há 5 minutos • Setor de Vendas</p>
                    </div>
                    <button className="text-xs text-indigo-400 hover:underline">Visualizar</button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-400" />
                Sessões WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-400/5 border border-emerald-400/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-emerald-400">Suporte Principal</p>
                      <p className="text-[10px] text-slate-500">Conectado • +55 11 ...</p>
                    </div>
                  </div>
                  <Settings size={14} className="text-slate-500 cursor-pointer hover:text-white" />
                </div>
                
                <div className="p-4 rounded-lg bg-rose-400/5 border border-rose-400/20 flex items-center justify-between opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <div>
                      <p className="text-sm font-medium text-rose-400">Vendas Campinas</p>
                      <p className="text-[10px] text-slate-500">Desconectado</p>
                    </div>
                  </div>
                  <Settings size={14} className="text-slate-500 cursor-pointer hover:text-white" />
                </div>

                <Link 
                  to="/connections"
                  className="w-full mt-4 flex items-center justify-center py-2 rounded-lg border border-dashed border-slate-700 text-slate-400 text-sm hover:border-indigo-600 hover:text-indigo-400 transition-all"
                >
                  + Adicionar Nova Sessão
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
