<script setup lang="ts">
import { computed } from 'vue';
import { useArgumentStore } from '../stores/argument';
import { Bar, Line, Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const store = useArgumentStore();

const categoryData = computed(() => ({
  labels: store.categoryStats.map(stat => stat.name),
  datasets: [{
    label: '按分类统计的争吵',
    data: store.categoryStats.map(stat => stat.count),
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
    ]
  }]
}));

const severityData = computed(() => {
  const severityCounts = (store.argumentList ?? []).reduce((acc, arg) => {
    acc[arg.severity] = (acc[arg.severity] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return {
    labels: ['轻微', '中等', '严重'],
    datasets: [{
      label: '按严重程度统计的争吵',
      data: [
        severityCounts[1] || 0,
        severityCounts[2] || 0,
        severityCounts[3] || 0
      ],
      backgroundColor: [
        'rgba(255, 206, 86, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(255, 99, 132, 0.5)'
      ]
    }]
  };
});

const trendData = computed(() => {
  const monthlyData = (store.argumentList ?? []).reduce((acc, arg) => {
    const month = new Date(arg.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(monthlyData),
    datasets: [{
      label: '月度趋势',
      data: Object.values(monthlyData),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
});
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-gray-900">数据分析</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">分类分布</h2>
        <Pie :data="categoryData" :options="{ responsive: true }" />
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">严重程度分布</h2>
        <Bar :data="severityData" :options="{ responsive: true }" />
      </div>

      <div class="bg-white p-6 rounded-lg shadow lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4">月度趋势</h2>
        <Line :data="trendData" :options="{ responsive: true }" />
      </div>
    </div>
  </div>
</template>