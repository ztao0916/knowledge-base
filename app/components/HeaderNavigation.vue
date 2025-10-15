<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-5"
  >
    <UContainer class="max-w-5xl">
      <!-- 顶部导航栏 - 玻璃拟态效果 -->
      <nav
        class="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl shadow-2xl shadow-blue-100/50 mb-8 animate-fade-in"
      >
        <div class="px-8 py-6">
          <!-- Logo和标题区域 -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="relative group">
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"
                ></div>
                <img
                  src="/logo.svg"
                  alt="网站Logo"
                  class="relative w-24 h-16 bg-white rounded-xl p-1 shadow-lg"
                />
              </div>
              <div>
                <h1
                  class="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                >
                  FairyCity
                </h1>
                <p class="text-sm text-gray-500 font-light">
                  是月亮跌进人间时，碎成的一城萤火与花香
                </p>
              </div>
            </div>

            <!-- 装饰性元素 -->
            <div class="hidden md:flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div
                class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style="animation-delay: 0.2s"
              ></div>
              <div
                class="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                style="animation-delay: 0.4s"
              ></div>
            </div>
          </div>

          <!-- 搜索区域 -->
          <div class="relative">
            <!-- 搜索引擎选择器 -->
            <div class="flex items-center gap-2 mb-4">
              <div class="flex gap-2">
                <button
                  v-for="(engine, key) in searchEngines"
                  :key="key"
                  @click="currentEngine = key"
                  :class="[
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105',
                    currentEngine === key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-white/60 text-gray-600 hover:bg-white/80 hover:text-gray-800 border border-gray-200/50',
                  ]"
                >
                  {{ engine.name }}
                </button>
              </div>
            </div>

            <!-- 搜索输入框 - 现代设计 -->
            <div class="relative group">
              <div
                class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"
              ></div>
              <div
                class="relative flex items-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 border border-white/60"
              >
                <div class="pl-6 pr-3">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索你想要的内容..."
                  class="flex-1 py-5 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-lg"
                  @keypress.enter="performSearch"
                />
                <button
                  @click="performSearch"
                  class="mr-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  搜索
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  // 搜索引擎配置
  const searchEngines = {
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

  // 热门搜索标签（已移除）
  // const hotTags = ["设计灵感", "前端开发", "AI工具", "生活助手", "学习资源"];

  // 响应式状态
  const currentEngine = ref<keyof typeof searchEngines>("google");
  const searchQuery = ref("");

  // 搜索功能
  const performSearch = () => {
    if (searchQuery.value.trim()) {
      const searchUrl =
        searchEngines[currentEngine.value].url +
        encodeURIComponent(searchQuery.value.trim());
      window.open(searchUrl, "_blank");
    }
  };
</script>

<style scoped>
  /* 自定义动画 */
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-down {
    animation: fadeInDown 0.6s ease;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease 0.2s both;
  }

  /* 按钮与输入框增强 */
  .search-engine-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .search-engine-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  .search-engine-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  .search-input {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .search-input:focus {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15),
      0 10px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  .hot-tag {
    transition: all 0.2s ease;
  }
  .hot-tag:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    .flex.gap-3 {
      flex-direction: column;
    }

    .header-container {
      padding: 1rem;
      margin: 0.5rem;
    }

    .logo-section {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }

    .logo-container {
      width: 2.5rem;
      height: 2.5rem;
    }

    .site-title {
      font-size: 1.25rem;
    }

    .site-subtitle {
      font-size: 0.75rem;
    }

    .search-engines {
      gap: 0.5rem;
    }

    .search-engine-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
    }

    .search-input {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
    }

    .search-btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
    }

    .hot-tags {
      gap: 0.5rem;
    }

    .hot-tag {
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .header-container {
      padding: 0.75rem;
      margin: 0.25rem;
    }

    .logo-section {
      gap: 0.25rem;
    }

    .logo-container {
      width: 2rem;
      height: 2rem;
    }

    .site-title {
      font-size: 1.125rem;
    }

    .search-engines {
      flex-wrap: wrap;
    }

    .search-engine-btn {
      flex: 1;
      min-width: 60px;
    }

    .hot-tags {
      justify-content: center;
    }
  }
</style>
