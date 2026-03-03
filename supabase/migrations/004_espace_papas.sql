-- ============================================
-- Espace Papas - Forum des pères (Dad for Life)
-- Tables : categories, discussions, messages, reports
-- ============================================

-- ============================================
-- Table: categories (thématiques du forum)
-- ============================================
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Tout le monde peut lire les catégories"
  on public.categories for select
  using (true);

-- Seed des catégories initiales
insert into public.categories (name, slug) values
  ('Garde & procédures', 'garde-procedures'),
  ('Relation avec la maman', 'relation-maman'),
  ('Éducation & enfants', 'education-enfants'),
  ('Moral & solitude', 'moral-solitude'),
  ('Victoires & témoignages', 'victoires-temoignages'),
  ('Questions diverses', 'questions-diverses')
on conflict (slug) do nothing;

-- ============================================
-- Table: discussions
-- ============================================
create table if not exists public.discussions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  author_id uuid not null references public.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  is_anonymous boolean not null default false,
  status text not null default 'active' check (status in ('active', 'flagged', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_discussions_author_id on public.discussions(author_id);
create index if not exists idx_discussions_category_id on public.discussions(category_id);
create index if not exists idx_discussions_created_at on public.discussions(created_at desc);
create index if not exists idx_discussions_status on public.discussions(status);

alter table public.discussions enable row level security;

create policy "Utilisateurs connectés peuvent lire les discussions actives ou archivées"
  on public.discussions for select
  using (auth.uid() is not null and status in ('active', 'archived'));

create policy "Utilisateurs connectés peuvent créer une discussion"
  on public.discussions for insert
  with check (auth.uid() = author_id);

create policy "Auteur peut modifier sa discussion"
  on public.discussions for update
  using (auth.uid() = author_id);

-- Admins peuvent tout voir et modérer
create policy "Admins can manage discussions"
  on public.discussions for all
  using (public.is_admin());

-- Trigger updated_at
create trigger set_discussions_updated_at before update on public.discussions
  for each row execute function public.handle_updated_at();

-- ============================================
-- Table: messages (réponses aux discussions)
-- ============================================
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  content text not null,
  author_id uuid not null references public.users(id) on delete cascade,
  discussion_id uuid not null references public.discussions(id) on delete cascade,
  is_flagged boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_discussion_id on public.messages(discussion_id);
create index if not exists idx_messages_author_id on public.messages(author_id);
create index if not exists idx_messages_created_at on public.messages(created_at);

alter table public.messages enable row level security;

create policy "Utilisateurs connectés peuvent lire les messages"
  on public.messages for select
  using (auth.uid() is not null);

create policy "Utilisateurs connectés peuvent créer un message"
  on public.messages for insert
  with check (auth.uid() = author_id);

create policy "Auteur peut modifier son message"
  on public.messages for update
  using (auth.uid() = author_id);

create policy "Admins can manage messages"
  on public.messages for all
  using (public.is_admin());

-- ============================================
-- Table: reports (signalements)
-- ============================================
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  reason text not null,
  reporter_id uuid not null references public.users(id) on delete cascade,
  discussion_id uuid references public.discussions(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint report_target check (
    (discussion_id is not null and message_id is null) or
    (discussion_id is null and message_id is not null)
  )
);

create index if not exists idx_reports_reporter_id on public.reports(reporter_id);
create index if not exists idx_reports_discussion_id on public.reports(discussion_id);
create index if not exists idx_reports_message_id on public.reports(message_id);

alter table public.reports enable row level security;

create policy "Utilisateurs connectés peuvent créer un signalement"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy "Utilisateurs voient leurs propres signalements"
  on public.reports for select
  using (auth.uid() = reporter_id);

create policy "Admins can read all reports"
  on public.reports for select
  using (public.is_admin());
