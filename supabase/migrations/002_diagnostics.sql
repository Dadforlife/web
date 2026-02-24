-- ============================================
-- Table: diagnostics (réponses + scores du diagnostic papa)
-- Idempotent : ne plante pas si la table ou les policies existent déjà
-- ============================================
create table if not exists public.diagnostics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),

  -- Réponses du formulaire (JSON)
  form_data jsonb not null,

  -- Scores calculés
  score_tension smallint not null,
  score_risque_juridique smallint not null,
  score_stabilite_emotionnelle smallint not null,
  score_preparation_strategique smallint not null,
  score_global numeric(5,2) not null,
  classification text not null,
  plan_title text not null,
  plan_content text not null
);

-- RLS : chaque utilisateur ne voit et n'insère que ses propres diagnostics
alter table public.diagnostics enable row level security;

drop policy if exists "Users can insert own diagnostics" on public.diagnostics;
create policy "Users can insert own diagnostics"
  on public.diagnostics for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own diagnostics" on public.diagnostics;
create policy "Users can read own diagnostics"
  on public.diagnostics for select
  using (auth.uid() = user_id);
