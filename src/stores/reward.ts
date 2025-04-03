import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Reward } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface RewardRecord {
  id: string;
  rewardId: string;
  rewardName: string;
  type: 'reward' | 'punishment';
  date: string;
}

export const useRewardStore = defineStore('reward', () => {
  const rewardList = ref<Reward[]>([
    {
      id: '1',
      name: '约会',
      description: '晚餐',
      type: 'reward'
    },
    {
      id: '2',
      name: '马杀鸡',
      description: '30 分钟按摩',
      type: 'reward'
    },
    {
      id: '3',
      name: '家务',
      description: '收拾家务',
      type: 'punishment'
    }
  ]);
  
  const rewardRecords = ref<RewardRecord[]>([]);

  // Load from localStorage
  const initializeStore = () => {
    const savedRewards = localStorage.getItem('rewards');
    const savedRewardRecords = localStorage.getItem('rewardRecords');
    
    if (savedRewards) {
      rewardList.value = JSON.parse(savedRewards);
    } else {
      // If no rewards exist in localStorage, save the default ones
      saveToStorage();
    }
    
    if (savedRewardRecords) {
      rewardRecords.value = JSON.parse(savedRewardRecords);
    }
  };

  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem('rewards', JSON.stringify(rewardList.value));
    localStorage.setItem('rewardRecords', JSON.stringify(rewardRecords.value));
  };

  const addReward = (reward: Omit<Reward, 'id'>) => {
    const newReward = {
      ...reward,
      id: uuidv4()
    };
    rewardList.value.push(newReward);
    saveToStorage();
    return newReward;
  };

  const updateReward = (id: string, updates: Partial<Reward>) => {
    const index = rewardList.value.findIndex(r => r.id === id);
    if (index !== -1) {
      rewardList.value[index] = { ...rewardList.value[index], ...updates };
      saveToStorage();
    }
  };

  const deleteReward = (id: string) => {
    const index = rewardList.value.findIndex(r => r.id === id);
    if (index !== -1) {
      rewardList.value.splice(index, 1);
      saveToStorage();
    }
  };

  const addRewardRecord = (rewardId: string) => {
    const reward = rewardList.value.find(r => r.id === rewardId);
    if (reward) {
      const record: RewardRecord = {
        id: uuidv4(),
        rewardId: reward.id,
        rewardName: reward.name,
        type: reward.type,
        date: new Date().toISOString()
      };
      rewardRecords.value.push(record);
      saveToStorage();
      return record;
    }
    return null;
  };

  return {
    rewardList,
    rewardRecords,
    initializeStore,
    addReward,
    updateReward,
    deleteReward,
    addRewardRecord
  };
}); 
