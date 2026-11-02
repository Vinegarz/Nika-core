-- Nika Core database schema for PostgreSQL/Supabase.
-- Do not load private telecom/CNAP data without an explicit authorized agreement.
create extension if not exists pgcrypto;

create table if not exists caller_records (
  id uuid primary key default gen_random_uuid(),
  phone_e164 text not null unique,
  display_name text not null,
  category text,
  spam_score integer not null default 0 check (spam_score between 0 and 100),
  verified_business boolean not null default false,
  source_kind text not null check (source_kind in ('TEST_DATA','COMMUNITY','BUSINESS_DIRECTORY','LICENSED_PROVIDER','CNAP')),
  source_name text not null,
  source_reference text,
  is_test_data boolean not null default false,
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists caller_reports (
  id uuid primary key default gen_random_uuid(),
  phone_e164 text not null,
  kind text not null check (kind in ('spam','not_spam','wrong_name')),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists caller_records_phone_idx on caller_records(phone_e164);
create index if not exists caller_reports_phone_idx on caller_reports(phone_e164);
alter table caller_records enable row level security;
alter table caller_reports enable row level security;
-- Add narrowly scoped Supabase policies after deciding authenticated roles.
