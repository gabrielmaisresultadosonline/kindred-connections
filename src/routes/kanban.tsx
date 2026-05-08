import { createFileRoute } from '@tanstack/react-router';
import Kanban from '@/pages/Kanban';

export const Route = createFileRoute('/kanban')({
  component: Kanban,
});
