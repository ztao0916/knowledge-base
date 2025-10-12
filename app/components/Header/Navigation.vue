<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-sm"
    :style="{
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
    }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo 和标题区域 -->
        <div
          class="flex items-center space-x-4 cursor-pointer hover:scale-105 transition-transform duration-200"
        >
          <div class="flex-shrink-0">
            <img
              src="/logo.svg"
              alt="九贰零玖要录"
              class="w-8 h-8"
            />
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              九贰零玖要录
            </h1>
          </div>
        </div>

        <!-- 桌面端导航菜单 -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink
            to="/"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 relative group"
            :class="{
              'text-primary-600 dark:text-primary-400': $route.path === '/',
            }"
          >
            首页
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"
              :class="{ 'w-full': $route.path === '/' }"
            ></span>
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 relative group"
            :class="{
              'text-primary-600 dark:text-primary-400':
                $route.path === '/about',
            }"
          >
            关于
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"
              :class="{ 'w-full': $route.path === '/about' }"
            ></span>
          </NuxtLink>
        </nav>

        <!-- 右侧功能区域 -->
        <div class="flex items-center space-x-4">
          <!-- 时间显示组件 -->
          <HeaderTimeDisplay class="hidden lg:block" />

          <!-- 主题切换按钮 -->
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            square
            @click="toggleColorMode"
            class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <UIcon
              :name="
                $colorMode.value === 'dark'
                  ? 'i-heroicons-sun'
                  : 'i-heroicons-moon'
              "
              class="w-5 h-5"
            />
          </UButton>

          <!-- 移动端菜单按钮 -->
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            square
            @click="toggleMobileMenu"
            class="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <UIcon
              :name="
                isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'
              "
              class="w-5 h-5"
            />
          </UButton>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden absolute top-full left-0 right-0 backdrop-blur-md border-b shadow-md"
          :style="{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }"
        >
          <div class="px-4 py-6">
            <!-- 移动端时间显示 -->
            <div class="mb-4 lg:hidden">
              <HeaderTimeDisplay />
            </div>

            <!-- 移动端导航链接 -->
            <div class="space-y-2">
              <NuxtLink
                to="/"
                @click="closeMobileMenu"
                class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200"
                :class="{
                  'text-primary-600 dark:text-primary-400': $route.path === '/',
                }"
                :style="
                  $route.path === '/'
                    ? { backgroundColor: 'rgba(var(--color-primary-50), 1)' }
                    : {}
                "
              >
                首页
              </NuxtLink>
              <NuxtLink
                to="/about"
                @click="closeMobileMenu"
                class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200"
                :class="{
                  'text-primary-600 dark:text-primary-400':
                    $route.path === '/about',
                }"
                :style="
                  $route.path === '/about'
                    ? { backgroundColor: 'rgba(var(--color-primary-50), 1)' }
                    : {}
                "
              >
                关于
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
  // 移动端菜单状态
  const isMobileMenuOpen = ref(false);

  // 主题切换
  const colorMode = useColorMode();
  const toggleColorMode = () => {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  };

  // 移动端菜单控制
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
  };

  // 监听路由变化，自动关闭移动端菜单
  const route = useRoute();
  watch(
    () => route.path,
    () => {
      closeMobileMenu();
    }
  );

  // 监听暗色模式变化，动态调整背景色
  const _isDark = computed(() => colorMode.value === "dark");
</script>

<style scoped>
  /* 暗色模式下的背景色调整 */
  .dark header {
    background-color: rgba(17, 24, 39, 0.8) !important;
  }

  .dark .mobile-menu {
    background-color: rgba(17, 24, 39, 0.95) !important;
  }
</style>
