export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  response.status(501).json({
    error:
      "Online message storage is not configured yet. Add a hosted database such as Vercel KV, Vercel Postgres, or Supabase to store messages on Vercel.",
  });
}
