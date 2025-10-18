# 组件开发模式

## 场景描述
Vue 3 + Nuxt4 组件开发的常用模式和代码模板，包括表单、列表、模态框等常见组件。

## 解决方案

### 表单组件模板

#### 基础表单组件
```vue
<!-- components/BaseForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div v-for="field in fields" :key="field.name" class="form-group">
      <label :for="field.name" class="block text-sm font-medium mb-1">
        {{ field.label }}
        <span v-if="field.required" class="text-red-500">*</span>
      </label>
      
      <!-- 文本输入 -->
      <input
        v-if="field.type === 'text' || field.type === 'email'"
        :id="field.name"
        v-model="formData[field.name]"
        :type="field.type"
        :placeholder="field.placeholder"
        :required="field.required"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      
      <!-- 文本域 -->
      <textarea
        v-else-if="field.type === 'textarea'"
        :id="field.name"
        v-model="formData[field.name]"
        :placeholder="field.placeholder"
        :required="field.required"
        :rows="field.rows || 3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <!-- 选择框 -->
      <select
        v-else-if="field.type === 'select'"
        :id="field.name"
        v-model="formData[field.name]"
        :required="field.required"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">请选择</option>
        <option
          v-for="option in field.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- 错误信息 -->
      <p v-if="errors[field.name]" class="text-red-500 text-sm mt-1">
        {{ errors[field.name] }}
      </p>
    </div>
    
    <div class="flex justify-end space-x-2">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        取消
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loading ? '提交中...' : '提交' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  rows?: number
  options?: { label: string; value: string }[]
}

interface Props {
  fields: FormField[]
  initialData?: Record<string, any>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: Record<string, any>]
  cancel: []
}>()

const formData = ref<Record<string, any>>({})
const errors = ref<Record<string, string>>({})
const loading = ref(false)

// 初始化表单数据
watchEffect(() => {
  const data: Record<string, any> = {}
  props.fields.forEach(field => {
    data[field.name] = props.initialData?.[field.name] || ''
  })
  formData.value = data
})

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true
  
  props.fields.forEach(field => {
    if (field.required && !formData.value[field.name]) {
      errors.value[field.name] = `${field.label}不能为空`
      isValid = false
    }
    
    if (field.type === 'email' && formData.value[field.name]) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.value[field.name])) {
        errors.value[field.name] = '邮箱格式不正确'
        isValid = false
      }
    }
  })
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  try {
    emit('submit', { ...formData.value })
  } finally {
    loading.value = false
  }
}
</script>
```

### 数据列表组件

#### 通用数据表格
```vue
<!-- components/DataTable.vue -->
<template>
  <div class="bg-white shadow rounded-lg">
    <!-- 表格头部 -->
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="text-lg font-medium">{{ title }}</h3>
      <div class="flex space-x-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索..."
          class="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
        <button
          @click="$emit('create')"
          class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
        >
          新增
        </button>
      </div>
    </div>
    
    <!-- 表格内容 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              @click="handleSort(column.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <svg
                  v-if="sortBy === column.key"
                  class="w-4 h-4"
                  :class="sortOrder === 'asc' ? 'transform rotate-180' : ''"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading" class="text-center">
            <td :colspan="columns.length + 1" class="px-6 py-4">
              加载中...
            </td>
          </tr>
          <tr v-else-if="filteredData.length === 0" class="text-center">
            <td :colspan="columns.length + 1" class="px-6 py-4 text-gray-500">
              暂无数据
            </td>
          </tr>
          <tr v-else v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50">
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                {{ formatCellValue(item[column.key], column) }}
              </slot>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="$emit('edit', item)"
                class="text-blue-600 hover:text-blue-900 mr-2"
              >
                编辑
              </button>
              <button
                @click="$emit('delete', item)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页 -->
    <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
      <div class="text-sm text-gray-700">
        显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredData.length) }} 条，
        共 {{ filteredData.length }} 条记录
      </div>
      <div class="flex space-x-1">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
        >
          上一页
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 border rounded-md text-sm',
            page === currentPage
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  type?: 'text' | 'date' | 'number' | 'boolean'
  format?: string
}

interface Props {
  title: string
  data: any[]
  columns: Column[]
  loading?: boolean
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  pageSize: 10
})

const emit = defineEmits<{
  create: []
  edit: [item: any]
  delete: [item: any]
}>()

const searchQuery = ref('')
const sortBy = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)

// 过滤数据
const filteredData = computed(() => {
  let result = [...props.data]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      props.columns.some(column =>
        String(item[column.key]).toLowerCase().includes(query)
      )
    )
  }
  
  // 排序
  if (sortBy.value) {
    result.sort((a, b) => {
      const aVal = a[sortBy.value]
      const bVal = b[sortBy.value]
      
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return result
})

// 分页数据
const totalPages = computed(() => Math.ceil(filteredData.value.length / props.pageSize))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredData.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const handleSort = (key: string) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }
}

const formatCellValue = (value: any, column: Column) => {
  if (value == null) return '-'
  
  switch (column.type) {
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'boolean':
      return value ? '是' : '否'
    case 'number':
      return Number(value).toLocaleString()
    default:
      return String(value)
  }
}

// 重置分页当搜索条件改变时
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>
```

### 模态框组件

#### 通用模态框
```vue
<!-- components/BaseModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click="handleBackdropClick"
      >
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black bg-opacity-50" />
        
        <!-- 模态框内容 -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
            :class="sizeClasses"
            @click.stop
          >
            <!-- 头部 -->
            <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
              <slot name="header">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
                  <button
                    @click="close"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </slot>
            </div>
            
            <!-- 内容 -->
            <div class="px-6 py-4">
              <slot />
            </div>
            
            <!-- 底部 -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }
  return sizes[props.size]
})

const close = () => {
  emit('update:modelValue', false)
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

// ESC 键关闭
onMounted(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.modelValue) {
      close()
    }
  }
  
  document.addEventListener('keydown', handleEsc)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
  })
})
</script>
```

## 相关文档
- [Vue 3 组件基础](https://vuejs.org/guide/essentials/component-basics.html)
- [Nuxt 组件目录](https://nuxt.com/docs/guide/directory-structure/components)

## 注意事项
- 组件应该保持单一职责
- 使用 TypeScript 提供类型安全
- 合理使用插槽提供扩展性
- 考虑无障碍访问性 (a11y)

## 更新记录
2025-01-17: 初次创建