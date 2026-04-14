import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const initialError =
    params.error === "supabase_not_configured"
      ? "Supabase is not configured. Add env vars first."
      : undefined;

  return <LoginForm redirectTo={params.redirectTo ?? "/admin"} initialError={initialError} />;
}
