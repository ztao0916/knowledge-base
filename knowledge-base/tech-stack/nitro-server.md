# Nitro 服务端开发

## 场景描述
Nuxt4 内置的 Nitro 服务端引擎，用于创建API路由、中间件、服务端渲染等功能。

## 解决方案

### API 路由创建
```typescript
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  // GET /api/users
  return {
    users: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ]
  }
})
```

```typescript
// server/api/users/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // GET /api/users/123
  return {
    user: { id, name: 'User ' + id }
  }
})
```

### POST 请求处理
```typescript
// server/api/users.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 验证数据
  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required'
    })
  }
  
  // 处理业务逻辑
  const newUser = {
    id: Date.now(),
    name: body.name,
    email: body.email
  }
  
  return { user: newUser }
})
```

### 中间件
```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  // 只对 API 路由生效
  if (event.node.req.url?.startsWith('/api/protected')) {
    const token = getCookie(event, 'auth-token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }
  }
})
```

### 环境变量和配置
```typescript
// server/api/config.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  return {
    publicConfig: config.public,
    // 不要返回私有配置到客户端
  }
})
```

## 相关文档
- [Nitro 官方文档](https://nitro.unjs.io/)
- [Nuxt Server API](https://nuxt.com/docs/guide/directory-structure/server)

## 注意事项
- API 路由文件命名决定HTTP方法：`.get.ts`, `.post.ts`, `.put.ts`, `.delete.ts`
- 使用 `[param]` 语法创建动态路由
- 中间件按文件名字母顺序执行
- 服务端代码不会打包到客户端

## 更新记录
2025-01-17: 初次创建