<template>
  <div class="category-navigation">
    <UContainer class="max-w-5xl">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在加载分类数据...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <p class="error-text">{{ error }}</p>
        <button @click="refreshCategories" class="retry-button">
          重试
        </button>
      </div>
      
      <!-- 正常内容 -->
      <div v-else class="nav-section">
        <div 
          v-for="(category, index) in categories" 
          :key="category.id"
          class="category-card"
          :style="{ 
            animationDelay: `${index * 0.15}s`,
            '--card-index': index 
          }"
        >
          <div class="category-title">
            <div class="category-icon">{{ category.icon }}</div>
            {{ category.name }}
          </div>
          <div class="links-grid">
            <a 
              v-for="(link, linkIndex) in category.links" 
              :key="link.name"
              :href="link.url" 
              class="link-item" 
              target="_blank"
              rel="noopener noreferrer"
              :style="{ 
                animationDelay: `${(index * 0.15) + (linkIndex * 0.05)}s` 
              }"
            >
              <div class="link-icon"></div>
              {{ link.name }}
            </a>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
// 响应式数据
const categories = ref([])
const loading = ref(true)
const error = ref(null)

// 获取分类数据
const fetchCategories = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch('/api/categories')
    
    if (response.success) {
      categories.value = response.data
    } else {
      throw new Error(response.message || '获取分类数据失败')
    }
  } catch (err) {
    console.error('获取分类数据失败:', err)
    error.value = err.message || '网络请求失败'
    
    // 发生错误时使用备用数据
    categories.value = [
      {
        id: 'social',
        name: '社交媒体',
        icon: '📱',
        links: [
          { name: '微博', url: 'https://weibo.com' },
          { name: '知乎', url: 'https://www.zhihu.com' }
        ]
      }
    ]
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchCategories()
})

// 提供刷新功能
const refreshCategories = () => {
  fetchCategories()
}

// 暴露刷新方法给父组件
defineExpose({
  refreshCategories
})
</script>

<style scoped>
.category-navigation {
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.05) 0%, 
    rgba(168, 85, 247, 0.05) 25%, 
    rgba(236, 72, 153, 0.05) 50%, 
    rgba(251, 146, 60, 0.05) 75%, 
    rgba(34, 197, 94, 0.05) 100%);
  padding: 3rem 0;
  position: relative;
  overflow: hidden;
}

.category-navigation::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.nav-section {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  animation: staggerIn 1.2s ease;
  position: relative;
  z-index: 1;
}

.category-card {
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 0.85) 100%);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(31, 38, 135, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: slideInUp 0.8s ease both, floatIn 1s ease both;
  position: relative;
  overflow: hidden;
  transform: translateY(calc(var(--card-index) * 10px));
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, 
    #667eea 0%, 
    #764ba2 25%, 
    #f093fb 50%, 
    #f5576c 75%, 
    #4facfe 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card:hover::before {
  opacity: 1;
}

.category-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.15),
    0 16px 48px rgba(31, 38, 135, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.category-title {
  font-size: 1.375rem;
  margin-bottom: 1.5rem;
  color: rgb(31 41 55);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.category-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 50%, 
    #f093fb 100%);
  box-shadow: 
    0 8px 16px rgba(102, 126, 234, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.category-card:hover .category-icon::before {
  animation: shimmer 1.5s ease-in-out;
}

.category-card:hover .category-icon {
  transform: rotate(5deg) scale(1.1);
  box-shadow: 
    0 12px 24px rgba(102, 126, 234, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.links-grid {
  display: grid;
  gap: 0.875rem;
}

.link-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, 
    rgba(249, 250, 251, 0.9) 0%, 
    rgba(243, 244, 246, 0.8) 100%);
  border-radius: 1rem;
  color: rgb(55 65 81);
  text-decoration: none;
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  font-weight: 500;
  animation: slideInLeft 0.6s ease both;
}

.link-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(99, 102, 241, 0.1), 
    transparent);
  transition: left 0.6s ease;
}

.link-item:hover::before {
  left: 100%;
}

.link-item:hover {
  background: linear-gradient(135deg, 
    rgba(239, 246, 255, 0.95) 0%, 
    rgba(219, 234, 254, 0.9) 100%);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateX(8px) scale(1.02);
  color: rgb(17 24 39);
  box-shadow: 
    0 8px 16px rgba(99, 102, 241, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.link-item:active {
  transform: translateX(6px) scale(0.98);
}

.link-icon {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-right: 1rem;
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 50%, 
    #f093fb 100%);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.link-item:hover .link-icon {
  transform: scale(1.2);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes floatIn {
  0% {
    transform: translateY(calc(var(--card-index) * 10px)) rotateX(15deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(calc(var(--card-index) * 10px)) rotateX(0deg);
    opacity: 1;
  }
}

@keyframes staggerIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    opacity: 0;
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .category-navigation {
    padding: 1.5rem 1rem;
    margin: 0 0.5rem;
  }
  
  .nav-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .category-card {
    padding: 1.5rem;
    border-radius: 1.25rem;
    transform: translateY(0);
    animation: slideInUp 0.6s ease both, mobileFloatIn 0.8s ease both;
  }
  
  .category-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .category-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
  }
  
  .link-item {
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
    animation: slideInLeft 0.4s ease both;
  }
  
  .link-icon {
    width: 0.75rem;
    height: 0.75rem;
  }
}

@media (max-width: 480px) {
  .category-navigation {
    padding: 1rem 0.75rem;
    margin: 0 0.25rem;
  }
  
  .category-card {
    padding: 1.25rem;
    border-radius: 1rem;
  }
  
  .category-title {
    font-size: 1.125rem;
  }
  
  .category-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .link-item {
    padding: 0.75rem 0.875rem;
    font-size: 0.875rem;
  }
}

/* 移动端专用动画 */
@keyframes mobileFloatIn {
  0% {
    transform: translateY(20px) scale(0.95);
    opacity: 0.7;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .category-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 12px 40px rgba(31, 38, 135, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  
  .link-item:hover {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.1) 0%, 
      rgba(168, 85, 247, 0.1) 100%);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateX(8px);
  }
  
  .category-icon:hover {
    transform: scale(1.1) rotate(5deg);
  }
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

.loading-text {
  color: rgb(107 114 128);
  font-size: 1.125rem;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-text {
  color: rgb(239 68 68);
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.retry-button {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.retry-button:active {
  transform: translateY(0);
}
</style>