<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArgumentStore } from '../stores/argument';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import type { Argument } from '../types';

const store = useArgumentStore();
const router = useRouter();
const currentDate = ref(dayjs());
const selectedDay = ref<{
  date: dayjs.Dayjs;
  isCurrentMonth: boolean;
  arguments: Argument[];
} | null>(null);
const showDetailsModal = ref(false);

const weeks = computed(() => {
  const start = currentDate.value.startOf('month').startOf('week');
  const end = currentDate.value.endOf('month').endOf('week');
  const days: {
    date: dayjs.Dayjs;
    isCurrentMonth: boolean;
    arguments: Argument[];
  }[] = [];
  let day = start;

  while (day.isBefore(end)) {
    days.push({
      date: day,
      isCurrentMonth: day.month() === currentDate.value.month(),
      arguments: (store.argumentList ?? []).filter(arg => 
        dayjs(arg.date).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
      )
    });
    day = day.add(1, 'day');
  }

  return Array.from({ length: Math.ceil(days.length / 7) }, (_, i) =>
    days.slice(i * 7, (i + 1) * 7)
  );
});

const previousMonth = () => {
  currentDate.value = currentDate.value.subtract(1, 'month');
};

const nextMonth = () => {
  currentDate.value = currentDate.value.add(1, 'month');
};

const showDayDetails = (day: {
  date: dayjs.Dayjs;
  isCurrentMonth: boolean;
  arguments: Argument[];
}) => {
  selectedDay.value = day;
  showDetailsModal.value = true;
};

const getDayStyle = (day: {
  date: dayjs.Dayjs;
  isCurrentMonth: boolean;
  arguments: Argument[];
}) => {
  if (!day.arguments.length) return '';
  
  const hasUnresolved = day.arguments.some((arg: Argument) => arg.status === 'ongoing');
  const allResolved = day.arguments.every((arg: Argument) => arg.status === 'resolved');
  
  if (hasUnresolved) return 'bg-red-50';
  if (allResolved) return 'bg-green-50';
  return '';
};

const viewArgumentDetails = (argumentId: string) => {
  router.push(`/arguments/${argumentId}`);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">日历</h1>
      <div class="flex space-x-4 items-center">
        <button @click="previousMonth" class="p-2 rounded hover:bg-gray-100">
          <span class="sr-only">上个月</span>
          ←
        </button>
        <h2 class="text-xl font-semibold">
          {{ currentDate.format('MMMM YYYY') }}
        </h2>
        <button @click="nextMonth" class="p-2 rounded hover:bg-gray-100">
          <span class="sr-only">下个月</span>
          →
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="grid grid-cols-7 gap-px border-b bg-gray-100">
        <div v-for="day in ['周日', '周一', '周二', '周三', '周四', '周五', '周六']" 
             :key="day"
             class="py-2 text-center text-sm font-semibold text-gray-700">
          {{ day }}
        </div>
      </div>

      <div class="grid grid-rows-6 gap-px bg-gray-200">
        <div v-for="week in weeks" :key="week[0].date.toString()" class="grid grid-cols-7 gap-px">
          <div v-for="day in week" 
               :key="day.date.toString()"
               @click="showDayDetails(day)"
               :class="[
                 'min-h-32 p-2 relative bg-white transition-colors cursor-pointer hover:bg-gray-50',
                 !day.isCurrentMonth && 'bg-gray-50 text-gray-400',
                 day.date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') && 'ring-2 ring-blue-500',
                 getDayStyle(day)
               ]">
            <span :class="[
              'absolute top-1 left-1 text-sm font-medium',
              !day.isCurrentMonth && 'text-gray-400'
            ]">
              {{ day.date.format('D') }}
            </span>
            <div class="mt-6 space-y-1">
              <div v-for="arg in day.arguments.slice(0, 2)" 
                   :key="arg.id"
                   :class="[
                     'text-xs px-2 py-1 rounded-full',
                     arg.status === 'ongoing' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                   ]">
                {{ store.categories.find(c => c.id === arg.category)?.name }}
              </div>
              <div v-if="day.arguments.length > 2" 
                   class="text-xs text-gray-500 text-center">
                还有 {{ day.arguments.length - 2 }} 项
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day Details Modal -->
    <div v-if="showDetailsModal && selectedDay" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
         @click.self="showDetailsModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            {{ selectedDay.date.format('MMMM D, YYYY') }}
          </h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div class="space-y-3">
          <div v-if="selectedDay.arguments.length === 0" class="text-gray-500 text-center py-4">
            当天没有记录的争吵
          </div>
          <div v-for="arg in selectedDay.arguments" 
               :key="arg.id" 
               class="bg-gray-50 rounded-lg p-4 space-y-2">
            <div class="flex justify-between items-start">
              <div>
                <span class="font-medium text-gray-900">
                  {{ store.categories.find(c => c.id === arg.category)?.name }}
                </span>
                <p class="text-sm text-gray-500">
                  {{ dayjs(arg.date).format('h:mm A') }}
                </p>
              </div>
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                arg.status === 'ongoing' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              ]">
                {{ arg.status === 'ongoing' ? '进行中' : '已解决' }}
              </span>
            </div>
            <button
              @click="viewArgumentDetails(arg.id)"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              查看详情 →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>