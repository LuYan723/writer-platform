import Link from "next/link";

export default function SetupNotice({ isZh = true }) {
  return (
    <div className="setup-card">
      <h1>{isZh ? "还没有连接数据库" : "Database not connected"}</h1>
      <p>
        {isZh
          ? "复制 .env.example 为 .env.local，填入 Supabase 的 URL、anon key、service_role key 和 OWNER_EMAIL，然后重启 npm run dev。"
          : "Copy .env.example to .env.local, fill in your Supabase URL, anon key, service_role key and OWNER_EMAIL, then restart npm run dev."}
      </p>
      <Link className="btn btn-gold" href="/">{isZh ? "返回" : "Back"}</Link>
    </div>
  );
}
