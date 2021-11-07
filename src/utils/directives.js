// 自动获取输入框标签的自定义属性
// import { Input } from 'postcss'
import Vue from 'vue'
// 插件对象(必须有install方法, 才可以注入到Vue.use中)

Vue.directive('fofo', {
  inserted(el) {
    fo(el)
  },
  update(el) {
    fo(el)
  }
})

function fo(el) {
  // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
  if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
    el.focus()
  } else {
    el.querySelector('input').focus()
  }
}
