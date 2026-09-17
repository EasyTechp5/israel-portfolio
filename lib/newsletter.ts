// ── Newsletter signup → Supabase (team_Easytech) ────────────────────────────
//
// These two values are the project URL and the PUBLISHABLE (anon) key. The
// publishable key is designed to be shipped to the browser and is safe to
// commit: Row Level Security on `portfolio_subscribers` allows anonymous
// INSERT only. The list itself cannot be read, updated or deleted with this
// key — only the service role (Supabase dashboard / the academy app) can read
// it. To rotate the key, replace the string below and redeploy.
//
// Signups land in `public.portfolio_subscribers`, which is intentionally
// separate from `public.contacts`: rows there are hidden from the academy and
// are never emailed until they are released into contacts from the admin app.

const SUPABASE_URL = "https://kcswewcwnykjlkfknxyr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_76zWagL2sMt-C3yede19Mw_00mf6jux";

export function isValidEmail(email: string): boolean {
  // Deliberately permissive — the goal is to catch typos, not enforce RFC 5322.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function subscribe(fullName: string, email: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_subscribers`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      full_name: fullName.trim().slice(0, 120),
      email: email.trim().toLowerCase().slice(0, 200),
      source: "portfolio_popup",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Signup failed (${res.status}) ${detail}`.trim());
  }
}
