<template>
  <div class="time-display">
    <div class="flex flex-col items-end text-right">
      <!-- 当前时间 -->
      <div class="text-lg font-medium text-gray-900 dark:text-white">
        {{ currentTime }}
      </div>
      <!-- 当前日期 -->
      <div class="text-sm text-gray-600 dark:text-gray-300">
        {{ currentDate }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const currentTime = ref('')
const currentDate = ref('')
let timer: ReturnType<typeof setInterval> | null = null

// 格式化时间
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 格式化日期
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = formatTime(now)
  currentDate.value = formatDate(now)
}

// 组件挂载时启动定时器
onMounted(() => {
  updateTime() // 立即更新一次
  timer = setInterval(updateTime, 1000) // 每秒更新
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.time-display {
  @apply select-none;
}

/* 时间数字的等宽字体效果 */
.time-display .text-lg {
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}
</style>