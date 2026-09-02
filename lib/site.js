// 站点显示信息。优先读取环境变量，未设置时用这里的占位默认值。
export const SITE = {
  zh: {
    zone: "zh",
    zoneLabel: "中文区",
    lang: "zh-CN",
    name: process.env.NEXT_PUBLIC_SITE_NAME || "未名集",
    penName: process.env.NEXT_PUBLIC_PEN_NAME || "未名",
    tagline: "法学出身。写法律、人心与时代，也写自己。",
    intro: "这里是我的写作档案：随笔与解析，慢慢更新，认真写字。",
    github: process.env.NEXT_PUBLIC_GITHUB || "LuYan723",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com"
  },
  en: {
    zone: "en",
    zoneLabel: "English",
    lang: "en",
    name: process.env.NEXT_PUBLIC_SITE_NAME_EN || "Anonymous Archive",
    penName: process.env.NEXT_PUBLIC_PEN_NAME_EN || "Anonymous",
    tagline: "Trained in law. Writing about justice, doubt, and slow thinking.",
    intro: "A small archive of essays and close readings of legal texts.",
    github: process.env.NEXT_PUBLIC_GITHUB || "LuYan723",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com"
  }
};

export const UI = {
  zh: {
    home: "首页",
    articles: "文章",
    about: "关于",
    developer: "写作台",
    login: "登录",
    logout: "退出",
    readArticles: "开始阅读",
    featured: "精选",
    featuredTitle: "最近在写什么",
    latestTitle: "最近更新",
    viewAll: "查看全部文章",
    empty: "还没有文章。站长登录写作台发布第一篇吧。",
    comments: "留言",
    commentPlaceholder: "写下你的想法…",
    commentName: "你的称呼",
    commentSubmit: "发布留言",
    commentEmpty: "还没有留言，做第一个读者。",
    backArticles: "返回文章列表",
    switchZone: "EN"
  },
  en: {
    home: "Home",
    articles: "Articles",
    about: "About",
    developer: "Studio",
    login: "Sign in",
    logout: "Sign out",
    readArticles: "Start reading",
    featured: "Featured",
    featuredTitle: "Recently Written",
    latestTitle: "Latest Entries",
    viewAll: "View all articles",
    empty: "Nothing published yet.",
    comments: "Comments",
    commentPlaceholder: "Leave a thought…",
    commentName: "Your name",
    commentSubmit: "Post comment",
    commentEmpty: "No comments yet. Be the first reader.",
    backArticles: "Back to articles",
    switchZone: "中文"
  }
};

export const TYPE_LABELS = {
  zh: { essay: "随笔", analysis: "解析" },
  en: { essay: "Essay", analysis: "Analysis" }
};
