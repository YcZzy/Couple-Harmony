<script setup lang="ts">
import { ref } from 'vue';
import { useArgumentStore } from '../stores/argument';

const store = useArgumentStore();
const showAddForm = ref(false);
const newCategory = ref({
  name: '',
  color: '#000000'
});

const addNewCategory = () => {
  if (newCategory.value.name.trim()) {
    store.addCategory({
      id: `custom-${Date.now()}`,
      name: newCategory.value.name,
      color: newCategory.value.color
    });
    newCategory.value = { name: '', color: '#000000' };
    showAddForm.value = false;
  }
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-900">分类</h2>
      <button
        @click="showAddForm = !showAddForm"
        class="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
      >
        添加分类
      </button>
    </div>

    <!-- Add Category Form -->
    <div v-if="showAddForm" class="bg-gray-50 p-4 rounded-md">
      <form @submit.prevent="addNewCategory" class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700">分类名称</label>
          <input
            v-model="newCategory.name"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">颜色</label>
          <input
            v-model="newCategory.color"
            type="color"
            class="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="showAddForm = false"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            添加
          </button>
        </div>
      </form>
    </div>

    <!-- Category List -->
    <div class="space-y-2">
      <div
        v-for="category in store.categories"
        :key="category.id"
        class="flex items-center justify-between p-2 bg-white rounded-md shadow-sm"
      >
        <div class="flex items-center space-x-2">
          <div
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: category.color }"
          ></div>
          <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
        </div>
        <button
          v-if="!['housework', 'finance', 'habits', 'entertainment', 'communication', 'emergency'].includes(category.id)"
          @click="store.deleteCategory(category.id)"
          class="text-sm text-red-600 hover:text-red-800"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>