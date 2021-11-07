import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios'
import './vant'
// 导入
import hljs from 'highlight.js' // hljs对象
import 'highlight.js/styles/default.css' // 代码高亮的样式
import 'amfe-flexible'
// 按需导入navbar  vant
// 导入自定义指令

import '@/utils/directives.js'
// import {
//   Cell,
//   ActionSheet,
//   PullRefresh,
//   NavBar,
//   Form,
//   Field,
//   Button,
//   // Notify,
//   Tabbar,
//   TabbarItem,
//   Icon,
//   Tab,
//   Tabs,
//   List,
//   Popup,
//   Col,
//   Row,
//   Badge,
//   Search,
//   Divider,
//   Tag,
//   CellGroup,
//   Image as VanImage,
//   Dialog,
//   DatetimePicker,
//   Loading
// } from 'vant'
// Vue.use(Loading)
// Vue.use(DatetimePicker)
// Vue.use(Dialog)
// Vue.use(VanImage)
// Vue.use(Tag)
// Vue.use(CellGroup)
// Vue.use(Search)
// Vue.use(Badge)
// Vue.use(Col)
// Vue.use(Row)
// Vue.use(NavBar)
// Vue.use(Popup)
// Vue.use(ActionSheet)
// Vue.use(PullRefresh)
// Vue.use(List)
// Vue.use(Cell)
// Vue.use(Form)
// Vue.use(Field)
// Vue.use(Button)
// Vue.use(Tabbar)
// Vue.use(TabbarItem)
// Vue.use(Icon)
// Vue.use(Tab)
// Vue.use(Tabs)
// Vue.use(Divider)
Vue.directive('highlight', function(el) {
  // 自定义一个代码高亮指令
  const highlight = el.querySelectorAll('pre, code') // 获取里面所有pre或者code标签
  highlight.forEach(block => {
    hljs.highlightElement(block) // 突出显示这些标签(以及内部代码, 会自动识别语言)
  })
})
if (process.env.NODE_ENV !== 'development') {
  // process是Node环境全部变量, 运行时根据敲击的命令不同, 脚手架会取环境变量给env添加属性和值
  console.log = function() {}
  console.error = function() {}
  console.dir = function() {}
}
// 全局注册
// Vue.use(Notify)
// import { allChannelListAPI } from '@/api/channels.js'
// async function myFn() {
//   try {
//     const res = await allChannelListAPI()
//     console.log(res) // 后台返回的频道数据
//   } catch (err) {
//     console.error(err)
//   }
// }
// myFn()
// Vue.use(diretivesObj)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// console.dir(Vue)
// 代理转发
// async function fn() {
//   const res = await axios({
//     url: '/api/nc/article/headline/T1348647853363/0-40.html'
//   })
//   alert(res)
// }
// fn()
