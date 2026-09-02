# 写作平台（开发者模式 / 读者模式）

动态个人写作站：你登录“写作台”在网页里直接写文章、改文章、发布、删留言；访客只能阅读和留言。

技术栈：Next.js + Supabase（Postgres / Auth / 行级安全），免费额度即可运行。

## 本地跑起来（约 10 分钟）

### 1. 建 Supabase 数据库

1. 打开 [supabase.com](https://supabase.com) 注册，创建一个免费项目（名字随意）。
2. 左侧 **SQL Editor** → New query，把 `supabase/schema.sql` 全部内容粘贴进去执行。
3. 左侧 **Authentication → Users** → Add user，创建你自己的邮箱 + 密码（这就是站长账号；务必记住）。

### 2. 填环境变量

复制 `.env.example` 为 `.env.local`，填入：

- `NEXT_PUBLIC_SUPABASE_URL`：Supabase 项目首页的 Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Settings → API 里的 anon public key
- `SUPABASE_SERVICE_ROLE_KEY`：Settings → API 里的 service_role key（仅存后端，**不要公开**）
- `OWNER_EMAIL`：上一步创建的站长邮箱

### 3. 启动

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`：

- 站长：打开 `http://localhost:3000/login`，登录后进写作台 `/admin`
- 访客：中文区 `/zh`、英文区 `/en`，文章底部可留言

想先放几篇示例文章：`npm run seed`（从静态站的 content 目录导入）。

## 日常使用

**开发者模式（你）**

- 写作台可新建/编辑文章：标题、类型（随笔/解析）、标签、摘要、正文（Markdown）
- 点“保存文章”= 保存草稿或直接发布；访客立即能看到已发布文章
- 留言管理在写作台底部，可删除不当留言

**读者模式（访客）**

- 只能打开公开页面阅读、在文章底部留言
- 看不到登录页与写作台入口；直接访问 `/admin` 会被弹回登录页
- 留言无需注册，留言内容与称呼长度已限制

## 上线让其他人访问

1. 把项目推到 GitHub（仓库建议命名为 `writer-platform` 或你的用户名）。
2. 到 [vercel.com](https://vercel.com) 用 GitHub 登录 → Add New Project → 导入这个仓库。
3. 在 Vercel 的 Environment Variables 里把 `.env.local` 的全部变量逐项填进去。
4. Deploy 完成即获得 `https://xxx.vercel.app`，这就是给别人访问的网址。

以后本地写完直接推到 GitHub，Vercel 自动更新。

## 目录

```text
├── pages/            # 页面：公开区 [lang]、登录、写作台 admin
├── pages/api/        # 登录/文章/留言接口
├── components/       # 导航、主题调色盘、留言、编辑器等
├── lib/              # Supabase 客户端、Markdown 渲染、站点文案
├── public/styles/    # 黑金设计系统
└── supabase/schema.sql
```
