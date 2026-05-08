import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, CheckCircle2, AlertCircle, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const stats = [
    { title: "Total Messages", value: "24,582", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Contacts", value: "1,284", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Flows Triggered", value: "852", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Conversion Rate", value: "12.5%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, Admin</h1>
          <p className="text-slate-500 mt-2">Here's what's happening with your WhatsApp CRM today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1 text-slate-900">{stat.value}</h3>
                    </div>
                    <div className={cn("p-3 rounded-xl", stat.bg)}>
                      <stat.icon size={24} className={stat.color} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent WhatsApp Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Suporte Vendas", status: "Online", icon: CheckCircle2, color: "text-emerald-500" },
                  { name: "Atendimento SAC", status: "Offline", icon: AlertCircle, color: "text-rose-500" },
                  { name: "Recuperação de Carrinho", status: "Online", icon: CheckCircle2, color: "text-emerald-500" },
                ].map((session) => (
                  <div key={session.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                        <MessageSquare size={18} className="text-slate-400" />
                      </div>
                      <span className="font-medium text-slate-700">{session.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <session.icon size={16} className={session.color} />
                      <span className="text-sm font-medium text-slate-500">{session.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent CRM Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "John Doe", action: "Moved to 'Closed Won'", time: "2 mins ago" },
                  { user: "Sarah Smith", action: "New message received", time: "15 mins ago" },
                  { user: "Mike Johnson", action: "Assigned to 'Support Team'", time: "1 hour ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4 p-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
                    <div>
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
