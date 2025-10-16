// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxthub/core"],
  css: ["~/assets/css/main.css"],
  hub: {
    database: true, // 启用 D1 支持
  },
  nitro: {
    preset: "cloudflare_module", // 针对 Cloudflare Worker 环境
  },
  runtimeConfig: {
    // 仅服务器端可见
    cloudflare: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      databaseId: process.env.CLOUDFLARE_DATABASE_ID,
      token: process.env.CLOUDFLARE_D1_TOKEN,
      binding: process.env.CLOUDFLARE_D1_BINDING || "DB",
    },
    // 这里的 public 部分可在客户端访问（可选）
    public: {
      env: process.env.NUXT_ENV || "development",
    },
  },
  ui: {
    //不从谷歌下载字体
    fonts: false,
  },
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          sizes: "32x32",
          href: "/favicon-32.svg",
        },
        {
          rel: "icon",
          type: "image/svg+xml",
          sizes: "64x64",
          href: "/favicon-64.svg",
        },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      ],
    },
  },
});
