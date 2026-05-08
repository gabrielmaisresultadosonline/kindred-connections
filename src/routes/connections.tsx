import { createFileRoute } from '@tanstack/react-router';
import Connections from '@/pages/Connections';

export const Route = createFileRoute('/connections')({
  component: Connections,
});