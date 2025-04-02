<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
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
      <div class="flex h-16 justify-between">
        <div class="flex">
          <div class="flex flex-shrink-0 items-center">
            <span class="text-xl font-bold text-blue-600">Couple Harmony</span>
          </div>
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
        </div>
      </div>
    </div>
  </nav>
</template>