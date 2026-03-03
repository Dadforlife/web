-- ============================================
-- Admin : fonction is_admin + policies + sync auth → public.users
-- ============================================

-- Fonction pour savoir si l'utilisateur connecté est admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Permettre à un utilisateur de créer son propre profil (premier login si trigger absent)
create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Les admins peuvent lire tous les profils utilisateurs (policy additionnelle)
create policy "Admins can read all users"
  on public.users for select
  using (public.is_admin());

-- Les admins peuvent lire tous les diagnostics
create policy "Admins can read all diagnostics"
  on public.diagnostics for select
  using (public.is_admin());

-- Sync auth.users → public.users à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), public.users.full_name),
    phone = coalesce(excluded.phone, public.users.phone),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger sur auth.users (Supabase)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
