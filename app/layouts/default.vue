<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- 头部导航区域 -->
    <HeaderNavigation />

    <!-- 主要内容区域 -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 页面内容插槽 -->
        <slot />
      </div>
    </main>

    <!-- 页脚区域 -->
    <footer class="bg-white dark:bg-gray-800 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-auto footer-glass">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <!-- 版权信息 -->
          <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>&copy; 2024 九贰零玖要录</span>
            <span>·</span>
            <span>上网从这里开始</span>
          </div>
          
          <!-- 链接区域 -->
          <div class="flex space-x-6 text-sm">
            <NuxtLink 
              to="/privacy" 
              class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              隐私政策
            </NuxtLink>
            <NuxtLink 
              to="/terms" 
              class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              使用条款
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              联系我们
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 布局相关的逻辑将在后续添加
</script>

<style scoped>
/* 页脚毛玻璃效果 */
.footer-glass {
  background-color: rgba(255, 255, 255, 0.8);
}

@media (prefers-color-scheme: dark) {
  .footer-glass {
    background-color: rgba(31, 41, 55, 0.8);
  }
}
</style>