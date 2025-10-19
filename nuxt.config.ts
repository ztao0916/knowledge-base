// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nitro-cloudflare-dev"],
  css: ["~/assets/css/main.css"],
  ui: {
    //不从谷歌下载字体
    fonts: false,
  },
  app: {
    head: {
      title: "FairyCity",
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
