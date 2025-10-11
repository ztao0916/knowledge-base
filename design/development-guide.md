# ztaoHub - 开发文档

## 📋 项目概述

### 项目介绍
ztaoHub是一个现代化的网址导航网站，旨在为用户提供简洁、高效的上网入口。项目基于原型设计，实现了美观的界面和丰富的功能。

### 核心特性
- 🎨 现代化UI设计，采用蓝色渐变主题
- 🔍 多搜索引擎支持
- 📱 完全响应式设计
- 🤖 AI工具集成
- 📅 实时黄历功能
- ⚡ 极速加载体验
- 🔍 SEO友好优化

### 技术栈
- **前端框架**: Nuxt 4 (Vue 3 + TypeScript)
- **UI组件库**: NuxtUI + Tailwind CSS
- **数据库**: Cloudflare Workers KV
- **部署平台**: Cloudflare Pages
- **开发工具**: Vite, ESLint, Prettier

## 🏗️ 技术架构

### 系统架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   用户浏览器     │    │  Cloudflare CDN │    │ Cloudflare Pages│
│                 │◄──►│                 │◄──►│                 │
│  Nuxt 4 应用    │    │   边缘缓存      │    │   静态资源      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                ▲
                                │
                       ┌─────────────────┐
                       │ Cloudflare      │
                       │ Workers KV      │
                       │   数据存储      │
                       └─────────────────┘
```

### 数据流设计
1. **页面加载**: SSG预渲染 + 客户端激活
2. **数据获取**: Workers KV → API → 组件渲染
3. **用户交互**: 客户端状态管理 + 本地存储
4. **搜索功能**: 多引擎路由 + 历史记录

## 🚀 环境搭建

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### 安装步骤
```bash
# 1. 克隆项目
git clone <repository-url>
cd nuxt4-nav

# 2. 安装依赖
pnpm install

# 3. 环境配置
cp .env.example .env.local

# 4. 启动开发服务器
pnpm dev
```

### 环境变量配置
```env
# Cloudflare配置
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id

# 第三方API
CALENDAR_API_KEY=your_calendar_api_key
ANALYTICS_ID=your_analytics_id
```

## 📁 项目结构

```
nuxt4-nav/
├── assets/                 # 静态资源
│   ├── css/               # 全局样式
│   └── images/            # 图片资源
├── components/            # Vue组件
│   ├── layout/           # 布局组件
│   │   ├── Header.vue
│   │   └── Footer.vue
│   ├── navigation/       # 导航相关组件
│   │   ├── NavigationGrid.vue
│   │   ├── NavigationItem.vue
│   │   └── CategorySection.vue
│   ├── search/          # 搜索相关组件
│   │   ├── SearchBox.vue
│   │   ├── SearchEngines.vue
│   │   └── SearchHistory.vue
│   ├── widgets/         # 小组件
│   │   ├── CalendarWidget.vue
│   │   ├── ClockWidget.vue
│   │   └── WeatherWidget.vue
│   └── ui/              # 基础UI组件
├── composables/         # 组合式函数
│   ├── useNavigation.ts
│   ├── useSearch.ts
│   └── useCalendar.ts
├── layouts/             # 布局模板
│   └── default.vue
├── pages/               # 页面路由
│   ├── index.vue        # 首页
│   ├── about.vue        # 关于页面
│   └── admin/           # 管理后台
├── plugins/             # 插件
├── public/              # 公共静态文件
├── server/              # 服务端API
│   └── api/
├── stores/              # Pinia状态管理
├── types/               # TypeScript类型定义
├── utils/               # 工具函数
└── design/              # 设计文档
    ├── prototype.html   # 原型文件
    └── development-guide.md
```

## 🎯 功能实现详解

### 1. 页面布局组件

#### Header组件 (`components/layout/Header.vue`)
```vue
<template>
  <header class="header">
    <div class="logo">
      <div class="logo-icon">🏠</div>
      <span>ztaoHub</span>
    </div>
    <nav class="nav-menu">
      <NuxtLink to="/">主页</NuxtLink>
      <NuxtLink to="/about">关于</NuxtLink>
    </nav>
    <div class="datetime">
      {{ currentTime }}
    </div>
  </header>
</template>

<script setup lang="ts">
const currentTime = ref('')

// 实时更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>
```

### 2. 搜索功能实现

#### SearchBox组件 (`components/search/SearchBox.vue`)
```vue
<template>
  <div class="search-box">
    <UInput
      v-model="searchQuery"
      placeholder="没有广告，直达结果"
      size="xl"
      :ui="{ 
        base: 'search-input',
        rounded: 'rounded-full'
      }"
      @keyup.enter="handleSearch"
    />
    <UButton
      @click="handleSearch"
      size="lg"
      :ui="{ rounded: 'rounded-full' }"
      class="search-submit"
    >
      🔍
    </UButton>
  </div>
</template>

<script setup lang="ts">
const { currentEngine, performSearch } = useSearch()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    performSearch(searchQuery.value, currentEngine.value)
  }
}
</script>
```

#### 搜索引擎管理 (`composables/useSearch.ts`)
```typescript
export const useSearch = () => {
  const currentEngine = ref('bing')
  
  const searchEngines = [
    {
      id: 'bing',
      name: 'Bing必应',
      icon: '🔍',
      url: 'https://www.bing.com/search?q='
    },
    {
      id: 'metaso',
      name: '秘塔AI搜索',
      icon: '🤖',
      url: 'https://metaso.cn/?q='
    },
    // ... 更多搜索引擎
  ]

  const performSearch = (query: string, engine: string) => {
    const engineConfig = searchEngines.find(e => e.id === engine)
    if (engineConfig) {
      // 记录搜索历史
      addSearchHistory(query, engine)
      // 跳转搜索
      window.open(engineConfig.url + encodeURIComponent(query), '_blank')
    }
  }

  const addSearchHistory = (query: string, engine: string) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    history.unshift({ query, engine, timestamp: Date.now() })
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)))
  }

  return {
    currentEngine,
    searchEngines,
    performSearch,
    addSearchHistory
  }
}
```

### 3. 导航网格组件

#### NavigationGrid组件 (`components/navigation/NavigationGrid.vue`)
```vue
<template>
  <section class="content-section">
    <h2 class="section-title">
      <span class="section-icon">{{ category.icon }}</span>
      {{ category.name }}
    </h2>
    <div class="nav-grid">
      <NavigationItem
        v-for="item in category.items"
        :key="item.id"
        :item="item"
        @click="handleItemClick"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
interface NavigationCategory {
  id: string
  name: string
  icon: string
  items: NavigationItem[]
}

interface NavigationItem {
  id: string
  name: string
  url: string
  icon: string
  description?: string
  gradient: string
}

const props = defineProps<{
  category: NavigationCategory
}>()

const handleItemClick = (item: NavigationItem) => {
  // 统计点击
  trackNavigation(item.id, item.name)
  // 打开链接
  window.open(item.url, '_blank')
}
</script>
```

### 4. 黄历功能实现

#### CalendarWidget组件 (`components/widgets/CalendarWidget.vue`)
```vue
<template>
  <section class="content-section">
    <h2 class="section-title">
      <span class="section-icon">📅</span>
      今日黄历
      <span class="lunar-date">{{ lunarDate }}</span>
    </h2>
    <div class="calendar-content">
      <div v-for="item in calendarData" :key="item.label" class="calendar-item">
        <span class="calendar-label">{{ item.label }}</span>
        <span :class="['calendar-value', item.type]">{{ item.value }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: calendarData } = await useFetch('/api/calendar')
const lunarDate = computed(() => {
  // 农历日期计算逻辑
  return '农历八月十七'
})
</script>
```

## 🔍 SEO优化策略

### 1. Meta标签优化

#### nuxt.config.ts配置
```typescript
export default defineNuxtConfig({
  app: {
    head: {
      title: 'ztaoHub - 上网从这里开始',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'ztaoHub提供最实用的网址导航服务，包含常用网站、AI工具、搜索引擎等，让上网更简单高效。遇检求助，读书求理。' 
        },
        { 
          name: 'keywords', 
          content: '导航网站,网址导航,常用网站,AI工具,搜索引擎,ztaoHub,上网导航' 
        },
        { name: 'author', content: 'ztaoHub' },
        { name: 'robots', content: 'index,follow' },
        
        // Open Graph
        { property: 'og:title', content: 'ztaoHub - 上网从这里开始' },
        { property: 'og:description', content: '最实用的网址导航服务' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://nav.60.com' },
        { property: 'og:image', content: '/og-image.jpg' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'ztaoHub - 上网从这里开始' },
        { name: 'twitter:description', content: '最实用的网址导航服务' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://nav.60.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      ]
    }
  }
})
```

### 2. 结构化数据

#### 网站结构化数据 (`composables/useSEO.ts`)
```typescript
export const useSEO = () => {
  const generateWebsiteSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ztaoHub',
      url: 'https://nav.60.com',
      description: '最实用的网址导航服务',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://nav.60.com/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    }
  }

  const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }

  return {
    generateWebsiteSchema,
    generateBreadcrumbSchema
  }
}
```

### 3. 性能优化

#### 图片优化
```vue
<template>
  <!-- 使用 NuxtImg 组件自动优化 -->
  <NuxtImg
    :src="item.icon"
    :alt="item.name"
    width="48"
    height="48"
    format="webp"
    loading="lazy"
    class="nav-icon"
  />
</template>
```

#### 代码分割
```typescript
// 懒加载组件
const CalendarWidget = defineAsyncComponent(() => 
  import('~/components/widgets/CalendarWidget.vue')
)

// 路由级别代码分割
const AdminPanel = defineAsyncComponent(() => 
  import('~/pages/admin/index.vue')
)
```

## 💾 数据设计

### Cloudflare Workers KV 数据结构

#### 1. 导航分类数据 (`nav:categories`)
```json
{
  "categories": [
    {
      "id": "popular",
      "name": "常用导航",
      "icon": "🔥",
      "order": 1,
      "items": [
        {
          "id": "tencent-video",
          "name": "腾讯视频",
          "url": "https://v.qq.com",
          "icon": "▶️",
          "description": "热门影视剧在线观看",
          "gradient": "linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)",
          "category": "video",
          "tags": ["视频", "娱乐", "影视"],
          "clickCount": 0,
          "isActive": true
        }
      ]
    },
    {
      "id": "ai-tools",
      "name": "AI工具",
      "icon": "🤖",
      "order": 2,
      "items": [
        {
          "id": "doubao",
          "name": "抖音AI豆包",
          "url": "https://www.doubao.com",
          "icon": "👤",
          "description": "智能AI助手",
          "gradient": "linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)",
          "category": "ai",
          "tags": ["AI", "聊天", "助手"],
          "clickCount": 0,
          "isActive": true
        }
      ]
    }
  ]
}
```

#### 2. 搜索引擎配置 (`config:search-engines`)
```json
{
  "engines": [
    {
      "id": "bing",
      "name": "Bing必应",
      "icon": "🔍",
      "url": "https://www.bing.com/search?q=",
      "isDefault": true,
      "order": 1
    },
    {
      "id": "metaso",
      "name": "秘塔AI搜索",
      "icon": "🤖",
      "url": "https://metaso.cn/?q=",
      "isDefault": false,
      "order": 2
    }
  ]
}
```

#### 3. 站点配置 (`config:site`)
```json
{
  "site": {
    "title": "ztaoHub",
  "subtitle": "上网，从ztaoHub开始！",
    "description": "遇检求助，读书求理",
    "logo": "🏠",
    "theme": {
      "primaryGradient": "linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)",
      "backgroundColor": "#f8f9fa"
    },
    "features": {
      "calendar": true,
      "weather": false,
      "analytics": true
    },
    "contact": {
      "email": "admin@60nav.com",
      "website": "https://nav.60.com"
    }
  }
}
```

### API接口设计

#### 1. 导航数据API (`server/api/navigation.get.ts`)
```typescript
export default defineEventHandler(async (event) => {
  try {
    const categories = await getKVData('nav:categories')
    
    // 按order排序
    categories.sort((a, b) => a.order - b.order)
    
    // 过滤激活的项目
    categories.forEach(category => {
      category.items = category.items.filter(item => item.isActive)
    })

    return {
      success: true,
      data: categories
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: '获取导航数据失败'
    })
  }
})
```

#### 2. 黄历API (`server/api/calendar.get.ts`)
```typescript
export default defineEventHandler(async (event) => {
  try {
    const today = new Date()
    const cacheKey = `calendar:${today.toDateString()}`
    
    // 尝试从缓存获取
    let calendarData = await getKVData(cacheKey)
    
    if (!calendarData) {
      // 调用第三方黄历API
      calendarData = await fetchCalendarData(today)
      // 缓存一天
      await setKVData(cacheKey, calendarData, 86400)
    }

    return {
      success: true,
      data: calendarData
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: '获取黄历数据失败'
    })
  }
})
```

#### 3. 统计API (`server/api/analytics.post.ts`)
```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { action, itemId, itemName } = body

  try {
    // 记录用户行为
    const analyticsKey = `analytics:${new Date().toDateString()}`
    const analytics = await getKVData(analyticsKey) || { clicks: [] }
    
    analytics.clicks.push({
      itemId,
      itemName,
      action,
      timestamp: Date.now(),
      userAgent: getHeader(event, 'user-agent'),
      ip: getClientIP(event)
    })

    await setKVData(analyticsKey, analytics, 86400 * 30) // 保存30天

    return { success: true }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: '统计记录失败'
    })
  }
})
```

## 🧪 测试策略

### 1. 单元测试配置

#### Vitest配置 (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['text', 'json', 'html'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

#### 组件测试示例 (`tests/components/SearchBox.test.ts`)
```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBox from '~/components/search/SearchBox.vue'

describe('SearchBox', () => {
  it('应该正确渲染搜索框', () => {
    const wrapper = mount(SearchBox)
    expect(wrapper.find('.search-input').exists()).toBe(true)
    expect(wrapper.find('.search-submit').exists()).toBe(true)
  })

  it('应该在按下回车键时触发搜索', async () => {
    const wrapper = mount(SearchBox)
    const input = wrapper.find('.search-input')
    
    await input.setValue('测试搜索')
    await input.trigger('keyup.enter')
    
    // 验证搜索逻辑
    expect(wrapper.emitted('search')).toBeTruthy()
  })
})
```

### 2. E2E测试

#### Playwright配置 (`playwright.config.ts`)
```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } }
  ]
})
```

#### E2E测试示例 (`tests/e2e/navigation.spec.ts`)
```typescript
import { test, expect } from '@playwright/test'

test.describe('导航功能', () => {
  test('应该能够点击导航项目', async ({ page }) => {
    await page.goto('/')
    
    // 等待页面加载
    await page.waitForSelector('.nav-grid')
    
    // 点击第一个导航项目
    const firstNavItem = page.locator('.nav-item').first()
    await expect(firstNavItem).toBeVisible()
    
    // 验证点击行为
    await firstNavItem.click()
    // 验证新标签页打开等行为
  })

  test('搜索功能应该正常工作', async ({ page }) => {
    await page.goto('/')
    
    // 选择搜索引擎
    await page.click('[data-testid="search-engine-bing"]')
    
    // 输入搜索内容
    await page.fill('.search-input', '测试搜索')
    
    // 点击搜索按钮
    await page.click('.search-submit')
    
    // 验证搜索结果页面打开
  })
})
```

## 🚀 部署和运维

### 1. Cloudflare Pages部署

#### 部署配置 (`wrangler.toml`)
```toml
name = "nuxt4-nav"
compatibility_date = "2024-01-01"

[build]
command = "pnpm build"
publish = ".output/public"

[[kv_namespaces]]
binding = "NAV_KV"
id = "your-kv-namespace-id"

[env.production]
vars = { NODE_ENV = "production" }

[env.staging]
vars = { NODE_ENV = "staging" }
```

#### GitHub Actions CI/CD (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build project
        run: pnpm build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: nuxt4-nav
          directory: .output/public
```

### 2. 监控和分析

#### 性能监控 (`plugins/analytics.client.ts`)
```typescript
export default defineNuxtPlugin(() => {
  // Web Vitals监控
  if (process.client) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  }

  // 用户行为分析
  const trackEvent = (eventName: string, properties: Record<string, any>) => {
    // 发送到分析服务
    $fetch('/api/analytics', {
      method: 'POST',
      body: { eventName, properties, timestamp: Date.now() }
    })
  }

  return {
    provide: {
      trackEvent
    }
  }
})
```

### 3. 错误监控

#### 错误处理 (`plugins/error-handler.client.ts`)
```typescript
export default defineNuxtPlugin(() => {
  // 全局错误处理
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    // 发送错误报告
    $fetch('/api/error-report', {
      method: 'POST',
      body: {
        message: event.error.message,
        stack: event.error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    })
  })

  // Promise rejection处理
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
  })
})
```

## 🔧 开发规范

### 1. 代码规范

#### ESLint配置 (`.eslintrc.js`)
```javascript
module.exports = {
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    '@typescript-eslint/no-unused-vars': 'error'
  }
}
```

#### Prettier配置 (`.prettierrc`)
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "endOfLine": "lf"
}
```

### 2. Git提交规范

#### Commitizen配置
```json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

#### 提交消息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型说明：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 📈 扩展规划

### 1. 功能扩展

#### 用户系统
- 用户注册/登录
- 个人收藏夹
- 自定义导航
- 使用偏好设置

#### 管理后台
- 导航管理界面
- 用户管理
- 数据统计分析
- 系统配置

#### 高级功能
- 搜索建议
- 智能推荐
- 主题切换
- 多语言支持

### 2. 技术升级

#### 微服务架构
- API网关
- 服务拆分
- 数据库分离
- 缓存优化

#### 性能优化
- CDN加速
- 图片优化
- 代码分割
- 预加载策略

## 📚 参考资料

### 官方文档
- [Nuxt 4 文档](https://nuxt.com/)
- [NuxtUI 组件库](https://ui.nuxt.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Tailwind CSS](https://tailwindcss.com/)

### 最佳实践
- [Vue 3 组合式API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript 最佳实践](https://typescript-eslint.io/rules/)
- [Web性能优化](https://web.dev/performance/)
- [SEO优化指南](https://developers.google.com/search/docs)

---

## 📞 联系方式

如有问题或建议，请联系开发团队：
- 邮箱: dev@60nav.com
- 项目地址: https://github.com/your-org/nuxt4-nav
- 文档更新: 2024年1月

---

*本文档将随着项目发展持续更新，请关注最新版本。*