import Vue from 'vue'
import Vuex from 'vuex'
import { loginAPI } from '@/api/login.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    refresh_token: localStorage.getItem('token') || ''
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    setRefreshToken(state, refresh_token) {
      state.refresh_token = refresh_token
      localStorage.setItem('refresh_token', refresh_token)
    }
  },
  actions: {
    async asyncLoginAction(store, val) {
      try {
        const res = await loginAPI(val)
        const { token, refresh_token } = res.data.data
        store.commit('setToken', token)
        store.commit('setRefreshToken', refresh_token)
        // return Promise.resolve(res) // 返回成功的Promise对象
      } catch (error) {
        // return Promise.reject(error) // 返回失败的Promise对象
      }
    }
  },
  modules: {}
})
