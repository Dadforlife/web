-- ============================================
-- Dad for Life - Schéma initial
-- ============================================

-- Activation de l'extension UUID
create extension if not exists "uuid-ossp";

-- ============================================
-- Table: users (profils membres)
-- ============================================
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text not null,
  phone text,
  role text not null default 'member' check (role in ('member', 'admin', 'partner')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS (Row Level Security)
alter table public.users enable row level security;

create policy "Les utilisateurs voient leur propre profil"
  on public.users for select
  using (auth.uid() = id);

create policy "Les utilisateurs modifient leur propre profil"
  on public.users for update
  using (auth.uid() = id);

-- ============================================
-- Table: partners (annuaire partenaires)
-- ============================================
create table public.partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null check (type in ('avocat', 'mediateur', 'coach', 'psychologue', 'autre')),
  description text,
  email text,
  phone text,
  website text,
  location text,
  city text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.partners enable row level security;

create policy "Tout le monde peut voir les partenaires actifs"
  on public.partners for select
  using (is_active = true);

-- ============================================
-- Table: program_modules (les 6 modules du programme)
-- ============================================
create table public.program_modules (
  id uuid primary key default uuid_generate_v4(),
  module_number integer unique not null check (module_number between 1 and 6),
  title text not null,
  description text,
  content text,
  video_url text,
  duration_minutes integer,
  created_at timestamptz not null default now()
);

alter table public.program_modules enable row level security;

create policy "Tout le monde peut voir les modules"
  on public.program_modules for select
  using (true);

-- ============================================
-- Table: program_progress (suivi par utilisateur)
-- ============================================
create table public.program_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  module_number integer not null check (module_number between 1 and 6),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, module_number)
);

alter table public.program_progress enable row level security;

create policy "Les utilisateurs voient leur propre progression"
  on public.program_progress for select
  using (auth.uid() = user_id);

create policy "Les utilisateurs modifient leur propre progression"
  on public.program_progress for all
  using (auth.uid() = user_id);

-- ============================================
-- Table: events (calendrier visio)
-- ============================================
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  event_date timestamptz not null,
  duration_minutes integer not null default 60,
  visio_link text,
  max_participants integer,
  created_by uuid references public.users(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Tout le monde peut voir les événements actifs"
  on public.events for select
  using (is_active = true);

-- ============================================
-- Table: event_registrations (inscriptions aux événements)
-- ============================================
create table public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique(event_id, user_id)
);

alter table public.event_registrations enable row level security;

create policy "Les utilisateurs voient leurs propres inscriptions"
  on public.event_registrations for select
  using (auth.uid() = user_id);

create policy "Les utilisateurs gèrent leurs propres inscriptions"
  on public.event_registrations for all
  using (auth.uid() = user_id);

-- ============================================
-- Fonction de mise à jour automatique de updated_at
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers updated_at
create trigger set_updated_at before update on public.users
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.partners
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.program_progress
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.events
  for each row execute function public.handle_updated_at();
