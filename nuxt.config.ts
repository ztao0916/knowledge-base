// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // CSS 配置
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui", "@nuxt/eslint"],
  ui: {
    fonts: false, // 禁用从 Google Fonts 自动获取字体
  },
});
