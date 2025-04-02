import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Argument, Category } from '../types';

export const useArgumentStore = defineStore('argument', () => {
  const argumentList = ref<Argument[]>([]);
  const categories = ref<Category[]>([
    { id: 'housework', name: '家务分工', color: '#4F46E5' },
    { id: 'finance', name: '金钱支出', color: '#059669' },
    { id: 'habits', name: '个人习惯', color: '#B45309' },
    { id: 'entertainment', name: '娱乐选择', color: '#7C3AED' },
    { id: 'communication', name: '沟通问题', color: '#DC2626' },
    { id: 'emergency', name: '突发事件', color: '#DB2777' }
  ]);

  // Load from localStorage
  const initializeStore = () => {
    const savedArguments = localStorage.getItem('arguments');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedArguments) {
      argumentList.value = JSON.parse(savedArguments);
    }
    
    if (savedCategories) {
      categories.value = JSON.parse(savedCategories);
    } else {
      // If no categories exist in localStorage, save the default ones
      saveToStorage();
    }
  };

  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem('arguments', JSON.stringify(argumentList.value));
    localStorage.setItem('categories', JSON.stringify(categories.value));
  };

  const addArgument = (argument: Argument) => {
    argumentList.value.push(argument);
    saveToStorage();
  };

  const updateArgument = (id: string, updates: Partial<Argument>) => {
    const index = argumentList.value.findIndex(arg => arg.id === id);
    if (index !== -1) {
      argumentList.value[index] = { ...argumentList.value[index], ...updates };
      saveToStorage();
    }
  };

  const addCategory = (category: Category) => {
    categories.value.push(category);
    saveToStorage();
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const index = categories.value.findIndex(cat => cat.id === id);
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates };
      saveToStorage();
    }
  };

  const deleteCategory = (id: string) => {
    const index = categories.value.findIndex(cat => cat.id === id);
    if (index !== -1) {
      categories.value.splice(index, 1);
      saveToStorage();
    }
  };

  // Statistics
  const resolutionRate = computed(() => {
    const resolved = argumentList.value.filter(arg => arg.status === 'resolved').length;
    return argumentList.value.length ? (resolved / argumentList.value.length) * 100 : 0;
  });

  const categoryStats = computed(() => {
    return categories.value.map(category => ({
      name: category.name,
      count: argumentList.value.filter(arg => arg.category === category.id).length
    }));
  });

  return {
    argumentList,
    categories,
    initializeStore,
    addArgument,
    updateArgument,
    addCategory,
    updateCategory,
    deleteCategory,
    resolutionRate,
    categoryStats
  };
});