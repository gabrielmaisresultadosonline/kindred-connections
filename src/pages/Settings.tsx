import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Power, RefreshCw, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">WhatsApp Sessions</h1>
            <p className="text-slate-500 mt-2">Manage your WhatsApp device connections and sessions.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> New Session
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">Suporte Vendas</CardTitle>
                <div className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                  Ready
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                  <Smartphone size={16} />
                  <span>+55 (11) 99999-9999</span>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="mr-2 h-3.5 w-3.5" /> Restart
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100">
                    <Power className="mr-2 h-3.5 w-3.5" /> Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Card className="border-slate-200 shadow-sm border-dashed border-2 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 mb-4 shadow-sm">
              <Plus className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Connect New Device</h3>
            <p className="text-sm text-slate-500 mt-2 mb-6 max-w-[200px]">Add another WhatsApp session to start managing more chats.</p>
            <Button variant="secondary" className="w-full">Get QR Code</Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
