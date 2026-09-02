import { adminClient, isOwner } from "@/lib/supabase";
import { serializeCookie } from "@/lib/cookies";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "请输入邮箱和密码" });

  const { data, error } = await adminClient().auth.signInWithPassword({
    email: String(email).trim().toLowerCase(),
    password: String(password)
  });
  if (error || !data.session) return res.status(401).json({ error: "邮箱或密码不正确" });
  if (!isOwner(data.user)) {
    return res.status(403).json({ error: "这个邮箱没有写作权限" });
  }
  res.setHeader("Set-Cookie", [
    serializeCookie("writer_access", data.session.access_token, 60 * 60 * 24 * 7),
    serializeCookie("writer_refresh", data.session.refresh_token, 60 * 60 * 24 * 30)
  ]);
  res.json({ ok: true });
}
