# API 集成与数据获取

## 场景描述
在Nuxt4中进行API调用、数据获取、状态管理和错误处理的最佳实践。

## 解决方案

### 使用 $fetch 和 useFetch

#### 基础数据获取
```vue
<script setup lang="ts">
// 服务端渲染 + 客户端缓存
const { data: users, pending, error, refresh } = await useFetch('/api/users')

// 仅客户端获取
const { data: profile } = await useLazyFetch('/api/profile')

// 条件获取
const userId = ref(1)
const { data: user } = await useFetch(`/api/users/${userId.value}`, {
  key: 'user',
  watch: [userId] // 当 userId 变化时重新获取
})
</script>

<template>
  <div>
    <div v-if="pending">加载中...</div>
    <div v-else-if="error">错误: {{ error.message }}</div>
    <div v-else>
      <div v-for="user in users" :key="user.id">
        {{ user.name }}
      </div>
      <button @click="refresh()">刷新</button>
    </div>
  </div>
</template>
```

#### POST 请求
```vue
<script setup lang="ts">
const formData = ref({
  name: '',
  email: ''
})

const { pending, execute } = await useLazyFetch('/api/users', {
  method: 'POST',
  body: formData,
  immediate: false
})

const handleSubmit = async () => {
  try {
    await execute()
    // 成功处理
    await navigateTo('/users')
  } catch (error) {
    // 错误处理
    console.error('提交失败:', error)
  }
}
</script>
```

### 自定义 API 组合函数
```typescript
// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  
  const apiCall = async <T>(
    endpoint: string, 
    options: any = {}
  ): Promise<T> => {
    return $fetch<T>(endpoint, {
      baseURL: config.public.apiBase,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
  }
  
  return {
    apiCall
  }
}
```

```typescript
// composables/useUsers.ts
export const useUsers = () => {
  const { apiCall } = useApi()
  
  const getUsers = () => useFetch('/api/users')
  
  const createUser = async (userData: any) => {
    return apiCall('/api/users', {
      method: 'POST',
      body: userData
    })
  }
  
  const updateUser = async (id: number, userData: any) => {
    return apiCall(`/api/users/${id}`, {
      method: 'PUT',
      body: userData
    })
  }
  
  const deleteUser = async (id: number) => {
    return apiCall(`/api/users/${id}`, {
      method: 'DELETE'
    })
  }
  
  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser
  }
}
```

### 错误处理
```vue
<script setup lang="ts">
const { data, error } = await useFetch('/api/users', {
  onResponseError({ request, response, options }) {
    // 处理响应错误
    console.error('API Error:', response.status, response._data)
  },
  onRequestError({ request, options, error }) {
    // 处理请求错误
    console.error('Request Error:', error)
  }
})

// 全局错误处理
const handleError = (error: any) => {
  if (error.statusCode === 401) {
    // 未授权，重定向到登录页
    navigateTo('/login')
  } else if (error.statusCode === 403) {
    // 权限不足
    throw createError({
      statusCode: 403,
      statusMessage: '权限不足'
    })
  }
}
</script>
```

### 状态管理 (Pinia)
```typescript
// stores/users.ts
export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch('/api/users')
      users.value = data
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  
  const addUser = async (userData: any) => {
    const newUser = await $fetch('/api/users', {
      method: 'POST',
      body: userData
    })
    users.value.push(newUser)
  }
  
  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    fetchUsers,
    addUser
  }
})
```

## 相关文档
- [Nuxt Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)
- [Pinia 状态管理](https://pinia.vuejs.org/)

## 注意事项
- `useFetch` 在服务端和客户端都会执行
- `useLazyFetch` 不会阻塞页面渲染
- 使用 `key` 参数来缓存和去重请求
- 错误处理要考虑网络错误和业务错误
- 敏感数据不要在客户端缓存

## 更新记录
2025-01-17: 初次创建