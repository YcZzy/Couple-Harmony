import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import ArgumentLog from '../views/ArgumentLog.vue';
import Calendar from '../views/Calendar.vue';
import Rewards from '../views/Rewards.vue';
import RewardRecords from '../views/RewardRecords.vue';
import Analytics from '../views/Analytics.vue';
import ArgumentDetail from '../views/ArgumentDetail.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: '仪表盘',
      component: Dashboard
    },
    {
      path: '/arguments',
      name: '争吵记录',
      component: ArgumentLog
    },
    {
      path: '/arguments/:id',
      name: '争吵详情',
      component: ArgumentDetail
    },
    {
      path: '/calendar',
      name: '日历',
      component: Calendar
    },
    {
      path: '/rewards',
      name: '奖励',
      component: Rewards
    },
    {
      path: '/reward-records',
      name: '奖励记录',
      component: RewardRecords
    },
    {
      path: '/analytics',
      name: '分析',
      component: Analytics
    }
  ]
});

export default router;