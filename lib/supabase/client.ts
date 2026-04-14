"use client";

import { createBrowserClient } from "@supabase/ssr";

import { assertSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/types/supabase";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (browserClient) {
    return browserClient;
  }

  const { supabaseAnonKey, supabaseUrl } = assertSupabaseEnv();

  browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return browserClient;
}

