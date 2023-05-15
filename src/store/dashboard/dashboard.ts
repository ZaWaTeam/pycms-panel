import { Module } from 'vuex';
import axiosIns from '@/plugins/axios';

// @ts-ignore
const DashStore = {
  state: {
    memoryUsed: 0,
    memoryTotal: 0,
    cpuUsage: 0,
  },
  mutations: {
    setMemoryUsed(state, memoryUsed) {
      state.memoryUsed = memoryUsed;
    },
    setMemoryTotal(state, memoryTotal) {
      state.memoryTotal = memoryTotal;
    },
    setCpuUsage(state, cpuUsage) {
      state.cpuUsage = cpuUsage;
    },
  },
  actions: {
    async fetchSystemInfo({ commit }) {
      try {
        const response = await axiosIns.get('api/admin/sysinfo');
        const { used, total } = response.data.memory;
        const cpuUsage = response.data.cpu;
        commit('setMemoryUsed', used);
        commit('setMemoryTotal', total);
        commit('setCpuUsage', cpuUsage);
      } catch (error) {
        console.error(error);
      }
    },
  },
};

export default DashStore;
