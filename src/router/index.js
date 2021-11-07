import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout/index.vue'
// import Search from '@/views/Search/index.vue'
// import Chat from '@/views/Chat/index.vue'
// import UserEdit from '@/views/Layout/User/UserEdit.vue'
// import ArticleDetail from '@/views/ArticleDetail/index.vue'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import Home from '@/views/Layout/Home/index.vue'
// import User from '@/views/Layout/User/index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login')
    // 定义路由独享守卫
    // beforeEnter: (to, from, next) => {
    //   // ...
    //   if (store.state.token.length > 0) {
    //     // vuex里有token(代表登录过 但是一定要注意过期和主动退出要先清除vuex和本地token 让其跳转登录页)
    //     return next(false)
    //   } else {
    //     next()
    //   }
    // }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/Layout/index.vue'),
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Layout/Home/index.vue')
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "user" */ '@/views/Layout/User/index.vue')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search/index.vue')
  },
  // 动态路由传递
  {
    path: '/search/:keywords',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search/SearchResult.vue')
  },
  {
    path: '/article/:aid',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/ArticleDetail/index.vue')
  },
  {
    path: '/user/edit',
    component: () => import(/* webpackChunkName: "userEdit" */ '@/views/Layout/User/UserEdit.vue')
  },
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "chat" */ '@/views/Chat/index.vue')
  }
]

const router = new VueRouter({
  routes
})

// 路由全局守卫
// 登录成功后 不允许切换路径到登录页面
router.beforeEach((to, from, next) => {
  if (store.state.token.length > 0 && to.path === 'login') {
    next(false) // 阻止跳转
  } else {
    next()
  }
})
export default router
