import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Kanban = () => {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Módulo CRM Kanban</h2>
          <p className="text-slate-500">Seu funil de vendas será exibido aqui em breve.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Kanban;
