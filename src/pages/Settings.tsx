import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield, Smartphone, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Configurações</h1>
          <p className="text-slate-400">Gerencie sua conta, integrações e preferências do sistema.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 h-12">
            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-indigo-600"><User size={16} /> Perfil</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-indigo-600"><Bell size={16} /> Notificações</TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-indigo-600"><Shield size={16} /> Segurança</TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2 data-[state=active]:bg-indigo-600"><Smartphone size={16} /> Conexões</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription className="text-slate-500">Atualize seu nome e endereço de e-mail.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" defaultValue="Usuário ZapMRO" className="bg-slate-950 border-slate-800 focus:ring-indigo-600" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" defaultValue="admin@zapmro.cloud" className="bg-slate-950 border-slate-800 focus:ring-indigo-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <textarea 
                    id="bio" 
                    className="w-full min-h-[100px] rounded-md bg-slate-950 border border-slate-800 p-3 text-sm focus:ring-indigo-600 outline-none" 
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">Salvar Alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader>
                <CardTitle>Integrações Ativas</CardTitle>
                <CardDescription className="text-slate-500">Conecte sua conta a serviços externos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Globe size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Google Contacts</p>
                      <p className="text-xs text-slate-500">Sincronização automática de contatos</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-slate-800 hover:bg-slate-800">Conectar</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Webhooks</p>
                      <p className="text-xs text-slate-500">Receba notificações em tempo real</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-slate-800 hover:bg-slate-800">Gerenciar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
