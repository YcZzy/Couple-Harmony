<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArgumentStore } from '../stores/argument';
import dayjs from 'dayjs';
import type { Argument } from '../types';

interface Comment {
  id: string;
  content: string;
  date: string;
}

// 扩展Argument类型以包含comments和solution字段
interface ExtendedArgument extends Argument {
  comments?: Comment[];
  solution?: string;
}

const route = useRoute();
const router = useRouter();
const store = useArgumentStore();

const argument = ref<ExtendedArgument | null>(null);
const newComment = ref('');
const solution = ref('');

onMounted(() => {
  const id = route.params.id as string;
  const foundArgument = store.argumentList.find(arg => arg.id === id);
  if (foundArgument) {
    // 将找到的参数转换为ExtendedArgument类型
    argument.value = foundArgument as ExtendedArgument;
  } else {
    router.push('/arguments');
  }
});

const updateStatus = (status: 'ongoing' | 'resolved') => {
  if (argument.value) {
    store.updateArgument(argument.value.id, { status });
    argument.value.status = status;
  }
};

const addComment = () => {
  if (argument.value && newComment.value.trim()) {
    const comments = argument.value.comments || [];
    comments.push({
      id: Date.now().toString(),
      content: newComment.value,
      date: new Date().toISOString()
    });
    
    // 使用类型断言来处理comments字段
    store.updateArgument(argument.value.id, { 
      ...argument.value,
      comments 
    } as Partial<Argument>);
    
    argument.value.comments = comments;
    newComment.value = '';
  }
};

const saveSolution = () => {
  if (argument.value && solution.value.trim()) {
    // 使用类型断言处理solution字段
    store.updateArgument(argument.value.id, { 
      status: 'resolved',
      resolution: solution.value // 使用resolution而不是solution
    });
    
    argument.value.solution = solution.value;
    argument.value.status = 'resolved';
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">吵架详情</h1>
      <button
        @click="router.push('/arguments')"
        class="text-gray-600 hover:text-gray-900"
      >
        返回列表
      </button>
    </div>

    <div v-if="argument" class="space-y-6">
      <!-- 基本信息 -->
      <div class="bg-white rounded-lg shadow p-6 space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ store.categories.find(c => c.id === argument?.category)?.name }}
            </h2>
            <p class="text-sm text-gray-500">
              {{ dayjs(argument.date).format('YYYY-MM-DD HH:mm') }}
            </p>
          </div>
          <span :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            argument.status === 'ongoing' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          ]">
            {{ argument.status === 'ongoing' ? '进行中' : '已解决' }}
          </span>
        </div>

        <div class="flex items-center space-x-4">
          <div>
            <span class="text-sm text-gray-500">严重程度：</span>
            <span class="font-medium">{{ argument.severity }}</span>
          </div>
          <div>
            <span class="text-sm text-gray-500">状态：</span>
            <select
              v-model="argument.status"
              @change="updateStatus(argument.status)"
              class="ml-2 rounded-md border-gray-300 shadow-sm"
            >
              <option value="ongoing">进行中</option>
              <option value="resolved">已解决</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 描述 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">描述</h3>
        <p class="text-gray-600">{{ argument.reflection || '暂无描述' }}</p>
      </div>

      <!-- 解决方案 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">解决方案</h3>
        <div v-if="argument.solution" class="text-gray-600 mb-4">
          {{ argument.solution }}
        </div>
        <div v-else class="space-y-4">
          <textarea
            v-model="solution"
            rows="3"
            class="w-full rounded-md border-gray-300 shadow-sm"
            placeholder="输入解决方案..."
          ></textarea>
          <button
            @click="saveSolution"
            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            保存解决方案
          </button>
        </div>
      </div>

      <!-- 评论 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">评论</h3>
        <div class="space-y-4">
          <div v-if="argument.comments?.length" class="space-y-4">
            <div v-for="comment in argument.comments" :key="comment.id" class="border-b pb-4">
              <p class="text-gray-600">{{ comment.content }}</p>
              <p class="text-sm text-gray-500 mt-1">
                {{ dayjs(comment.date).format('YYYY-MM-DD HH:mm') }}
              </p>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-4">
            暂无评论
          </div>
          <div class="flex space-x-4">
            <textarea
              v-model="newComment"
              rows="2"
              class="flex-1 rounded-md border-gray-300 shadow-sm"
              placeholder="添加评论..."
            ></textarea>
            <button
              @click="addComment"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 self-end"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>