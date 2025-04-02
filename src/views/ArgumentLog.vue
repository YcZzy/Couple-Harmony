<script setup lang="ts">
import { computed } from 'vue';
import { useArgumentStore } from '../stores/argument';

const store = useArgumentStore();

const sortedArguments = computed(() => {
  return [...store.argumentList].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-900">争吵记录</h1>

    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="argument in sortedArguments" :key="argument.id" class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">
                {{ store.categories.find(c => c.id === argument.category)?.name }}
              </p>
              <p class="text-sm text-gray-500">
                {{ new Date(argument.date).toLocaleDateString() }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                argument.severity === 1 ? 'bg-yellow-100 text-yellow-800' :
                argument.severity === 2 ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              ]">
                严重程度 {{ argument.severity }}
              </span>
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                argument.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              ]">
                {{ argument.status === 'resolved' ? '已解决' : '进行中' }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>