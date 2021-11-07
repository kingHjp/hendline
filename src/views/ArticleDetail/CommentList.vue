<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list">
      <!-- 评论的 Item 项 -->
      <div class="cmt-item" v-for="(obj, index) in arr" :key="index">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="obj.aut_photo" alt="" class="avatar" />
            <span class="uname">{{ obj.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon name="like" size="16" color="red" @click="loveFn(true, obj)" v-if="obj.is_liking === true" />
            <van-icon name="like-o" size="16" color="gray" @click="loveFn(false, obj)" v-else />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">
          {{ obj.content }}
        </div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">
          {{ obj.pubdate }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commentLikeAPI, commentUnLikeAPI } from '@/api/comment.js'
export default {
  props: {
    arr: {
      type: Array,
      default: () => {}
    }
  },
  methods: {
    // 文章详情评论点赞 与取消点赞
    loveFn(bool, obj) {
      // // 红心点亮
      if (bool === true) {
        // 要取消红心
        obj.is_liking = false
        commentUnLikeAPI({
          comId: obj.com_id
        })
      } else {
        obj.is_liking = true
        commentLikeAPI({
          comId: obj.com_id
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
</style>
