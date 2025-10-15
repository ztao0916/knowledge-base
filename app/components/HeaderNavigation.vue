<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
    <UContainer class="max-w-6xl">
      <!-- 网站标题区域 -->
      <header class="text-center text-white mb-10 animate-fade-in-down">
        <div class="flex items-center justify-center gap-4 mb-4">
          <img src="/logo.svg" alt="网站Logo" class="w-12 h-12" />
          <h1 class="text-4xl font-light tracking-wider">我的导航站</h1>
        </div>
        <p class="text-lg opacity-90">快速访问你常用的网站</p>
      </header>

      <!-- 搜索功能区域 -->
      <UCard class="mb-8 animate-fade-in-up">
        <template #default>
          <div class="space-y-6">
            <!-- 搜索引擎切换 -->
            <div class="flex flex-wrap gap-3 justify-center">
              <UButton
                v-for="(engine, key) in searchEngines"
                :key="key"
                :variant="currentEngine === key ? 'solid' : 'outline'"
                :color="currentEngine === key ? 'primary' : 'gray'"
                size="sm"
                class="rounded-full px-6"
                @click="currentEngine = key"
              >
                {{ engine.name }}
              </UButton>
            </div>

            <!-- 搜索输入框 -->
            <div class="flex gap-3 max-w-2xl mx-auto">
              <UInput
                v-model="searchQuery"
                placeholder="搜索你想要的内容..."
                size="lg"
                class="flex-1"
                :ui="{
                  base: 'rounded-full',
                  padding: { lg: 'px-6 py-4' },
                }"
                @keypress.enter="performSearch"
              />
              <UButton
                size="lg"
                class="rounded-full px-8"
                @click="performSearch"
              >
                搜索
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  // 搜索引擎配置
  const searchEngines = {
    baidu: {
      name: "百度",
      url: "https://www.baidu.com/s?wd=",
    },
    google: {
      name: "谷歌",
      url: "https://www.google.com/search?q=",
    },
    bing: {
      name: "必应",
      url: "https://www.bing.com/search?q=",
    },
    sogou: {
      name: "搜狗",
      url: "https://www.sogou.com/web?query=",
    },
  };

  // 响应式状态
  const currentEngine = ref<keyof typeof searchEngines>("baidu");
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

  /* 响应式设计 */
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    .flex.gap-3 {
      flex-direction: column;
    }
  }
</style>
