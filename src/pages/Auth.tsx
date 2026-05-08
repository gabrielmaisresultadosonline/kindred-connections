import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Mail, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { session, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (session) {
      navigate({ to: '/' });
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Bem-vindo ao ZapMRO Cloud!');
      navigate({ to: '/' });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;
      
      // If user is auto-confirmed or already has a session, navigate
      if (data?.session) {
        toast.success('Conta criada com sucesso!');
        navigate({ to: '/' });
      } else {
        toast.success('Conta criada! Verifique seu e-mail para confirmar.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/20">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ZapMRO Cloud</h1>
          <p className="text-slate-400 mt-2">O CRM WhatsApp mais completo do mercado</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-slate-800">
            <TabsTrigger value="login" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader>
                <CardTitle>Acessar plataforma</CardTitle>
                <CardDescription className="text-slate-400">Insira suas credenciais para continuar.</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        className="bg-slate-950 border-slate-800 pl-10 focus:ring-indigo-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <button type="button" className="text-xs text-indigo-400 hover:underline">Esqueceu a senha?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="password" 
                        type="password" 
                        className="bg-slate-950 border-slate-800 pl-10 focus:ring-indigo-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Entrar'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader>
                <CardTitle>Criar sua conta</CardTitle>
                <CardDescription className="text-slate-400">Comece hoje mesmo sua automação profissional.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="João Silva" 
                        className="bg-slate-950 border-slate-800 pl-10 focus:ring-indigo-600"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        className="bg-slate-950 border-slate-800 pl-10 focus:ring-indigo-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input 
                        id="reg-password" 
                        type="password" 
                        className="bg-slate-950 border-slate-800 pl-10 focus:ring-indigo-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Criar Conta'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-slate-500">
          Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  );
};

export default Auth;
