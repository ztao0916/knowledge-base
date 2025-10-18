# 用户认证流程

## 场景描述
实现用户登录、注册、JWT认证、token刷新等完整的用户认证系统。

## 解决方案

### 方案1: 使用 @sidebase/nuxt-auth

#### 安装配置
```bash
pnpm add @sidebase/nuxt-auth
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-auth'],
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs'
    }
  },
  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET,
    public: {
      authUrl: process.env.NUXT_PUBLIC_AUTH_URL || 'http://localhost:3000/api/auth'
    }
  }
})
```

#### JWT Provider 配置
```typescript
// server/api/auth/[...].ts
import CredentialsProvider from '@auth/core/providers/credentials'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // 验证用户凭据
        const user = await validateUser(credentials.email, credentials.password)
        
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user.id = token.id
      return session
    }
  }
})
```

#### 登录页面
```vue
<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <form @submit.prevent="handleLogin" class="w-full max-w-md">
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">邮箱</label>
        <input 
          v-model="email" 
          type="email" 
          required
          class="w-full px-3 py-2 border rounded-md"
        >
      </div>
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">密码</label>
        <input 
          v-model="password" 
          type="password" 
          required
          class="w-full px-3 py-2 border rounded-md"
        >
      </div>
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  
  try {
    const result = await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: false
    })
    
    if (result?.error) {
      // 处理登录错误
      console.error('Login failed:', result.error)
    } else {
      // 登录成功，重定向
      await navigateTo('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

#### 认证中间件
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()
  
  if (status.value === 'unauthenticated') {
    return navigateTo('/login')
  }
})
```

#### 使用认证状态
```vue
<script setup lang="ts">
const { data: session, status, signOut } = useAuth()

const handleLogout = async () => {
  await signOut({ callbackUrl: '/login' })
}
</script>

<template>
  <div v-if="status === 'authenticated'">
    <p>欢迎, {{ session?.user?.name }}</p>
    <button @click="handleLogout">退出登录</button>
  </div>
  <div v-else-if="status === 'loading'">
    加载中...
  </div>
</template>
```

## 相关文档
- [@sidebase/nuxt-auth 文档](https://sidebase.io/nuxt-auth)
- [Auth.js 文档](https://authjs.dev/)

## 注意事项
- 需要设置 `NUXT_AUTH_SECRET` 环境变量
- JWT token 默认存储在 httpOnly cookie 中，更安全
- 生产环境需要配置 HTTPS
- 刷新token机制由 Auth.js 自动处理

## 更新记录
2025-01-17: 初次创建