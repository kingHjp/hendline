<template>
  <div>
    <!-- 文章详情页 -->
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ artObj.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="artObj.aut_name" :label="artObj.pubdate">
        <template #icon>
          <img :src="artObj.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button type="info" size="mini" @click="followedFn(true)" v-if="artObj.is_followed">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain @click="followedFn(false)" v-else>关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="artObj.content">好好学习, 天天向上</div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <!-- artObj.attitude 等于1的时候就是已经点赞了 -->
        <van-button icon="good-job" type="danger" size="small" v-if="artObj.attitude === 1" @click="attitudeFn(false)"
          >已点赞</van-button
        >
        <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="attitudeFn(true)"
          >点赞</van-button
        >
      </div>
      <!-- 文章评论列表---------------------------------------  -->
      <div>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" offset="50">
          <comment-list :arr="commentList"></comment-list>
        </van-list>
      </div>
      <!-- 文章底部评论容器------------------------------------------ -->
      <div :class="isShowCmtInput ? 'art-cmt-container-1' : 'art-cmt-container-2'">
        <!-- 底部添加评论区域 - 1 -->
        <div class="add-cmt-box van-hairline--top" v-if="isShowCmtInput">
          <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
          <div class="ipt-cmt-div" @click="isShowCmtInput = false">发表评论</div>
          <div class="icon-box">
            <van-badge :content="totalCount" max="99" color="#1989fa">
              <van-icon name="comment-o" size="0.53333334rem" @click="moveFn" />
            </van-badge>
            <van-icon name="star-o" size="0.53333334rem" />
            <van-icon name="share-o" size="0.53333334rem" />
          </div>
        </div>

        <!-- 底部添加评论区域 - 2 -->
        <div class="cmt-box van-hairline--top" v-else>
          <textarea placeholder="友善评论、理性发言、阳光心灵" v-fofo @blur="blurFn" v-model="commentText"></textarea>
          <van-button type="default" :disabled="commentText.length === 0" @click="sendFn" @keyup.enter="sendFn"
            >发布</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentList from '@/views/ArticleDetail/CommentList.vue'
import { commentListAPI, commentSendAPI } from '@/api/comment.js'
import {
  articleDetailAPI,
  authorFollowedAPI,
  authorUnFollowedAPI,
  articleLikeAPI,
  articleUnLikeAPI
} from '@/api/article.js'
export default {
  name: 'ArticleDetail',
  data() {
    return {
      artObj: {}, // 文章对象
      commentList: [], // 评论列表
      isShowCmtInput: true, // 评论区域的两套切换
      totalCount: 0, // 显示的评论总数量
      commentText: '', // 评论区域的双向数据绑定
      loading: false, // 底部加载状态
      finished: false, // 全部内容加载完毕
      lastId: null
    }
  },
  methods: {
    // 作者关注与取消关注
    followedFn(res) {
      if (res === true) {
        // res为true的时候表示已关注
        // 再次点击取关住
        this.artObj.is_followed = false
        authorUnFollowedAPI({
          aut_id: this.artObj.aut_id
        })
      } else {
        this.artObj.is_followed = true
        authorFollowedAPI({
          target: this.artObj.aut_id
        })
      }
    },
    // 文章的点赞与取消点赞
    attitudeFn(bool) {
      // bool为true的时候是点赞 attitude 1
      if (bool === true) {
        // 点击后取消点赞
        this.artObj.attitude = 1
        articleLikeAPI({ target: this.artObj.art_id })
      } else {
        this.artObj.attitude = -1
        articleUnLikeAPI({ aut_id: this.artObj.art_id })
      }
    },
    // 文章评论列表
    async getCommentListFn() {
      const res = await commentListAPI({
        source: this.$route.params.aid, // 路由的网络请求
        offset: this.lastId // 分页
      })
      if (res.data.data.results.length === 0) {
        this.finished = true
        return
      }
      // 下一次请求的时候使用lastId
      this.lastId = res.data.data.last_id
      // 对数组进行拼接
      this.commentList = [...this.commentList, ...res.data.data.results]
      // 评论的总数量
      this.totalCount = res.data.data.total_count || ''
      // console.log(res)
      // 加载完毕后吧loading设置为false 方便为下次加载做准备
      this.loading = false
    },
    // 底部上拉加载获取第二页数据
    onLoad() {
      this.getCommentListFn()
    },
    // 点击评论徽标 移动到评论区
    moveFn() {
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 失去焦点 显示另一个底部
    blurFn() {
      setTimeout(() => {
        this.isShowCmtInput = true
      })
    },
    // 点击后发布文章
    async sendFn() {
      // this.commentList.unshift(this.commentText)
      const res = await commentSendAPI({
        artId: this.artObj.art_id,
        sendText: this.commentText
      })
      // console.log(res)
      // 把新的列表添加进去
      this.commentList.unshift(res.data.data.new_obj)
      // 增加评论总数量
      this.totalCount++
      // 清空输入框的内容
      this.commentText = ''
    }
  },
  components: {
    CommentList
  },
  async created() {
    // 文章详情的请求
    const res = await articleDetailAPI({
      art_id: this.$route.params.aid
    })
    // console.log(res)
    this.artObj = res.data.data
    this.getCommentListFn()
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
