<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useArgumentStore } from '../stores/argument';
import { useRewardStore } from '../stores/reward';
import type { Reward } from '../types';
import { v4 as uuidv4 } from 'uuid';

const argumentStore = useArgumentStore();
const rewardStore = useRewardStore();

// 初始化奖励存储
onMounted(() => {
  rewardStore.initializeStore();
});

const newReward = ref({
  name: '',
  description: '',
  type: 'reward' as 'reward' | 'punishment'
});

const selectedReward = ref<Reward | null>(null);
const showRewardModal = ref(false);
const showNewRewardForm = ref(false);
const showSpinningWheel = ref(false);
const spinningDegree = ref(0);
const spinningSpeed = ref(0);
const isSpinning = ref(false);
const spinMode = ref<'reward' | 'punishment' | 'both'>('both');

// 计算获取可用的奖励列表
const availableRewards = computed(() => {
  if (spinMode.value === 'both') {
    return rewardStore.rewardList;
  } else {
    return rewardStore.rewardList.filter(r => r.type === spinMode.value);
  }
});

// 添加新奖励
const addNewReward = () => {
  if (newReward.value.name.trim() === '') return;
  
  rewardStore.addReward({
    name: newReward.value.name,
    description: newReward.value.description,
    type: newReward.value.type
  });
  
  // 重置表单
  newReward.value = {
    name: '',
    description: '',
    type: 'reward' as 'reward' | 'punishment'
  };
  
  showNewRewardForm.value = false;
};

// 删除奖励
const deleteReward = (id: string) => {
  rewardStore.deleteReward(id);
};

// 开始抽奖
const startSpin = () => {
  if (isSpinning.value || availableRewards.value.length === 0) return;
  
  // 检查是否有可用的奖励或惩罚
  if (availableRewards.value.length === 0) {
    selectedReward.value = null;
    showRewardModal.value = true;
    return;
  }
  
  showSpinningWheel.value = true;
  isSpinning.value = true;
  
  // 随机初始速度
  spinningSpeed.value = 10 + Math.random() * 10;
  
  // 开始转动动画
  requestAnimationFrame(updateSpin);
};

// 更新转盘动画
const updateSpin = () => {
  if (!isSpinning.value) return;
  
  // 转动转盘
  spinningDegree.value = (spinningDegree.value + spinningSpeed.value) % 360;
  
  // 减速
  spinningSpeed.value *= 0.98;
  
  // 如果速度足够慢，停止转动
  if (spinningSpeed.value > 0.2) {
    requestAnimationFrame(updateSpin);
  } else {
    spinResult();
  }
};

// 抽奖结果
const spinResult = () => {
  isSpinning.value = false;
  
  if (availableRewards.value.length === 0) {
    selectedReward.value = null;
    showSpinningWheel.value = false;
    showRewardModal.value = true;
    return;
  }
  
  // 根据当前转盘位置确定结果
  const segmentSize = 360 / availableRewards.value.length;
  const normalizedDegree = (360 - (spinningDegree.value % 360)) % 360;
  const rewardIndex = Math.floor(normalizedDegree / segmentSize);
  
  selectedReward.value = availableRewards.value[rewardIndex];
  
  // 稍微延迟一下，让用户看到转盘最终位置
  setTimeout(() => {
    showSpinningWheel.value = false;
    showRewardModal.value = true;
  }, 1000);
};

// 保存奖励记录
const saveRewardRecord = () => {
  if (selectedReward.value) {
    rewardStore.addRewardRecord(selectedReward.value.id);
  }
  showRewardModal.value = false;
};

// 计算转盘分段样式
const getSegmentStyle = (index: number, total: number) => {
  if (total === 0) return {};
  
  const segmentSize = 360 / total;
  const startAngle = index * segmentSize;
  const endAngle = (index + 1) * segmentSize;
  
  // 使用更柔和的颜色
  const rewardColor = availableRewards.value[index].type === 'reward' 
    ? 'rgba(16, 185, 129, 0.7)' // 柔和的绿色
    : 'rgba(239, 68, 68, 0.7)'; // 柔和的红色
  
  return {
    background: `conic-gradient(
      transparent ${startAngle}deg, 
      ${rewardColor} ${startAngle}deg, 
      ${rewardColor} ${endAngle}deg, 
      transparent ${endAngle}deg
    )`
  };
};

// 获取文字颜色
const getTextColor = (type: 'reward' | 'punishment') => {
  return type === 'reward' ? '#065F46' : '#7F1D1D';
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">奖励 & 惩罚</h1>
      <div class="flex gap-2">
        <button
          @click="showNewRewardForm = true"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          添加奖惩
        </button>
        <div class="relative inline-block">
          <select 
            v-model="spinMode" 
            class="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 pr-8 rounded appearance-none"
          >
            <option value="both">全部</option>
            <option value="reward">仅奖励</option>
            <option value="punishment">仅惩罚</option>
          </select>
        </div>
        <button
          @click="startSpin"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          抽奖
        </button>
      </div>
    </div>

    <!-- 奖励列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="reward in rewardStore.rewardList" 
           :key="reward.id"
           :class="[
             'p-4 rounded-lg shadow relative',
             reward.type === 'reward' ? 'bg-green-50' : 'bg-red-50'
           ]">
        <button 
          @click="deleteReward(reward.id)" 
          class="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <h3 class="text-lg font-semibold mb-2">{{ reward.name }}</h3>
        <p class="text-sm text-gray-600">{{ reward.description }}</p>
        <span :class="[
          'mt-2 inline-block px-2 py-1 rounded text-sm',
          reward.type === 'reward' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]">
          {{ reward.type === 'reward' ? '奖励' : '惩罚' }}
        </span>
      </div>
    </div>

    <!-- 添加新奖励表单 -->
    <div v-if="showNewRewardForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">添加新奖惩</h2>
        <form @submit.prevent="addNewReward">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
            <input v-model="newReward.name" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea v-model="newReward.description" class="w-full p-2 border rounded" rows="3"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">类型</label>
            <select v-model="newReward.type" class="w-full p-2 border rounded">
              <option value="reward">奖励</option>
              <option value="punishment">惩罚</option>
            </select>
          </div>
          <div class="flex gap-2 justify-end">
            <button
              type="button"
              @click="showNewRewardForm = false"
              class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 转盘效果 -->
    <div v-if="showSpinningWheel" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div class="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        <h2 class="text-2xl font-bold mb-6">转盘抽奖</h2>
        <div v-if="availableRewards.length === 0" class="text-center mb-4">
          <p class="text-gray-600">没有可用的奖惩项目</p>
        </div>
        <div v-else class="wheel-container">
          <!-- 转盘底盘 -->
          <div 
            class="wheel"
            :style="`transform: rotate(${spinningDegree}deg); transition: transform ${isSpinning ? '0s' : '2s'} ease-out;`"
          >
            <!-- 转盘分段 -->
            <div 
              v-for="(reward, index) in availableRewards" 
              :key="reward.id"
              class="wheel-segment"
              :style="getSegmentStyle(index, availableRewards.length)"
            >
              <!-- 分割线 -->
              <div 
                class="segment-divider"
                :style="`transform: rotate(${360 / availableRewards.length * index}deg)`"
              ></div>
            </div>
            
            <!-- 文字标签 -->
            <div 
              v-for="(reward, index) in availableRewards"
              :key="`text-${reward.id}`"
              class="wheel-text"
              :style="`
                transform: rotate(${360 / availableRewards.length * index + 360 / availableRewards.length / 2}deg) 
                translateY(-${availableRewards.length > 6 ? '100' : '90'}px);
                color: ${getTextColor(reward.type)};
              `"
            >
              <div class="text-container">
                {{ reward.name }}
              </div>
            </div>
            
            <!-- 中心点 -->
            <div class="wheel-center">
              <div class="wheel-button"></div>
            </div>
          </div>

          <!-- 指针 -->
          <div class="wheel-pointer">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#0006" />
              </filter>
              <path d="M20 0 L35 30 L20 25 L5 30 Z" fill="#DC2626" filter="url(#shadow)" />
            </svg>
          </div>
        </div>
        <button 
          v-if="!isSpinning"
          @click="showSpinningWheel = false"
          class="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          取消
        </button>
      </div>
    </div>

    <!-- 奖励结果弹窗 -->
    <div v-if="showRewardModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">抽奖结果</h2>
        <div v-if="selectedReward" :class="[
          'p-4 rounded mb-4',
          selectedReward.type === 'reward' ? 'bg-green-50' : 'bg-red-50'
        ]">
          <h3 class="text-xl font-semibold">{{ selectedReward.name }}</h3>
          <p class="mt-2">{{ selectedReward.description }}</p>
          
          <!-- 动画效果 -->
          <div class="mt-4 p-2 rounded flex justify-center">
            <div v-if="selectedReward.type === 'reward'" class="animate-bounce">
              <span class="text-4xl">🎉</span>
            </div>
            <div v-else class="animate-pulse">
              <span class="text-4xl">😅</span>
            </div>
          </div>
        </div>
        <div v-else class="p-4 bg-yellow-50 rounded mb-4">
          <p>没有可用的奖惩项目，请先添加一些奖惩。</p>
        </div>
        <button
          @click="saveRewardRecord"
          class="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clip-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* 转盘样式 */
.wheel-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin-bottom: 2rem;
}

.wheel {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 6px solid #f3f4f6;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1), 0 0 0 6px #e5e7eb;
  overflow: hidden;
  background: #f9fafb;
  transform-origin: center;
  will-change: transform;
}

.wheel-segment {
  position: absolute;
  inset: 0;
}

.segment-divider {
  position: absolute;
  top: 0;
  left: 50%;
  height: 50%;
  width: 2px;
  background-color: rgba(255, 255, 255, 0.7);
  transform-origin: bottom center;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.wheel-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  text-align: center;
  font-weight: 600;
  font-size: 0.85rem;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
  width: 1px;
  height: 1px;
  z-index: 3;
}

.text-container {
  position: absolute;
  transform: translate(-50%, -50%) rotate(180deg);
  width: 70px;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wheel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background-color: #fff;
  border-radius: 50%;
  border: 4px solid #e5e7eb;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel-button {
  width: 30px;
  height: 30px;
  background: radial-gradient(circle at 30% 30%, #f9fafb, #d1d5db);
  border-radius: 50%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.wheel-pointer {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
}
</style>