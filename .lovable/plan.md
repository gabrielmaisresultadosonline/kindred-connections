# Plan: ZapMRO Cloud - Professional WhatsApp CRM SaaS

Implement a fullstack professional CRM inspired by advanced omnichannel platforms, featuring multi-session WhatsApp integration, AI automations, and Kanban management.

## Technical Stack
- **Frontend**: React (Next.js/TanStack), TailwindCSS, Shadcn/UI, Framer Motion, Socket.IO Client.
- **Backend**: Node.js, Express, Socket.IO, Prisma ORM, PostgreSQL.
- **Infrastructure**: Lovable Cloud (PostgreSQL, Auth), VPS-ready architecture.

## 1. Database Schema (Lovable Cloud)
Create the core schema using migrations:
- `profiles`: User extensions.
- `whatsapp_sessions`: WhatsApp connection states.
- `contacts`: Customer database.
- `chats` & `messages`: Real-time conversation storage.
- `kanban_columns` & `kanban_cards`: CRM workflow.
- `tags`: Segmentation.
- `automations` & `flow_nodes`: Visual builder logic.
- `campaigns`: Winback and broadcast management.

## 2. Backend Infrastructure
Setup the Express/Node.js environment (ready for VPS):
- Modular architecture (`src/modules/*`).
- JWT Authentication & RBAC.
- Socket.IO for real-time events (new messages, QR code updates).
- Prisma client integration.

## 3. WhatsApp Integration (Architecture)
- Implement `whatsapp-web.js` logic ready for VPS deployment.
- Handle QR code generation events and relay to frontend via sockets.
- Multi-session management (one client per user/business).

## 4. Frontend Implementation
- **Dashboard**: Modern analytics overview.
- **CRM Kanban**: Drag-and-drop interface for lead management.
- **Chat Center**: Real-time WhatsApp-style UI with attachments and audio.
- **Automation Builder**: Visual node-based editor for flows.
- **Settings**: Session management and profile configuration.

## 5. Deployment Readiness
- Provide `Dockerfile` and `docker-compose.yml`.
- Nginx configuration for reverse proxy.
- PM2 ecosystem setup.

## Technical Details
- Using **TanStack Start** for the frontend architecture.
- Real-time updates via **Socket.IO** (simulated in Lovable preview, functional on VPS).
- Database migrations will be handled via the `supabase--migration` tool.
