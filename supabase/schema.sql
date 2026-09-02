-- 在 Supabase 的 SQL Editor 里整段执行一次即可。

create extension if not exists pgcrypto;

create table if not exists articles (
  slug text not null,
  lang text not null default 'zh',
  type text not null default 'essay' check (type in ('essay', 'analysis')),
  title text not null,
  summary text not null default '',
  body text not null default '',
  body_html text not null default '',
  tags text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (slug, lang)
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  article_lang text not null default 'zh',
  author_name text not null,
  body text not null,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

alter table articles enable row level security;
alter table comments enable row level security;

-- 访客只能读已发布的文章
create policy "read published articles"
  on articles for select
  using (published = true);

-- 管理员（service_role）可读写全部文章，无需额外策略

-- 访客可读已通过的留言、可发留言
create policy "read approved comments"
  on comments for select
  using (approved = true);

create policy "anyone can comment"
  on comments for insert
  with check (
    approved = true
    and char_length(author_name) between 1 and 40
    and char_length(body) between 1 and 1000
  );
