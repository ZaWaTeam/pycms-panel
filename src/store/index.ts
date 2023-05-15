import { createStore } from 'vuex'
import { authStore } from './auth'
import { postStore } from './posts/post'
import DashStore from "@/store/dashboard/dashboard";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth: authStore,
    dashboard:DashStore,
    posts: postStore
  }
})
