<script setup lang="ts">
import { useArgumentStore } from '../stores/argument';
import { computed } from 'vue';
import StatCard from '../components/StatCard.vue';
import QuickAdd from '../components/QuickAdd.vue';
import CategoryManager from '../components/CategoryManager.vue';

const store = useArgumentStore();

const recentArguments = computed(() => {
  return store.argumentList?.slice(-5).reverse() || [];
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-900">仪表盘</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="解决率"
        :value="`${store.resolutionRate.toFixed(1)}%`"
        trend="up"
      />
      <StatCard
        title="总争吵次数"
        :value="store.argumentList.length"
      />
      <StatCard
        title="活跃问题"
        :value="store.argumentList.filter(arg => arg.status === 'ongoing').length"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">快速添加</h2>
        <QuickAdd />
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <CategoryManager />
      </div>

      <div class="bg-white p-6 rounded-lg shadow lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4">最近活动</h2>
        <div class="space-y-4">
          <div v-for="arg in recentArguments" :key="arg.id"
               class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p class="font-medium">
                {{ store.categories.find(c => c.id === arg.category)?.name || arg.category }}
              </p>
              <p class="text-sm text-gray-500">{{ new Date(arg.date).toLocaleDateString() }}</p>
            </div>
            <span :class="{
              'px-2 py-1 rounded text-sm': true,
              'bg-red-100 text-red-800': arg.status === 'ongoing',
              'bg-green-100 text-green-800': arg.status === 'resolved'
            }">
              {{ arg.status === 'ongoing' ? '进行中' : '已解决' }}
            </span>
          </div>
          <div v-if="recentArguments.length === 0" class="text-center text-gray-500 py-4">
            没有最近的争吵
          </div>
        </div>
      </div>
    </div>
  </div>
</template>