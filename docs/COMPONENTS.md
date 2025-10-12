# fairyCity 组件使用指南

## 概述

fairyCity 基于 NuxtUI 构建，采用组件化架构设计。本文档详细介绍了项目中所有自定义组件的使用方法、属性配置和最佳实践。

### 组件分类

- **布局组件**: 页面结构和容器组件
- **导航组件**: 头部导航、分类导航等
- **内容组件**: 导航卡片、搜索框等
- **功能组件**: 日历、统计等
- **基础组件**: 按钮、图标等增强组件

### 设计原则

- **一致性**: 遵循统一的设计语言和交互模式
- **可复用**: 组件高度可配置，支持多场景使用
- **响应式**: 所有组件都支持响应式设计
- **可访问性**: 遵循 WCAG 2.1 无障碍标准
- **性能优化**: 支持懒加载和按需渲染

## 布局组件

### AppContainer

主要内容容器组件，提供统一的页面布局和响应式设计。

#### 基本用法

```vue
<template>
  <AppContainer>
    <div>页面内容</div>
  </AppContainer>
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max-width` | `string` | `'1280px'` | 最大宽度 |
| `padding` | `string` | `'1rem'` | 内边距 |
| `center` | `boolean` | `true` | 是否居中 |
| `full-height` | `boolean` | `false` | 是否全屏高度 |

#### 样式定制

```vue
<template>
  <AppContainer 
    max-width="1200px" 
    padding="2rem"
    class="custom-container"
  >
    <slot />
  </AppContainer>
</template>

<style scoped>
.custom-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
}
</style>
```

### AppLayout

应用主布局组件，包含头部、主内容区和可选的侧边栏。

#### 基本用法

```vue
<template>
  <AppLayout>
    <template #header>
      <AppHeader />
    </template>
    
    <template #sidebar>
      <AppSidebar />
    </template>
    
    <template #default>
      <main>主要内容</main>
    </template>
    
    <template #footer>
      <AppFooter />
    </template>
  </AppLayout>
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sidebar-width` | `string` | `'280px'` | 侧边栏宽度 |
| `header-height` | `string` | `'64px'` | 头部高度 |
| `has-sidebar` | `boolean` | `false` | 是否显示侧边栏 |
| `sidebar-collapsible` | `boolean` | `true` | 侧边栏是否可折叠 |

#### 插槽

| 插槽名 | 说明 |
|--------|------|
| `header` | 头部内容 |
| `sidebar` | 侧边栏内容 |
| `default` | 主要内容 |
| `footer` | 底部内容 |

## 导航组件

### AppHeader

应用头部组件，包含 Logo、导航菜单、搜索框和用户操作区域。

#### 基本用法

```vue
<template>
  <AppHeader 
    :logo="logoConfig"
    :navigation="navItems"
    :show-search="true"
    :show-time="true"
  />
</template>

<script setup>
const logoConfig = {
  src: '/logo.svg',
  alt: 'fairyCity',
    text: 'fairyCity'
}

const navItems = [
  { label: '首页', to: '/', icon: 'i-heroicons-home' },
  { label: '分类', to: '/categories', icon: 'i-heroicons-folder' },
  { label: '关于', to: '/about', icon: 'i-heroicons-information-circle' }
]
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `logo` | `LogoConfig` | `{}` | Logo 配置 |
| `navigation` | `NavItem[]` | `[]` | 导航项列表 |
| `show-search` | `boolean` | `true` | 是否显示搜索框 |
| `show-time` | `boolean` | `true` | 是否显示时间 |
| `sticky` | `boolean` | `true` | 是否固定在顶部 |
| `blur-background` | `boolean` | `true` | 是否启用毛玻璃效果 |

#### 类型定义

```typescript
interface LogoConfig {
  src?: string
  alt?: string
  text?: string
  to?: string
}

interface NavItem {
  label: string
  to: string
  icon?: string
  external?: boolean
  children?: NavItem[]
}
```

#### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `search` | `(query: string)` | 搜索事件 |
| `nav-click` | `(item: NavItem)` | 导航点击事件 |

#### 插槽

| 插槽名 | 说明 |
|--------|------|
| `logo` | 自定义 Logo |
| `nav-extra` | 导航额外内容 |
| `actions` | 右侧操作区域 |

### NavigationGrid

导航网格组件，展示分类和导航项的网格布局。

#### 基本用法

```vue
<template>
  <NavigationGrid 
    :categories="categories"
    :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }"
    @item-click="handleItemClick"
  />
</template>

<script setup>
const categories = [
  {
    id: 1,
    name: '开发工具',
    icon: 'i-heroicons-code-bracket',
    color: '#10b981',
    items: [
      {
        id: 1,
        title: 'GitHub',
        url: 'https://github.com',
        description: '代码托管平台',
        icon: 'https://github.com/favicon.ico'
      }
    ]
  }
]

const handleItemClick = (item) => {
  // 处理点击事件
  window.open(item.url, '_blank')
}
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `categories` | `Category[]` | `[]` | 分类数据 |
| `columns` | `ResponsiveColumns` | `{}` | 响应式列数配置 |
| `gap` | `string` | `'1rem'` | 网格间距 |
| `card-hover` | `boolean` | `true` | 是否启用悬停效果 |
| `show-description` | `boolean` | `true` | 是否显示描述 |
| `lazy-load` | `boolean` | `true` | 是否启用懒加载 |

#### 类型定义

```typescript
interface Category {
  id: number
  name: string
  slug: string
  icon?: string
  color?: string
  description?: string
  items: NavigationItem[]
}

interface NavigationItem {
  id: number
  title: string
  url: string
  description?: string
  icon?: string
  category_id: number
}

interface ResponsiveColumns {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}
```

#### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `item-click` | `(item: NavigationItem)` | 导航项点击 |
| `category-click` | `(category: Category)` | 分类点击 |
| `item-favorite` | `(item: NavigationItem)` | 收藏导航项 |

### CategoryCard

分类卡片组件，展示单个分类信息。

#### 基本用法

```vue
<template>
  <CategoryCard 
    :category="category"
    :show-items="true"
    :max-items="6"
    @click="handleCategoryClick"
    @item-click="handleItemClick"
  />
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `category` | `Category` | - | 分类数据 |
| `show-items` | `boolean` | `true` | 是否显示导航项 |
| `max-items` | `number` | `8` | 最大显示项数 |
| `compact` | `boolean` | `false` | 紧凑模式 |
| `clickable` | `boolean` | `true` | 是否可点击 |

## 搜索组件

### SearchBox

搜索框组件，支持实时搜索和搜索建议。

#### 基本用法

```vue
<template>
  <SearchBox 
    v-model="searchQuery"
    :engines="searchEngines"
    :suggestions="suggestions"
    :loading="loading"
    @search="handleSearch"
    @engine-change="handleEngineChange"
  />
</template>

<script setup>
const searchQuery = ref('')
const loading = ref(false)
const suggestions = ref([])

const searchEngines = [
  {
    id: 1,
    name: '百度',
    url: 'https://www.baidu.com/s?wd={query}',
    icon: 'https://www.baidu.com/favicon.ico'
  },
  {
    id: 2,
    name: 'Google',
    url: 'https://www.google.com/search?q={query}',
    icon: 'https://www.google.com/favicon.ico'
  }
]

const handleSearch = async (query, engine) => {
  if (engine) {
    // 使用搜索引擎搜索
    const url = engine.url.replace('{query}', encodeURIComponent(query))
    window.open(url, '_blank')
  } else {
    // 站内搜索
    loading.value = true
    // 执行搜索逻辑
    loading.value = false
  }
}
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string` | `''` | 搜索关键词 |
| `engines` | `SearchEngine[]` | `[]` | 搜索引擎列表 |
| `suggestions` | `string[]` | `[]` | 搜索建议 |
| `loading` | `boolean` | `false` | 加载状态 |
| `placeholder` | `string` | `'搜索...'` | 占位符文本 |
| `debounce` | `number` | `300` | 防抖延迟 |
| `max-suggestions` | `number` | `5` | 最大建议数 |

#### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:modelValue` | `(value: string)` | 更新搜索值 |
| `search` | `(query: string, engine?: SearchEngine)` | 搜索事件 |
| `engine-change` | `(engine: SearchEngine)` | 搜索引擎切换 |
| `suggestion-click` | `(suggestion: string)` | 建议点击 |

### SearchEngineSelector

搜索引擎选择器组件。

#### 基本用法

```vue
<template>
  <SearchEngineSelector 
    v-model="selectedEngine"
    :engines="engines"
    :show-icons="true"
  />
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `SearchEngine` | - | 选中的搜索引擎 |
| `engines` | `SearchEngine[]` | `[]` | 搜索引擎列表 |
| `show-icons` | `boolean` | `true` | 是否显示图标 |
| `compact` | `boolean` | `false` | 紧凑模式 |

## 内容组件

### NavigationItem

导航项组件，展示单个导航链接。

#### 基本用法

```vue
<template>
  <NavigationItem 
    :item="item"
    :show-description="true"
    :show-stats="true"
    @click="handleClick"
    @favorite="handleFavorite"
  />
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `item` | `NavigationItem` | - | 导航项数据 |
| `show-description` | `boolean` | `true` | 是否显示描述 |
| `show-stats` | `boolean` | `false` | 是否显示统计信息 |
| `show-favorite` | `boolean` | `true` | 是否显示收藏按钮 |
| `target` | `string` | `'_blank'` | 链接打开方式 |

#### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `click` | `(item: NavigationItem)` | 点击事件 |
| `favorite` | `(item: NavigationItem)` | 收藏事件 |
| `share` | `(item: NavigationItem)` | 分享事件 |

### ContentSection

内容区域组件，提供标题和内容的标准布局。

#### 基本用法

```vue
<template>
  <ContentSection 
    title="热门导航"
    subtitle="最受欢迎的网站推荐"
    :show-more="true"
    more-link="/popular"
  >
    <NavigationGrid :categories="popularCategories" />
  </ContentSection>
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 标题 |
| `subtitle` | `string` | - | 副标题 |
| `show-more` | `boolean` | `false` | 是否显示"更多"链接 |
| `more-link` | `string` | - | "更多"链接地址 |
| `more-text` | `string` | `'查看更多'` | "更多"链接文本 |

#### 插槽

| 插槽名 | 说明 |
|--------|------|
| `default` | 主要内容 |
| `header` | 自定义头部 |
| `actions` | 操作按钮区域 |

## 功能组件

### CalendarWidget

日历小部件，显示当前日期和相关信息。

#### 基本用法

```vue
<template>
  <CalendarWidget 
    :date="currentDate"
    :lunar-info="lunarInfo"
    :events="todayEvents"
    :compact="false"
  />
</template>

<script setup>
const currentDate = new Date()
const lunarInfo = {
  lunar: '腊月初五',
  suitable: ['开业', '搬家'],
  avoid: ['结婚', '出行']
}
const todayEvents = [
  { type: 'holiday', content: '小年', is_auspicious: true }
]
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `date` | `Date` | `new Date()` | 显示日期 |
| `lunar-info` | `LunarInfo` | - | 农历信息 |
| `events` | `CalendarEvent[]` | `[]` | 日历事件 |
| `compact` | `boolean` | `false` | 紧凑模式 |
| `show-lunar` | `boolean` | `true` | 是否显示农历 |

#### 类型定义

```typescript
interface LunarInfo {
  lunar: string
  suitable?: string[]
  avoid?: string[]
}

interface CalendarEvent {
  type: 'holiday' | 'event' | 'reminder'
  content: string
  is_auspicious?: boolean
}
```

### StatsWidget

统计小部件，显示网站统计信息。

#### 基本用法

```vue
<template>
  <StatsWidget 
    :stats="siteStats"
    :loading="loading"
    :refresh-interval="30000"
    @refresh="handleRefresh"
  />
</template>

<script setup>
const siteStats = {
  categories: 5,
  navigation_items: 45,
  total_clicks: 1234,
  today_clicks: 56
}
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `stats` | `SiteStats` | - | 统计数据 |
| `loading` | `boolean` | `false` | 加载状态 |
| `refresh-interval` | `number` | `0` | 自动刷新间隔(ms) |
| `show-charts` | `boolean` | `false` | 是否显示图表 |

## 基础组件

### IconButton

图标按钮组件，基于 NuxtUI 的 UButton 扩展。

#### 基本用法

```vue
<template>
  <IconButton 
    icon="i-heroicons-heart"
    :active="isFavorite"
    variant="ghost"
    size="sm"
    @click="toggleFavorite"
  />
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `icon` | `string` | - | 图标名称 |
| `active` | `boolean` | `false` | 激活状态 |
| `variant` | `string` | `'ghost'` | 按钮变体 |
| `size` | `string` | `'md'` | 按钮大小 |
| `loading` | `boolean` | `false` | 加载状态 |

### LoadingSpinner

加载动画组件。

#### 基本用法

```vue
<template>
  <LoadingSpinner 
    :size="32"
    color="primary"
    :overlay="true"
  />
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `size` | `number` | `24` | 尺寸 |
| `color` | `string` | `'primary'` | 颜色 |
| `overlay` | `boolean` | `false` | 是否显示遮罩 |

### EmptyState

空状态组件。

#### 基本用法

```vue
<template>
  <EmptyState 
    icon="i-heroicons-folder-open"
    title="暂无数据"
    description="还没有添加任何导航项"
    :actions="[
      { label: '添加导航', to: '/admin/navigation/create', variant: 'solid' }
    ]"
  />
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `icon` | `string` | - | 图标 |
| `title` | `string` | - | 标题 |
| `description` | `string` | - | 描述 |
| `actions` | `Action[]` | `[]` | 操作按钮 |

## 响应式设计

### 断点配置

```typescript
const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}
```

### 响应式 Props

大多数组件都支持响应式配置：

```vue
<template>
  <NavigationGrid 
    :columns="{
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5
    }"
    :gap="{
      xs: '0.5rem',
      md: '1rem',
      lg: '1.5rem'
    }"
  />
</template>
```

### 响应式工具类

```vue
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- 响应式网格 -->
  </div>
</template>
```

## 主题定制

### 颜色系统

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    primary: 'blue',
    gray: 'slate'
  }
})
```

### 自定义主题

```vue
<template>
  <div class="custom-theme">
    <AppHeader />
    <main>
      <!-- 内容 -->
    </main>
  </div>
</template>

<style>
.custom-theme {
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-900: #1e3a8a;
}
</style>
```

### 暗色模式

```vue
<template>
  <div>
    <UButton @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'">
      切换主题
    </UButton>
  </div>
</template>
```

## 性能优化

### 懒加载

```vue
<template>
  <LazyNavigationGrid 
    v-if="showGrid"
    :categories="categories"
  />
</template>
```

### 虚拟滚动

```vue
<template>
  <VirtualList 
    :items="largeDataset"
    :item-height="80"
    :buffer="5"
  >
    <template #default="{ item }">
      <NavigationItem :item="item" />
    </template>
  </VirtualList>
</template>
```

### 图片优化

```vue
<template>
  <NuxtImg 
    :src="item.icon"
    :alt="item.title"
    width="32"
    height="32"
    loading="lazy"
    placeholder
  />
</template>
```

## 可访问性

### ARIA 标签

```vue
<template>
  <button 
    :aria-label="`打开 ${item.title}`"
    :aria-describedby="`desc-${item.id}`"
    @click="openLink"
  >
    {{ item.title }}
  </button>
  <div :id="`desc-${item.id}`" class="sr-only">
    {{ item.description }}
  </div>
</template>
```

### 键盘导航

```vue
<template>
  <div 
    tabindex="0"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- 内容 -->
  </div>
</template>
```

### 焦点管理

```vue
<script setup>
const focusableElements = ref([])

const handleKeyDown = (event) => {
  if (event.key === 'Tab') {
    // 管理焦点顺序
  }
}
</script>
```

## 测试

### 组件测试

```typescript
// tests/components/NavigationGrid.test.ts
import { mount } from '@vue/test-utils'
import NavigationGrid from '~/components/NavigationGrid.vue'

describe('NavigationGrid', () => {
  it('renders categories correctly', () => {
    const categories = [
      { id: 1, name: 'Test Category', items: [] }
    ]
    
    const wrapper = mount(NavigationGrid, {
      props: { categories }
    })
    
    expect(wrapper.text()).toContain('Test Category')
  })
  
  it('emits item-click event', async () => {
    const wrapper = mount(NavigationGrid, {
      props: { categories: mockCategories }
    })
    
    await wrapper.find('[data-testid="nav-item"]').trigger('click')
    
    expect(wrapper.emitted('item-click')).toBeTruthy()
  })
})
```

### E2E 测试

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test('navigation grid displays correctly', async ({ page }) => {
  await page.goto('/')
  
  await expect(page.locator('[data-testid="navigation-grid"]')).toBeVisible()
  await expect(page.locator('.category-card')).toHaveCount(5)
  
  await page.click('.nav-item:first-child')
  await expect(page).toHaveURL(/.*github.*/)
})
```

## 最佳实践

### 组件设计原则

1. **单一职责**: 每个组件只负责一个功能
2. **Props 验证**: 使用 TypeScript 和运行时验证
3. **事件命名**: 使用清晰的事件名称
4. **插槽设计**: 提供合理的插槽扩展点
5. **样式隔离**: 使用 scoped 样式或 CSS Modules

### 性能建议

1. **按需加载**: 使用 Lazy 组件和动态导入
2. **缓存策略**: 合理使用 computed 和 watch
3. **避免过度渲染**: 使用 v-memo 和 key 优化
4. **图片优化**: 使用 NuxtImg 和适当的格式
5. **代码分割**: 按路由和功能分割代码

### 开发工作流

1. **组件开发**: 先开发基础组件，再组合复杂组件
2. **文档先行**: 编写组件文档和使用示例
3. **测试驱动**: 编写单元测试和集成测试
4. **代码审查**: 确保代码质量和一致性
5. **持续集成**: 自动化测试和部署

## 故障排除

### 常见问题

#### 组件不显示

```vue
<!-- 检查导入路径 -->
<script setup>
// ❌ 错误
import NavigationGrid from '~/components/navigation-grid.vue'

// ✅ 正确
import NavigationGrid from '~/components/NavigationGrid.vue'
</script>
```

#### 样式不生效

```vue
<!-- 检查 scoped 样式 -->
<style scoped>
/* 确保选择器正确 */
.navigation-grid {
  display: grid;
}
</style>
```

#### 响应式问题

```vue
<script setup>
// 确保使用 ref 或 reactive
const categories = ref([])

// 而不是普通变量
// const categories = []
</script>
```

### 调试工具

1. **Vue DevTools**: 检查组件状态和 props
2. **浏览器开发者工具**: 检查 DOM 和样式
3. **Nuxt DevTools**: 检查路由和性能
4. **控制台日志**: 添加适当的日志输出

## 更新日志

### v1.0.0 (2024-01-15)

- 初始组件库发布
- 包含所有核心组件
- 支持响应式设计
- 完整的 TypeScript 支持

### 即将推出

- 更多动画效果
- 拖拽排序功能
- 高级搜索组件
- 数据可视化组件

---

*最后更新: 2024年1月15日*

如有疑问或建议，请联系：[support@ztaohub.com](mailto:support@ztaohub.com)