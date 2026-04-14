"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type LoginFormProps = {
  redirectTo: string;
  initialError?: string;
};

export function LoginForm({ redirectTo, initialError }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(initialError ?? null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="panel-surface w-full max-w-md rounded-2xl p-6 sm:p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-[--color-accent]">Admin Access</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Sign In</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Only the artist/manager account can access dashboard controls.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block space-y-1">
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
              required
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full rounded-xl px-4 py-2 text-sm"
          >
            {isLoading ? "Signing in..." : "Enter Admin"}
          </button>

          {message ? <p className="text-sm text-rose-300">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
