# 头部导航开发文档

## 📋 概述

基于 Nuxt4 + NuxtUI 构建的现代化头部导航组件，采用玻璃拟态设计风格，包含**品牌标识区域**和**智能搜索功能区域**两个核心模块。

## 🎯 功能模块

### 1. 品牌标识区域 (Brand Section)

**设计特点：**
- 玻璃拟态效果 (`backdrop-blur-xl bg-white/70`)
- Logo + 品牌名称 + 副标题的组合布局
- 渐变文字效果 (`bg-gradient-to-r from-gray-800 to-gray-600`)
- 装饰性脉动动画元素

**组件结构：**
```vue
<div class="flex items-center gap-4">
  <div class="bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm">
    <img src="/logo.svg" alt="网站Logo" class="w-16 h-12" />
  </div>
  <div>
    <h1 class="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
      FairyCity
    </h1>
    <p class="text-sm text-gray-500 font-light">
      是月亮跌进人间时，碎成的一城萤火与花香
    </p>
  </div>
</div>
```

### 2. 智能搜索功能区域 (Search Section)

**核心功能：**
- 多搜索引擎切换（谷歌、百度、必应、秘塔）
- 现代化搜索输入框设计
- 渐变搜索按钮
- 支持回车键快速搜索
- 响应式交互效果

**搜索引擎配置：**
```typescript
const searchEngines: SearchEngines = {
  google: {
    name: "谷歌",
    url: "https://www.google.com/search?q=",
  },
  baidu: {
    name: "百度",
    url: "https://www.baidu.com/s?wd=",
  },
  bing: {
    name: "必应",
    url: "https://www.bing.com/search?q=",
  },
  metaso: {
    name: "秘塔",
    url: "https://metaso.cn/search?q=",
  },
};
```

## 🎨 设计规范

### 颜色系统
- **主色调：** 蓝紫渐变 (`from-blue-500 to-purple-600`)
- **背景色：** 玻璃拟态白色 (`bg-white/70`, `bg-white/90`)
- **文字色：** 渐变灰色 (`from-gray-800 to-gray-600`)
- **装饰色：** 蓝色、紫色、粉色脉动点 (`bg-blue-400`, `bg-purple-400`, `bg-pink-400`)

### 玻璃拟态效果
- **背景模糊：** `backdrop-blur-xl`
- **透明度：** `bg-white/70` (70% 透明度)
- **边框：** `border-white/20` (20% 透明度白色边框)
- **阴影：** `shadow-2xl shadow-blue-100/50`

### 圆角规范
- **导航容器：** `rounded-2xl` (16px)
- **Logo容器：** `rounded-xl` (12px)
- **搜索按钮：** `rounded-full` (完全圆角)
- **搜索框：** `rounded-2xl` (16px)

### 间距系统
- **容器最大宽度：** `max-w-5xl` (1024px)
- **导航内边距：** `px-8 py-6`
- **元素间距：** `gap-2` 到 `gap-4` (8px-16px)
- **页面边距：** `p-5` (20px)

## 📱 响应式设计

### 移动端适配 (≤768px)
- Logo 和标题区域垂直布局
- 装饰性元素隐藏 (`hidden md:flex`)
- 搜索引擎按钮自适应布局
- 搜索框和按钮保持水平布局
- 容器边距自动调整

### 平板端适配 (768px-1024px)
- 保持桌面端布局结构
- 适当调整间距和字体大小
- 装饰元素正常显示

## ⚡ 交互效果

### 动画效果
1. **脉动动画：** 装饰性圆点 (`animate-pulse`)
2. **悬停缩放：** 搜索引擎按钮 (`hover:scale-105`)
3. **渐变光晕：** 搜索框外围光效 (`group-hover:opacity-50`)
4. **按钮变换：** 搜索按钮悬停效果 (`hover:shadow-xl transform hover:scale-105`)

### 状态管理
- 搜索引擎选中状态 (动态类绑定)
- 输入框焦点状态 (`focus:outline-none`)
- 按钮悬停状态 (CSS 过渡效果)
- 组件响应式状态 (`ref` 和 `reactive`)

## 🛠️ 技术实现

### 核心技术栈
- **框架：** Nuxt 4 (Vue 3 + TypeScript)
- **UI 库：** NuxtUI (基于 Tailwind CSS)
- **样式：** Tailwind CSS + 玻璃拟态设计
- **状态管理：** Vue 3 Composition API

### 组件架构
```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-5">
    <UContainer class="max-w-5xl">
      <nav class="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl shadow-2xl shadow-blue-100/50 mb-8">
        <!-- 品牌标识区域 -->
        <div class="flex items-center justify-between mb-6">
          <!-- Logo + 标题 -->
          <!-- 装饰性元素 -->
        </div>
        
        <!-- 搜索功能区域 -->
        <div class="relative">
          <!-- 搜索引擎选择器 -->
          <!-- 搜索输入框 -->
        </div>
      </nav>
    </UContainer>
  </div>
</template>
```

### TypeScript 类型定义
```typescript
interface SearchEngine {
  name: string;
  url: string;
}

interface SearchEngines {
  google: SearchEngine;
  baidu: SearchEngine;
  bing: SearchEngine;
  metaso: SearchEngine;
}
```

### 状态管理
```typescript
// 使用 Vue 3 Composition API
const currentEngine = ref<keyof typeof searchEngines>("google");
const searchQuery = ref("");

// 搜索功能实现
const performSearch = () => {
  if (searchQuery.value.trim()) {
    const searchUrl = searchEngines[currentEngine.value].url + 
                     encodeURIComponent(searchQuery.value.trim());
    window.open(searchUrl, "_blank");
  }
};
```

## 🎯 开发优先级

### 第一阶段：核心功能 ✅
- [x] 基础布局结构搭建
- [x] 品牌标识区域 (Logo + 标题)
- [x] 搜索引擎选择功能
- [x] 搜索输入框和按钮
- [x] 基础样式和响应式设计

### 第二阶段：视觉优化 ✅
- [x] 玻璃拟态背景效果
- [x] 渐变色彩系统
- [x] 装饰性动画元素
- [x] 悬停和交互效果
- [x] 阴影和光效处理

### 第三阶段：用户体验 ✅
- [x] 键盘快捷键支持 (Enter 搜索)
- [x] 搜索引擎状态记忆
- [x] 输入验证和错误处理
- [x] 无障碍访问优化
- [x] 性能优化和代码分割

## 💡 实现要点

### 性能优化
- **组件懒加载：** 使用 `defineAsyncComponent`
- **图片优化：** SVG 格式 Logo，减少加载时间
- **CSS 优化：** Tailwind CSS 按需加载
- **代码分割：** 搜索功能独立模块化

### 无障碍访问
- **语义化标签：** 使用 `<nav>`, `<button>`, `<input>` 等
- **键盘导航：** Tab 键顺序和 Enter 键支持
- **屏幕阅读器：** `aria-label` 和 `alt` 属性
- **对比度：** 确保文字和背景对比度符合 WCAG 标准

### SEO 优化
- **结构化数据：** 使用语义化 HTML 结构
- **页面标题：** 动态设置页面 title 和 meta
- **预加载资源：** 关键 CSS 和字体预加载
- **服务端渲染：** Nuxt 4 SSR 支持

这个头部导航设计简洁现代，功能实用，符合当前主流导航站的设计趋势。建议使用 NuxtUI 组件库来快速实现，确保组件的一致性和可维护性。