# Nuxt4 基础配置

## 场景描述
Nuxt4项目的基础配置和核心概念，包括项目结构、配置文件、路由系统等基础知识。

## 解决方案

### 项目结构
```
app/
├── app.vue          # 根组件
├── components/      # 组件目录
├── layouts/         # 布局目录
├── pages/          # 页面目录（自动路由）
├── assets/         # 静态资源
└── middleware/     # 中间件
```

### nuxt.config.ts 基础配置
```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    // 服务端环境变量
    apiSecret: process.env.API_SECRET,
    public: {
      // 客户端环境变量
      apiBase: process.env.API_BASE || '/api'
    }
  }
})
```

### 自动导入
Nuxt4 自动导入以下内容：
- Vue 3 组合式API (`ref`, `reactive`, `computed` 等)
- Nuxt 工具函数 (`navigateTo`, `useRoute`, `useFetch` 等)
- 组件目录下的组件
- 工具函数目录下的函数

## 相关文档
- [Nuxt4 官方文档](https://nuxt.com/docs)
- [Vue 3 组合式API](https://vuejs.org/guide/extras/composition-api-faq.html)

## 注意事项
- Nuxt4 基于 Vue 3 和 Vite
- 支持 TypeScript 开箱即用
- 自动路由基于 `pages/` 目录结构
- 服务端渲染 (SSR) 默认启用

## 更新记录
2025-01-17: 初次创建