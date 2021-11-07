<template>
  <!-- @click="$emit('click')" -->
  <div class="article-item__container">
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ articleObj.title }}</span>
          <!-- 单图 -->
          <img v-if="articleObj.cover.type === 1" class="thumb" :src="articleObj.cover.images[0]" />
        </div>

        <!-- 三图 -->
        <div class="thumb-box" v-if="articleObj.cover.type > 1">
          <img class="thumb" v-for="(imgUrl, index) in articleObj.cover.images" :key="index" :src="imgUrl" />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>作者 {{ articleObj.aut_name }}</span>
            <span>{{ articleObj.comm_count }} 评论</span>
            <span>发布日期 {{ articleObj.pubdate }}</span>
          </div>
          <!-- 反馈按钮 x 按钮 -->
          <van-icon v-if="isShowX" name="cross" @click="show1 = true" />
        </div>
      </template>
    </van-cell>
    <!-- 一级反馈面板 -->
    <van-action-sheet
      cancel-text="取消"
      v-model="show1"
      :actions="actions1"
      @select="onSelectFn"
      get-container="body"
    />
    <!-- 二级反馈面板 -->
    <van-action-sheet
      cancel-text="返回"
      v-model="show2"
      :actions="actions2"
      @select="onSelectFn"
      @cancel="secondCancelFn"
      get-container="body"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { ACTION_SHEET_LEVEL1, ACTION_SHEET_LEVEL2 } from '@/constant'
import { articleDislikeAPI, articleReportsAPI } from '@/api/home'
import { Notify } from 'vant'
export default {
  name: 'ArticleItem',
  props: {
    // 父传子 的文章 对象
    articleObj: {
      type: Object,
      default() {
        return {}
      }
    },
    isShowX: {
      type: Boolean,
      default: true // 默认显示
    }
  },
  data() {
    return {
      show1: false, // 一级反馈面板的可见性
      show2: false, // 二级反馈面板的可见性
      actions1: ACTION_SHEET_LEVEL1, // 一别反馈面板的数据
      actions2: ACTION_SHEET_LEVEL2 // 二别反馈面板的数据
    }
  },
  created() {
    this.articleObj.pubdate = this.timeAgo(this.articleObj.pubdate)
  },
  methods: {
    // 格式化时间 - 在多久 之前
    timeAgo(dateStr) {
      moment.locale('zh-cn')
      const a = moment(dateStr)
      return a.from(new Date())
    },
    // 反馈面板选择时触发
    async onSelectFn(actionObj) {
      if (actionObj.id === 11) {
        // 不感兴趣
        try {
          // 1. 发请求
          await articleDislikeAPI({
            artId: this.articleObj.art_id
          })
          Notify({ type: 'success', message: '反馈成功' })
        } catch (e) {
          Notify({ type: 'warning', message: e.message || '反馈失败' })
        }
        // 2. 通知父组件，把当前文章对象 从数组中删掉
        this.$emit('del-art', this.articleObj)
      } else if (actionObj.id === 22) {
        // 单击了反馈垃圾内容 - 显示二级反馈面板
        this.show2 = true
        this.show1 = false
      } else {
        try {
          // 发请求
          await articleReportsAPI({
            artId: this.articleObj.art_id,
            type: String(actionObj.id),
            // axios内部如果看见了null，那么这个字段就不会携带给后台
            remark: actionObj.id === 0 ? actionObj.name : null
          })
          Notify({ type: 'success', message: '反馈成功' })
        } catch (e) {
          Notify({ type: 'warning', message: e.message || '反馈失败' })
        } finally {
          this.show1 = this.show2 = false
        }
      }
    },
    // 二级反馈的返回事件
    secondCancelFn() {
      this.show2 = false
      this.show1 = true
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
</style>
