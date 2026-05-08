import { createFileRoute } from '@tanstack/react-router';
import Automations from '@/pages/Automations';

export const Route = createFileRoute('/automations')({
  component: Automations,
});
