import { supabaseServer } from "./supabaseServer";

const BUCKET = "vom public";

export async function uploadToSupabase(file: File, path: string) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseServer.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw error;
  }

  const { data } = supabaseServer.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return {
    path,        // chemin dans le bucket
    url: data.publicUrl, // URL publique directe
  };
}

export async function deleteFromSupabase(path: string) {
  const { error } = await supabaseServer.storage
    .from(BUCKET)
    .remove([path]);

  if (error) throw error;
}
