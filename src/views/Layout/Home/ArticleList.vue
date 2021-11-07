<template>
  <div>
    <!-- 文章列表 -->
    <!-- {{ channelId }} -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 上滑加载 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        :offset="50"
        @load="getArticleList"
      >
        <article-item
          v-for="item in articleList"
          :key="item.art_id"
          :obj="item"
          v-highlight
          @del-art="delArtFn"
          @click.native="$router.push(`/article/${item.art_id}`)"
        >
        </article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from './components/Articleitem'
// import ArticleItem from '@/components/Articleitem.vue'
import { getArticleListAPi } from '@/api/home.js'
export default {
  props: {
    cid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      articleList: [],
      // List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
      loading: false,
      finished: false,
      nextTime: null, // 用于加载更多(分页)
      isLoading: false // 顶部刷新的状态
    }
  },
  methods: {
    async getArticleList() {
      // 文章列表数据
      const res = await getArticleListAPi({
        channelId: this.cid,
        timestamp: this.nextTime
      })
      if (res.data.data.results.length === 0) {
        this.finished = true
      } else {
        this.nextTime = res.data.data.pre_timestamp
        this.articleList = [...this.articleList, ...res.data.data.results]
      }
      this.loading = false
      // console.log(this.articleList)
    },
    // 顶部刷新事件方法
    async onRefresh() {
      // 文章列表数据
      const res = await getArticleListAPi({
        channelId: this.cid,
        timestamp: this.nextTime
      })
      if (res.data.data.results.length === 0) {
        this.finished = true
      } else {
        this.nextTime = res.data.data.pre_timestamp
        this.articleList = [...res.data.data.results, ...this.articleList]
      }
      this.loading = false
      // if(results.length<10||res.data.data.pre_timestamp===null||result.length===0){

      // }
      console.log(this.articleList)
      this.isLoading = false // 顶部加载状态关闭
    },
    delArtFn(obj) {
      const index = this.articleList.findIndex(item => item.art_id === obj.art_id)
      index !== -1 && this.articleList.splice(index, 1)
    }
  },
  // props: ['channelId'],
  components: {
    ArticleItem
  },
  async created() {
    this.getArticleList()
    // const res = await getArticleListAPi({
    //   channelId: this.cid
    // })
    // // console.log(res)
    // this.articleList = res.data.data.results
    // this.nextTime = res.data.data.pre_timestamp
    // // console.log(res.data.data.results)
  }
}
</script>
<style lang="less" scoped></style>
