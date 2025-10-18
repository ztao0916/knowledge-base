# Vue 3 开发模式

## 场景描述
Vue 3 组合式API的常用开发模式和最佳实践，包括响应式数据、生命周期、组件通信等。

## 解决方案

### 组合式API基础模式
```vue
<script setup lang="ts">
// 响应式数据
const count = ref(0)
const user = reactive({
  name: '',
  email: ''
})

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 监听器
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`)
})

// 生命周期
onMounted(() => {
  console.log('Component mounted')
})

// 方法
const increment = () => {
  count.value++
}
</script>
```

### 组件通信模式
```vue
<!-- 父组件 -->
<template>
  <ChildComponent 
    :data="parentData" 
    @update="handleUpdate"
  />
</template>

<script setup lang="ts">
const parentData = ref('Hello')

const handleUpdate = (newValue: string) => {
  parentData.value = newValue
}
</script>
```

```vue
<!-- 子组件 -->
<template>
  <button @click="updateParent">Update Parent</button>
</template>

<script setup lang="ts">
interface Props {
  data: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [value: string]
}>()

const updateParent = () => {
  emit('update', 'Updated from child')
}
</script>
```

### 自定义组合函数
```typescript
// composables/useCounter.ts
export const useCounter = (initialValue = 0) => {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count: readonly(count),
    increment,
    decrement,
    reset
  }
}
```

## 相关文档
- [Vue 3 组合式API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue 3 响应式API](https://vuejs.org/api/reactivity-core.html)

## 注意事项
- 使用 `ref()` 包装基础类型数据
- 使用 `reactive()` 包装对象类型数据
- 组合函数命名以 `use` 开头
- TypeScript 类型定义提升开发体验

## 更新记录
2025-01-17: 初次创建