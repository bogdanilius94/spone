import { PublicPage } from "@/components/public/public-page";
import { getPublicContent } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getPublicContent();

  return (
    <>
      {!isSupabaseConfigured ? (
        <div className="fixed inset-x-0 top-0 z-50 border-b border-amber-400/40 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200">
          Supabase is not configured yet. The page is rendering demo content.
        </div>
      ) : null}
      <PublicPage content={content} />
    </>
  );
}

