# 故障排除指南

## 场景描述
系统性的故障排除方法和调试技巧，帮助快速定位和解决Nuxt4项目中的问题。

## 解决方案

### 调试工具和方法

#### 1. 开发者工具配置
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { 
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  sourcemap: {
    server: true,
    client: true
  }
})
```

#### 2. 日志调试
```vue
<script setup lang="ts">
// 客户端调试
console.log('Client side data:', data)

// 服务端调试 (仅在服务端执行)
if (process.server) {
  console.log('Server side data:', data)
}

// 通用调试信息
const debug = useRuntimeConfig().public.debug
if (debug) {
  console.log('Debug mode enabled')
}
</script>
```

#### 3. 网络请求调试
```typescript
// server/api/debug.get.ts
export default defineEventHandler(async (event) => {
  console.log('Request headers:', getHeaders(event))
  console.log('Query params:', getQuery(event))
  console.log('User agent:', getHeader(event, 'user-agent'))
  
  return {
    timestamp: new Date().toISOString(),
    url: event.node.req.url,
    method: event.node.req.method
  }
})
```

### 性能问题排查

#### 1. 页面加载性能
```vue
<script setup lang="ts">
// 测量页面加载时间
const startTime = Date.now()

onMounted(() => {
  const loadTime = Date.now() - startTime
  console.log(`Page loaded in ${loadTime}ms`)
})

// 监控组件渲染性能
const renderStart = performance.now()

nextTick(() => {
  const renderTime = performance.now() - renderStart
  console.log(`Component rendered in ${renderTime}ms`)
})
</script>
```

#### 2. 内存泄漏检查
```vue
<script setup lang="ts">
let intervalId: NodeJS.Timeout

onMounted(() => {
  intervalId = setInterval(() => {
    // 定时任务
  }, 1000)
})

// 重要：清理定时器
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
```

### 构建问题排查

#### 1. 依赖分析
```bash
# 分析包大小
pnpm build --analyze

# 检查依赖树
pnpm list --depth=0

# 查找重复依赖
pnpm dedupe
```

#### 2. 构建配置调试
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    analyze: process.env.ANALYZE === 'true'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router']
          }
        }
      }
    }
  }
})
```

### API 问题排查

#### 1. 请求响应调试
```typescript
// server/middleware/debug.ts
export default defineEventHandler(async (event) => {
  const start = Date.now()
  
  // 记录请求
  console.log(`[${new Date().toISOString()}] ${event.node.req.method} ${event.node.req.url}`)
  
  // 在响应后记录耗时
  event.node.res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`Request completed in ${duration}ms`)
  })
})
```

#### 2. 错误追踪
```typescript
// server/api/error-handler.ts
export default defineEventHandler(async (event) => {
  try {
    // 业务逻辑
    return { success: true }
  } catch (error) {
    // 详细错误日志
    console.error('API Error:', {
      url: event.node.req.url,
      method: event.node.req.method,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
```

### 环境问题排查

#### 1. 环境变量检查
```typescript
// server/api/env-check.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  return {
    nodeEnv: process.env.NODE_ENV,
    nuxtEnv: process.env.NUXT_ENV,
    publicConfig: config.public,
    // 不要返回敏感信息
    hasSecrets: !!config.apiSecret
  }
})
```

#### 2. 系统信息收集
```typescript
// utils/system-info.ts
export const getSystemInfo = () => {
  if (process.server) {
    return {
      platform: process.platform,
      nodeVersion: process.version,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  }
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  }
}
```

### 常用调试命令

```bash
# 详细构建日志
pnpm build --verbose

# 开发模式详细日志
DEBUG=nuxt:* pnpm dev

# 检查类型错误
pnpm nuxi typecheck

# 清理并重新安装
rm -rf .nuxt node_modules pnpm-lock.yaml && pnpm install

# 检查端口占用
lsof -i :3000

# 内存使用监控
node --inspect pnpm dev
```

### 问题排查清单

#### 🔍 **基础检查**
- [ ] 检查 Node.js 版本兼容性
- [ ] 验证依赖版本
- [ ] 确认环境变量配置
- [ ] 检查文件路径和命名

#### 🌐 **网络相关**
- [ ] 检查 API 端点可访问性
- [ ] 验证 CORS 配置
- [ ] 确认代理设置
- [ ] 检查防火墙规则

#### 🏗️ **构建相关**
- [ ] 清理构建缓存
- [ ] 检查 TypeScript 配置
- [ ] 验证模块导入路径
- [ ] 确认静态资源路径

#### 🔧 **运行时问题**
- [ ] 检查浏览器控制台错误
- [ ] 查看服务端日志
- [ ] 验证数据格式
- [ ] 确认权限设置

## 相关文档
- [Nuxt DevTools](https://devtools.nuxtjs.org/)
- [Vue DevTools](https://devtools.vuejs.org/)

## 注意事项
- 生产环境不要开启详细调试日志
- 敏感信息不要输出到日志
- 定期清理调试代码
- 使用适当的日志级别

## 更新记录
2025-01-17: 初次创建