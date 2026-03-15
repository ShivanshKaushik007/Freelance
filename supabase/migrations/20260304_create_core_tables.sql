create extension if not exists "pgcrypto";

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null,
  fee integer not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  patient_phone text not null,
  patient_email text,
  concern text,
  date_label text not null,
  slot_label text not null,
  doctor_name text not null,
  doctor_specialty text not null,
  fee integer not null,
  service_fee integer not null default 99,
  total_amount integer not null,
  payment_status text not null default 'pending',
  razorpay_order_id text,
  created_at timestamptz not null default now()
);
