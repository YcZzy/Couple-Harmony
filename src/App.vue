<script setup lang="ts">
import { onMounted } from 'vue';
import { useArgumentStore } from './stores/argument';
import NavigationBar from './components/NavigationBar.vue';

const argumentStore = useArgumentStore();

onMounted(() => {
  argumentStore.initializeStore();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavigationBar />
    <main class="container mx-auto px-4 py-6">
      <router-view></router-view>
    </main>
  </div>
</template>