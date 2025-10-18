# 常见错误解决方案

## 场景描述
Nuxt4开发过程中遇到的常见错误、警告和问题的解决方案集合。

## 解决方案

### 1. Hydration Mismatch 错误

#### 错误信息
```
[Vue warn]: Hydration node mismatch
```

#### 解决方案
```vue
<!-- 使用 ClientOnly 组件 -->
<template>
  <div>
    <ClientOnly>
      <div>{{ new Date().toLocaleString() }}</div>
      <template #fallback>
        <div>加载中...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

```vue
<!-- 或使用条件渲染 -->
<script setup lang="ts">
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <div v-if="mounted">
    {{ new Date().toLocaleString() }}
  </div>
</template>
```

### 2. 模块导入错误

#### 错误信息
```
Cannot resolve module '@/components/MyComponent'
```

#### 解决方案
```typescript
// nuxt.config.ts - 配置路径别名
export default defineNuxtConfig({
  alias: {
    '@': resolve(__dirname, './'),
    '~': resolve(__dirname, './'),
    'assets': resolve(__dirname, './assets'),
    'public': resolve(__dirname, './public')
  }
})
```

### 3. CSS 样式不生效

#### 问题描述
组件样式在生产环境不生效

#### 解决方案
```vue
<!-- 确保使用 scoped 样式 -->
<style scoped>
.my-component {
  color: red;
}
</style>
```

```typescript
// nuxt.config.ts - 配置CSS
export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
```

### 4. API 路由 404 错误

#### 错误信息
```
404 - API route not found
```

#### 解决方案
```typescript
// 确保文件命名正确
// ✅ 正确: server/api/users.get.ts
// ❌ 错误: server/api/users.ts

// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  return { message: 'Hello from API' }
})
```

### 5. 环境变量未定义

#### 问题描述
`process.env.MY_VAR` 返回 undefined

#### 解决方案
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 服务端环境变量
    apiSecret: process.env.API_SECRET,
    public: {
      // 客户端环境变量 (以 NUXT_PUBLIC_ 开头)
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  }
})
```

```bash
# .env 文件
API_SECRET=your-secret-key
NUXT_PUBLIC_API_BASE=https://api.example.com
```

### 6. TypeScript 类型错误

#### 错误信息
```
Property 'xxx' does not exist on type 'xxx'
```

#### 解决方案
```typescript
// types/index.ts - 定义全局类型
export interface User {
  id: number
  name: string
  email: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
```

```vue
<script setup lang="ts">
// 使用类型注解
const users = ref<User[]>([])
const loading = ref<boolean>(false)

const fetchUsers = async (): Promise<void> => {
  const response = await $fetch<ApiResponse<User[]>>('/api/users')
  users.value = response.data
}
</script>
```

### 7. 构建错误

#### 错误信息
```
Build failed with errors
```

#### 解决方案
```bash
# 清理缓存
rm -rf .nuxt node_modules pnpm-lock.yaml
pnpm install

# 检查依赖版本兼容性
pnpm audit

# 更新依赖
pnpm update
```

### 8. 路由跳转问题

#### 问题描述
`navigateTo` 不工作或报错

#### 解决方案
```vue
<script setup lang="ts">
// ✅ 正确用法
const goToPage = async () => {
  await navigateTo('/target-page')
}

// ✅ 带参数跳转
const goToUser = async (id: number) => {
  await navigateTo(`/users/${id}`)
}

// ✅ 外部链接
const goToExternal = () => {
  navigateTo('https://example.com', { external: true })
}
</script>
```

## 相关文档
- [Nuxt 故障排除](https://nuxt.com/docs/community/troubleshooting)
- [Vue 3 常见问题](https://vuejs.org/guide/extras/faq.html)

## 注意事项
- 开发环境和生产环境行为可能不同
- 检查浏览器控制台和服务端日志
- 使用 TypeScript 可以提前发现很多问题
- 保持依赖版本更新

## 更新记录
2025-01-17: 初次创建