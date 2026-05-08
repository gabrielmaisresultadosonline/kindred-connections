import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Automations = () => {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Fluxos de Automação</h2>
          <p className="text-slate-500">O construtor visual de fluxos está em desenvolvimento.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Automations;
