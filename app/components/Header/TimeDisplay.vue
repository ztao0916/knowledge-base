<template>
  <div class="select-none">
    <div class="flex items-center text-right">
      <!-- 年月日星期在同一行 -->
      <div class="text-sm font-medium text-gray-900 dark:text-white font-mono tabular-nums">
        {{ currentDateWithWeekday }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const currentDateWithWeekday = ref('')
let timer: ReturnType<typeof setInterval> | null = null

// 格式化日期和星期在同一行
const formatDateWithWeekday = (date: Date): string => {
  const dateStr = date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const weekdayStr = date.toLocaleDateString('zh-CN', {
    weekday: 'long'
  })
  return `${dateStr} ${weekdayStr}`
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentDateWithWeekday.value = formatDateWithWeekday(now)
}

// 组件挂载时启动定时器
onMounted(() => {
  updateTime() // 立即更新一次
  timer = setInterval(updateTime, 60000) // 每分钟更新一次即可
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>