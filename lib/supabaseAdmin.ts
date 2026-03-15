import { createClient } from "@supabase/supabase-js";

type SupabaseAdminEnv = {
  url: string;
  serviceKey: string;
};

function getSupabaseAdminEnv(): SupabaseAdminEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase admin env vars missing");
  }

  return { url, serviceKey };
}

export function getSupabaseAdmin() {
  const { url, serviceKey } = getSupabaseAdminEnv();
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
