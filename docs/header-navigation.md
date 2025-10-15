# 头部导航开发文档

## 📋 概述

根据 `design/nav.html` 原型文件分析，头部导航包含**网站标题区域**和**搜索功能区域**两个主要部分。

## 🎯 功能模块

### 1. 网站标题区域 (Header)

**设计特点：**
- 居中布局，白色文字
- 渐变背景 (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)
- 包含主标题和副标题
- 带有淡入动画效果

**组件结构：**
```vue
<header class="text-center text-white mb-10 animate-fade-in-down">
  <h1 class="text-4xl mb-2 font-light tracking-wider">
    🌟 我的导航站
  </h1>
  <p class="text-lg opacity-90">
    快速访问你常用的网站
  </p>
</header>
```

### 2. 搜索功能区域 (Search Section)

**核心功能：**
- 多搜索引擎切换（百度、谷歌、必应、搜狗）
- 搜索输入框
- 搜索按钮
- 支持回车键搜索

**搜索引擎配置：**
```typescript
const searchEngines = {
  baidu: 'https://www.baidu.com/s?wd=',
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  sogou: 'https://www.sogou.com/web?query='
}
```

## 🎨 设计规范

### 颜色系统
- **主色调：** `#667eea` 到 `#764ba2` 渐变
- **背景色：** 白色卡片 (`#ffffff`)
- **文字色：** 深灰色 (`#333333`)
- **边框色：** 浅灰色 (`#e0e0e0`)

### 圆角规范
- **卡片圆角：** `16px`
- **按钮圆角：** `25px` (椭圆形)
- **输入框圆角：** `50px` (胶囊形)

### 间距系统
- **容器最大宽度：** `1200px`
- **卡片内边距：** `30px`
- **元素间距：** `15px` - `40px`

## 📱 响应式设计

### 移动端适配 (≤768px)
- 标题字体缩小至 `2em`
- 搜索框改为垂直布局
- 搜索按钮占满宽度
- 卡片内边距减少至 `20px`

## ⚡ 交互效果

### 动画效果
1. **淡入下滑：** 标题区域 (`fadeInDown`)
2. **淡入上滑：** 搜索区域和导航卡片 (`fadeInUp`)
3. **悬停效果：** 按钮上移 + 阴影增强
4. **焦点效果：** 输入框边框高亮 + 外发光

### 状态管理
- 搜索引擎选中状态
- 输入框焦点状态
- 按钮悬停状态

## 🛠️ 技术实现建议

### NuxtUI 组件映射
- **UContainer：** 容器布局
- **UCard：** 搜索区域卡片
- **UButton：** 搜索引擎切换按钮
- **UInput：** 搜索输入框
- **UButtonGroup：** 搜索引擎按钮组

### 状态管理
```typescript
// 使用 Nuxt 3 的 useState
const currentEngine = useState('searchEngine', () => 'baidu')
const searchQuery = ref('')
```

### 搜索功能实现
```typescript
const performSearch = () => {
  if (searchQuery.value.trim()) {
    const searchUrl = searchEngines[currentEngine.value] + 
                     encodeURIComponent(searchQuery.value)
    window.open(searchUrl, '_blank')
  }
}
```

## 📦 开发优先级

1. **P0 - 核心功能**
   - 网站标题显示
   - 基础搜索功能
   - 搜索引擎切换

2. **P1 - 视觉效果**
   - 渐变背景
   - 卡片样式
   - 基础动画

3. **P2 - 交互优化**
   - 悬停效果
   - 焦点状态
   - 响应式适配

## 📝 实现注意事项

1. **性能优化**
   - 使用 CSS 变量管理颜色主题
   - 动画使用 `transform` 和 `opacity` 属性
   - 避免频繁的 DOM 操作

2. **无障碍访问**
   - 为搜索输入框添加 `aria-label`
   - 确保键盘导航支持
   - 保持足够的颜色对比度

3. **SEO 优化**
   - 使用语义化的 HTML 标签
   - 为搜索功能添加合适的 meta 标签
   - 确保页面标题和描述的准确性

这个头部导航设计简洁现代，功能实用，符合当前主流导航站的设计趋势。建议使用 NuxtUI 组件库来快速实现，确保组件的一致性和可维护性。