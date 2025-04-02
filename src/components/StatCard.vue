<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  trend?: 'up' | 'down';
}>();
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
    <div class="mt-2 flex items-baseline">
      <p class="text-3xl font-semibold text-gray-900">{{ value }}</p>
      <p v-if="trend" 
         :class="[
           'ml-2 flex items-baseline text-sm font-semibold',
           trend === 'up' ? 'text-green-600' : 'text-red-600'
         ]">
        <span class="sr-only">{{ trend === 'up' ? '增加' : '减少' }}</span>
        {{ trend === 'up' ? '↑' : '↓' }}
      </p>
    </div>
  </div>
</template>