-- Core Profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Sessions
CREATE TABLE public.whatsapp_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'disconnected', -- 'disconnected', 'qr', 'authenticated', 'ready'
    qr_code TEXT,
    proxy_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    number TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, number)
);

-- Kanban
CREATE TABLE public.kanban_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.kanban_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    column_id UUID REFERENCES public.kanban_columns(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chats and Messages
CREATE TABLE public.chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.whatsapp_sessions(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    last_message TEXT,
    unread_count INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
    body TEXT,
    type TEXT DEFAULT 'text',
    from_me BOOLEAN DEFAULT false,
    media_url TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Automations
CREATE TABLE public.automation_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.flow_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flow_id UUID REFERENCES public.automation_flows(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'trigger', 'message', 'delay', 'condition'
    data JSONB DEFAULT '{}'::jsonb,
    position_x FLOAT DEFAULT 0,
    position_y FLOAT DEFAULT 0
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_nodes ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified: Owner Access)
CREATE POLICY "Users can manage their own profiles" ON public.profiles USING (auth.uid() = id);
CREATE POLICY "Users can manage their own sessions" ON public.whatsapp_sessions USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own contacts" ON public.contacts USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own kanban_columns" ON public.kanban_columns USING (auth.uid() = user_id);
CREATE POLICY "Users can manage cards via column" ON public.kanban_cards USING (EXISTS (SELECT 1 FROM public.kanban_columns c WHERE c.id = column_id AND c.user_id = auth.uid()));
CREATE POLICY "Users can manage chats via session" ON public.chats USING (EXISTS (SELECT 1 FROM public.whatsapp_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "Users can manage messages via chat" ON public.messages USING (EXISTS (SELECT 1 FROM public.chats c JOIN public.whatsapp_sessions s ON c.session_id = s.id WHERE c.id = chat_id AND s.user_id = auth.uid()));
CREATE POLICY "Users can manage their own flows" ON public.automation_flows USING (auth.uid() = user_id);
CREATE POLICY "Users can manage nodes via flow" ON public.flow_nodes USING (EXISTS (SELECT 1 FROM public.automation_flows f WHERE f.id = flow_id AND f.user_id = auth.uid()));
