// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // CSS 配置
  css: ["~/assets/css/main.css"],
  // 应用配置
  app: {
    head: {
      title: "九贰零玖要录",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "基于 Nuxt4 和 NuxtUI 构建的现代导航应用",
        },
        { name: "theme-color", content: "#ffffff" },
      ],
      link: [
        // 默认 favicon
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        // SVG favicon (现代浏览器)
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        // PNG favicon (不同尺寸)
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "48x48",
          href: "/favicon-48.png",
        },
        // Apple Touch Icon (使用 48x48 的 PNG)
        { rel: "apple-touch-icon", sizes: "48x48", href: "/favicon-48.png" },
      ],
    },
  },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/image",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],
  ui: {
    fonts: false, // 禁用从 Google Fonts 自动获取字体
  },
});
