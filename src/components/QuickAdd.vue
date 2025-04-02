<script setup lang="ts">
import { ref } from 'vue';
import { useArgumentStore } from '../stores/argument';

const store = useArgumentStore();
const category = ref('');
const severity = ref<1 | 2 | 3>(1);
const description = ref('');

const addNewArgument = () => {
  store.addArgument({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    category: category.value,
    severity: severity.value,
    status: 'ongoing'
  });
  
  // Reset form
  category.value = '';
  severity.value = 1;
  description.value = '';
};
</script>

<template>
  <form @submit.prevent="addNewArgument" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">分类</label>
      <select v-model="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">严重程度</label>
      <div class="mt-1 flex space-x-4">
        <label v-for="level in [1, 2, 3]" :key="level" class="flex items-center">
          <input type="radio" v-model="severity" :value="level" class="mr-2">
          <span>{{ level }}</span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">描述</label>
      <textarea
        v-model="description"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      ></textarea>
    </div>

    <button
      type="submit"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
    >
      记录争吵
    </button>
  </form>
</template>