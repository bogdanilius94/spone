import type { BrowserSupabase } from "@/components/admin/types";

function extensionFromName(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() : "bin";
}

export async function uploadPublicFile(
  supabase: BrowserSupabase,
  bucket: string,
  file: File,
  folder = "uploads",
) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const ext = extensionFromName(file.name);
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

