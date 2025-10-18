# API 模板代码片段

## 场景描述
常用的API路由、中间件、工具函数等代码模板，可直接复制使用。

## 解决方案

### RESTful API 模板

#### 用户管理 API
```typescript
// server/api/users/index.get.ts - 获取用户列表
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { page = 1, limit = 10, search } = query
  
  try {
    // 模拟数据库查询
    const users = await getUserList({
      page: Number(page),
      limit: Number(limit),
      search: search as string
    })
    
    return {
      success: true,
      data: users.data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: users.total,
        totalPages: Math.ceil(users.total / Number(limit))
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users'
    })
  }
})
```

```typescript
// server/api/users/index.post.ts - 创建用户
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 验证必填字段
  const requiredFields = ['name', 'email']
  for (const field of requiredFields) {
    if (!body[field]) {
      throw createError({
        statusCode: 400,
        statusMessage: `${field} is required`
      })
    }
  }
  
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format'
    })
  }
  
  try {
    const newUser = await createUser({
      name: body.name,
      email: body.email,
      avatar: body.avatar || null,
      createdAt: new Date()
    })
    
    return {
      success: true,
      data: newUser,
      message: 'User created successfully'
    }
  } catch (error) {
    if (error.code === 'DUPLICATE_EMAIL') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email already exists'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
})
```

```typescript
// server/api/users/[id].get.ts - 获取单个用户
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user ID'
    })
  }
  
  try {
    const user = await getUserById(Number(id))
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }
    
    return {
      success: true,
      data: user
    }
  } catch (error) {
    if (error.statusCode === 404) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user'
    })
  }
})
```

```typescript
// server/api/users/[id].put.ts - 更新用户
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user ID'
    })
  }
  
  try {
    const updatedUser = await updateUser(Number(id), {
      ...body,
      updatedAt: new Date()
    })
    
    return {
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    }
  } catch (error) {
    if (error.code === 'USER_NOT_FOUND') {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user'
    })
  }
})
```

```typescript
// server/api/users/[id].delete.ts - 删除用户
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user ID'
    })
  }
  
  try {
    await deleteUser(Number(id))
    
    return {
      success: true,
      message: 'User deleted successfully'
    }
  } catch (error) {
    if (error.code === 'USER_NOT_FOUND') {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete user'
    })
  }
})
```

### 中间件模板

#### 认证中间件
```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  // 只对受保护的路由生效
  if (!event.node.req.url?.startsWith('/api/protected')) {
    return
  }
  
  const token = getCookie(event, 'auth-token') || 
                getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  try {
    const payload = await verifyJWT(token)
    event.context.user = payload
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
})
```

#### CORS 中间件
```typescript
// server/middleware/cors.ts
export default defineEventHandler(async (event) => {
  const origin = getHeader(event, 'origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'https://yourdomain.com'
  ]
  
  if (allowedOrigins.includes(origin)) {
    setHeader(event, 'Access-Control-Allow-Origin', origin)
  }
  
  setHeader(event, 'Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type,Authorization')
  setHeader(event, 'Access-Control-Allow-Credentials', 'true')
  
  // 处理预检请求
  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 200
    event.node.res.end()
    return
  }
})
```

### 工具函数模板

#### 响应格式化
```typescript
// server/utils/response.ts
export const successResponse = <T>(data: T, message = 'Success') => {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  }
}

export const errorResponse = (message: string, code?: string) => {
  return {
    success: false,
    error: {
      message,
      code,
      timestamp: new Date().toISOString()
    }
  }
}

export const paginatedResponse = <T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
  }
) => {
  return {
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page * pagination.limit < pagination.total,
      hasPrev: pagination.page > 1
    }
  }
}
```

#### 验证工具
```typescript
// server/utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validateRequired = (data: any, fields: string[]): string[] => {
  const missing: string[] = []
  
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      missing.push(field)
    }
  }
  
  return missing
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}
```

### 数据库操作模板

#### 基础 CRUD
```typescript
// server/utils/database.ts
interface User {
  id?: number
  name: string
  email: string
  avatar?: string
  createdAt?: Date
  updatedAt?: Date
}

export const getUserList = async (options: {
  page: number
  limit: number
  search?: string
}) => {
  // 模拟数据库查询
  const offset = (options.page - 1) * options.limit
  
  // 这里替换为实际的数据库查询
  const users = await db.users.findMany({
    where: options.search ? {
      OR: [
        { name: { contains: options.search } },
        { email: { contains: options.search } }
      ]
    } : {},
    skip: offset,
    take: options.limit,
    orderBy: { createdAt: 'desc' }
  })
  
  const total = await db.users.count({
    where: options.search ? {
      OR: [
        { name: { contains: options.search } },
        { email: { contains: options.search } }
      ]
    } : {}
  })
  
  return { data: users, total }
}

export const getUserById = async (id: number): Promise<User | null> => {
  return await db.users.findUnique({
    where: { id }
  })
}

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  return await db.users.create({
    data: userData
  })
}

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  return await db.users.update({
    where: { id },
    data: userData
  })
}

export const deleteUser = async (id: number): Promise<void> => {
  await db.users.delete({
    where: { id }
  })
}
```

## 相关文档
- [Nuxt Server API](https://nuxt.com/docs/guide/directory-structure/server)
- [H3 Event Handler](https://h3.unjs.io/)

## 注意事项
- 根据实际需求调整验证逻辑
- 替换模拟数据库操作为实际实现
- 添加适当的日志记录
- 考虑性能优化和缓存策略

## 更新记录
2025-01-17: 初次创建