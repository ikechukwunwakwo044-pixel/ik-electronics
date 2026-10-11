import { createAdminClient } from "@/lib/supabase/admin";

export async function getWhatsappNumber(): Promise<string | null> {
  const fallback = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (fallback) {
    return fallback;
  }

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("store_settings")
      .select("whatsapp_number")
      .eq("id", true)
      .maybeSingle();

    if (data?.whatsapp_number && typeof data.whatsapp_number === "string") {
      return data.whatsapp_number.trim();
    }

    return null;
  } catch {
    return null;
  }
}

export function buildWhatsAppUrl(number: string, message: string) {
  const normalized = number.replace(/[^\d]/g, "").replace(/^0+/, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}