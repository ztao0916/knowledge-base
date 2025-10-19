<template>
  <div class="category-navigation">
    <UContainer class="max-w-5xl">
      <div class="nav-section">
        <div 
          v-for="(category, index) in categories" 
          :key="category.id"
          class="category-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="category-title">
            <div class="category-icon">{{ category.icon }}</div>
            {{ category.name }}
          </div>
          <div class="links-grid">
            <a 
              v-for="link in category.links" 
              :key="link.name"
              :href="link.url" 
              class="link-item" 
              target="_blank"
              rel="noopener noreferrer"
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
// 静态分类数据
const categories = ref([
  {
    id: 'social',
    name: '社交媒体',
    icon: '📱',
    links: [
      { name: '微博', url: 'https://weibo.com' },
      { name: '知乎', url: 'https://www.zhihu.com' },
      { name: '豆瓣', url: 'https://www.douban.com' },
      { name: '小红书', url: 'https://www.xiaohongshu.com' }
    ]
  },
  {
    id: 'video',
    name: '视频娱乐',
    icon: '🎬',
    links: [
      { name: '哔哩哔哩', url: 'https://www.bilibili.com' },
      { name: 'YouTube', url: 'https://www.youtube.com' },
      { name: '爱奇艺', url: 'https://www.iqiyi.com' },
      { name: '腾讯视频', url: 'https://v.qq.com' }
    ]
  },
  {
    id: 'shopping',
    name: '购物网站',
    icon: '🛍️',
    links: [
      { name: '淘宝', url: 'https://www.taobao.com' },
      { name: '京东', url: 'https://www.jd.com' },
      { name: '天猫', url: 'https://www.tmall.com' },
      { name: '拼多多', url: 'https://www.pinduoduo.com' }
    ]
  },
  {
    id: 'development',
    name: '开发工具',
    icon: '💻',
    links: [
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
      { name: 'CSDN', url: 'https://www.csdn.net' },
      { name: '掘金', url: 'https://juejin.cn' }
    ]
  },
  {
    id: 'news',
    name: '新闻资讯',
    icon: '📰',
    links: [
      { name: '腾讯新闻', url: 'https://news.qq.com' },
      { name: '今日头条', url: 'https://www.toutiao.com' },
      { name: '新浪新闻', url: 'https://news.sina.com.cn' },
      { name: '网易新闻', url: 'https://www.163.com' }
    ]
  },
  {
    id: 'music',
    name: '音乐电台',
    icon: '🎵',
    links: [
      { name: '网易云音乐', url: 'https://music.163.com' },
      { name: 'QQ音乐', url: 'https://y.qq.com' },
      { name: '酷狗音乐', url: 'https://www.kugou.com' },
      { name: '酷我音乐', url: 'https://www.kuwo.cn' }
    ]
  }
])
</script>

<style scoped>
.category-navigation {
  background: linear-gradient(135deg, rgb(248 250 252) 0%, rgb(255 255 255) 50%, rgb(239 246 255) 100%);
  padding: 2rem 0;
}

.nav-section {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  animation: fadeInUp 0.8s ease;
}

.category-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease both;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

.category-title {
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
  color: rgb(31 41 55);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.links-grid {
  display: grid;
  gap: 0.75rem;
}

.link-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(249 250 251, 0.8);
  border-radius: 0.75rem;
  color: rgb(55 65 81);
  text-decoration: none;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.link-item:hover {
  background: rgba(243 244 246, 0.8);
  border-color: rgb(191 219 254);
  transform: translateX(4px);
  color: rgb(17 24 39);
}

.link-icon {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .category-card {
    padding: 1rem;
  }
  
  .category-title {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
}

@media (max-width: 640px) {
  .category-navigation {
    padding: 1.5rem 0;
  }
  
  .links-grid {
    gap: 0.5rem;
  }
  
  .link-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>