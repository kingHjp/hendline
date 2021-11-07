<template>
  <!-- 一条文章单元格 -->
  <div>
    <van-loading color="#1989fa" class="loading" v-if="obj.title === undefined">文章疯狂加载ing...</van-loading>
    <div v-else>
      <van-cell>
        <!-- 标题区域的插槽 -->
        <template #title>
          <div class="title-box">
            <!-- 标题 -->
            <span>{{ obj.title }}</span>
            <!-- 单图 -->
            <img class="thumb" v-if="obj.cover.type === 1" :src="obj.cover.images[0]" />
          </div>
          <!-- 三张图片 -->
          <div class="thumb-box" v-if="obj.cover.type >= 3">
            <img class="thumb" v-for="(item, index) in obj.cover.images" :key="index" :src="item" />
          </div>
        </template>
        <!-- label 区域的插槽 -->
        <template #label>
          <div class="label-box">
            <div>
              <span>作者{{ obj.aut_name }}</span>
              <span>{{ obj.comm_count }}评论</span>
              <span>{{ obj.pubdate }}</span>
            </div>
            <!-- 反馈按钮 -->
            <van-icon name="cross" @click.stop="show1 = true" />
          </div>
        </template>
      </van-cell>
      <van-action-sheet
        v-model="show1"
        :actions="actions1"
        cancel-text="取消"
        @select="onSelectFn"
        get-container="body"
      />
      <van-action-sheet
        v-model="show2"
        :actions="actions2"
        cancel-text="取消"
        @select="onSelectFn"
        get-container="body"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { ACTION_SHEET_LEVEL1, ACTION_SHEET_LEVEL2 } from '@/constant/index.js'
import { Toast } from 'vant'
import { articleDislikeAPI, articleReportsAPI } from '@/api/home.js'
export default {
  name: 'Articleitem',
  data() {
    return {
      show1: false, // 一级面板可见性
      show2: false, // 二级面板可见性
      actions1: ACTION_SHEET_LEVEL1, // 一 反馈面板
      actions2: ACTION_SHEET_LEVEL2 // 二反馈面板
    }
  },
  props: {
    // 父传子的文章对象
    obj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  created() {
    this.obj.pubdate = this.timeAgo(this.obj.pubdate)
  },
  methods: {
    // 格式化时间 在多久之前
    timeAgo(dateStr) {
      moment.locale('zh-cn')
      const a = moment(dateStr)
      return a.from(new Date())
    },
    // 反馈面板选择时触发
    async onSelectFn(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // Toast(item.name)
      if (item.id === 11) {
        // this.show = false
        try {
          await articleDislikeAPI({
            artId: this.obj.art_id
          })
          Toast.success('删除成功,病毒开始加载...')
          // console.log(this.obj.art_id)
        } catch (err) {
          Toast.fail(err.message || '反馈失败')
        }
        // 通知父组件把当前文章对象 从数组中删除
        this.$emit('del-art', this.obj)
        // console.log(this.obj)
      } else if (item.id === 22) {
        this.show2 = true
      } else {
        try {
          await articleReportsAPI({
            target: this.obj.art_id,
            // constant 里面的value
            type: String(item.value),
            remark: item.value === 0 ? item.name : null
          })
          Toast.success('反馈成功,病毒加载完毕')
        } catch (e) {
          Toast.fail(e.message || '反馈失败')
        } finally {
          this.show1 = this.show2 = false
        }
      }
      // console.log(item.name)
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
.loading {
  margin-top: 150px;
  text-align: center;
}
</style>
