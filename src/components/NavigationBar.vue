<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const navigation = [
  { name: '仪表盘', path: '/' },
  { name: '争吵记录', path: '/arguments' },
  { name: '日历', path: '/calendar' },
  { name: '分析', path: '/analytics' },
  { name: '奖励', path: '/rewards' },
  { name: '奖励记录', path: '/reward-records' }
];
</script>

<template>
  <nav class="bg-white shadow">
    <div class="container mx-auto px-4">
      <div class="flex h-16 justify-between items-center">
        <div class="flex flex-1 items-center justify-between">
          <div class="flex flex-shrink-0 items-center">
            <span class="text-xl font-bold text-blue-600">Couple Harmony</span>
          </div>
          
          <!-- 桌面端导航 -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              :class="[
                'inline-flex items-center px-1 pt-1 text-sm font-medium',
                route.path === item.path
                  ? 'border-b-2 border-blue-500 text-gray-900'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
          
          <!-- 移动端汉堡菜单按钮 -->
          <div class="flex items-center sm:hidden">
            <button 
              @click="toggleMenu"
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
              aria-expanded="false"
            >
              <span class="sr-only">打开主菜单</span>
              <!-- 汉堡菜单图标 -->
              <svg 
                v-if="!isMenuOpen" 
                class="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <!-- 关闭图标 -->
              <svg 
                v-else 
                class="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 移动端下拉菜单 -->
    <div 
      v-if="isMenuOpen" 
      class="sm:hidden"
    >
      <div class="space-y-1 pb-3 pt-2">
        <router-link
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          :class="[
            'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
            route.path === item.path
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
          ]"
          @click="isMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>
