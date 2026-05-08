import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutDashboard, MessageSquare, Users, Kanban, Share2, Settings, BarChart3, LogOut, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';

const Sidebar = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'Chats', path: '/chats' },
    { icon: Kanban, label: 'CRM Kanban', path: '/kanban' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
    { icon: Share2, label: 'Automations', path: '/automations' },
    { icon: Zap, label: 'Campaigns', path: '/campaigns' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Zap className="text-white fill-white" size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight">ZapMRO</span>
          <span className="text-indigo-400 text-[10px] font-bold tracking-[0.2em] uppercase -mt-1">Cloud CRM</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path as any}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-white"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
