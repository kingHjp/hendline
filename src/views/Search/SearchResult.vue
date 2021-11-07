<template>
  <div>
    <!-- 文章搜索结果页 -->
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
    </div>
    <!-- 列表 搜索结果 -->
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <article-item
          v-for="obj in articleList"
          :key="obj.art_id"
          :articleObj="obj"
          v-highlight
          @click.native="clickFn(obj.art_id)"
          :isShowX="false"
        ></article-item>
      </van-list>
    </div>
  </div>
</template>

<script>
// 搜索结果列表
import { searchListAPI } from '@/api/search.js'
// import ArticleItem from '@/views/Layout/Home/components/Articleitem.vue'
import ArticleItem from '@/components/Articleitem.vue'
export default {
  name: 'SearchResult',
  components: {
    ArticleItem
  },
  data() {
    return {
      articleList: [], // 文章数据
      loading: false, // 底部加载状态(加载中...)
      finished: false, // 底部是否加载完成(false还有数据, true全都加载完了显示一句话)
      page: 1 // 当前页码
    }
  },
  // methods: {}
  async created() {
    // const res = await searchListAPI({
    //   q: this.$route.params.keywords // 拿到关键词, keywords来源于router/index.js你定义的动态路由参数名
    // })
    // // console.log(res)
    // this.articleList = res.data.data.results
    this.getListFn()
  },
  methods: {
    onLoad() {
      this.page++
      this.getListFn()
    },
    async getListFn() {
      const res = await searchListAPI({
        q: this.$route.params.keywords, // 拿到关键词, keywords来源于router/index.js你定义的动态路由参数名
        page: this.page
      })
      // console.log(res)
      // this.articleList = res.data.data.results
      if (res.data.data.results.length === 0) {
        // 没有数据了
        this.finished = true // 加载完成
      }
      this.articleList = [...this.articleList, ...res.data.data.results]
      this.loading = false // 本次加载完成
    },
    // 点击文章
    clickFn(aid) {
      this.$router.push(`/article/${aid}`)
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
