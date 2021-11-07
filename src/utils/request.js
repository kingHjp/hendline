import store from '@/store/index.js'
// import router from '@/router/index.js'
import { refreshTokenAPI } from '@/api/login.js'
import router from '@/router/index.js'
import request from '@/utils/request.js'
// 这里是对axios二次封装的
import ajax from 'axios'
// 新建一个新的axios实例
const axios = ajax.create({
  baseURL: 'http://toutiao.itheima.net'
})
export default ({ url, method = 'GET', params, data, headers, isAuth = true }) => {
  return axios({
    url: url,
    method: method,
    params: params,
    data: data,
    headers: headers,
    isAuth
  })
}
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // if (store.state.token.length > 0 && config.headers.Authorization === undefined) {
    //   config.headers.Authorization = `Bearer ${store.state.token}`
    // }
    // return config
    if (store.state.token.length > 0 && config.headers.Authorization === undefined && config.isAuth) {
      config.headers.Authorization = `Bearer ${store.state.token}`
    }
    return config
  },
  error => {
    return Promise.error(error)
  }
)
// 响应拦截器
axios.interceptors.response.use(
  resp => {
    // 成功  http 状态码 以 2/3 开头
    // 每次服务器数据达到浏览器之前，必须经过这里
    // 公共处理
    // return resp.data
    return resp
  },
  async err => {
    // 失败/错误  http 状态码 以 4/5 开头
    // err是错误对象 它的response字段记录了错误信息  status  statusText
    if (err.response.status === 401) {
      // 身份过期/token无效
      // 1. 清空token （vuex + 本地）
      // store.commit('setToken', '')
      // store.commit('setRefreshToken', '')
      // localStorage.removeItem('token')
      // localStorage.removeItem('refresh_token')
      // 重新设置新的token
      const res = await refreshTokenAPI()
      store.commit('setToken', res.data.data.token)
      err.config.headers.Authorization = 'Bearer ' + res.data.data.token
      // return到await的地方
      err.config.headers.Authorization = `Bearer ${res.data.data.token}` // 刷新正确的token携带
      return request(err.config) // return到上一次发起请求的位置
      // console.dir(err)
    } else if (err.response.status === 500) {
      // 你刷新token也不行了, 有可能你没登录/refresh_token过期了
      // 既然token和refresh_token都过期了, 清空
      // 去登录页, 但是本地还有token, 路由全局前置守卫拦住你
      store.commit('setToken', '')
      store.commit('setRefreshToken', '')
      store.commit('setUser', '')
      localStorage.clear()
      // this是vue实例, 实例上才有$route, 而这是js文件, 不能写this.$route
      router.push(`/login?path=${router.currentRoute.path}`)
    }
    return Promise.reject(err)
    // 2. 跳转到登录页面登录
    // router.push({
    //   path: '/login'
    // })
  }
)
