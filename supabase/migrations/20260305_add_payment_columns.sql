alter table public.appointments
  add column if not exists razorpay_payment_id text,
  add column if not exists razorpay_signature text;