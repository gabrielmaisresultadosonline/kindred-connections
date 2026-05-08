import { createFileRoute } from '@tanstack/react-router';
import Auth from '@/pages/Auth';

export const Route = createFileRoute('/auth')({
  beforeLoad: async ({ context }) => {
    // We can't easily access the zustand store here without initialize()
    // but the DashboardLayout handles the redirect if session exists.
    // For better UX, we could try to check session here too.
  },
  component: Auth,
});
