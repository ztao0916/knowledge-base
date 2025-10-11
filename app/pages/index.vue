<template>
  <div>
    <!-- 欢迎区域 -->
    <section class="text-center py-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        欢迎来到 ztaoHub
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
        个人导航网站 - 您的专属网址收藏夹
      </p>
      <div class="w-32 h-10 bg-blue-500 rounded-lg mx-auto"></div>
    </section>

    <!-- 搜索区域 -->
    <section class="mb-12">
      <div class="max-w-2xl mx-auto">
        <div class="relative">
          <div class="w-full h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm"></div>
          <div class="absolute right-3 top-3 w-6 h-6 bg-gray-400 rounded"></div>
        </div>
      </div>
    </section>

    <!-- 导航分类区域 -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        热门分类
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="i in 12" :key="i" class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="w-8 h-8 bg-blue-500 rounded mb-2"></div>
          <div class="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </section>

    <!-- 最近访问区域 -->
    <section>
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        最近访问
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-green-500 rounded-full mr-3"></div>
            <div>
              <div class="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
              <div class="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 页面相关的逻辑将在后续添加
</script>

<style scoped>
/* 页面特定样式将在后续添加 */
</style>