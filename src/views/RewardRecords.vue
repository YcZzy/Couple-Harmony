<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRewardStore } from '../stores/reward';
import type { RewardRecord } from '../stores/reward';

const rewardStore = useRewardStore();

// 初始化奖励存储
onMounted(() => {
  rewardStore.initializeStore();
});

// 按日期排序，最新的排在前面
const sortedRecords = computed(() => {
  return [...rewardStore.rewardRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">奖惩记录</h1>
    </div>

    <div v-if="sortedRecords.length === 0" class="p-6 bg-gray-50 rounded-lg text-center">
      <p class="text-gray-600">暂无奖惩记录，前往奖惩页面抽奖获取记录。</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="record in sortedRecords" 
        :key="record.id"
        :class="[
          'p-4 rounded-lg shadow border-l-4',
          record.type === 'reward' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
        ]"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">{{ record.rewardName }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ formatDate(record.date) }}</p>
          </div>
          <span :class="[
            'px-2 py-1 rounded text-sm',
            record.type === 'reward' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          ]">
            {{ record.type === 'reward' ? '奖励' : '惩罚' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template> 