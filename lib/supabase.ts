import { createClient } from "@supabase/supabase-js";

type SupabaseEnv = {
  url: string;
  key: string;
};

function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase env vars missing");
  }

  return { url, key };
}

export function getSupabaseClient() {
  const { url, key } = getSupabaseEnv();
  return createClient(url, key);
}
