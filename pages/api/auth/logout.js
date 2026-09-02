import { clearCookie } from "@/lib/cookies";

export default function handler(req, res) {
  res.setHeader("Set-Cookie", [clearCookie("writer_access"), clearCookie("writer_refresh")]);
  res.json({ ok: true });
}
