<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <van-search
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-fofo
        v-model="kw"
        @input="inputFn"
        @search="enterFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length > 0">
      <div
        class="sugg-item"
        v-for="(str, index) in suggestList"
        :key="index"
        v-html="lightFn(str, kw)"
        @click="suggestFn(str)"
      >
        {{ str }}
      </div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="delFn" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(item, index) in history" :key="index" @click="historyFn(item)">{{
          item
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api/search.js'
import { lightFn } from '@/utils/str.js'
export default {
  data() {
    return {
      kw: '', // 搜索关键字
      timer: null, // 防抖用的定时器
      suggestList: [], // 搜索建议项
      history: JSON.parse(localStorage.getItem('his')) || [] // 搜索历史
    }
  },

  methods: {
    // 搜索框的值不为空的时候发送请求 显示搜索关键字
    inputFn() {
      // 定义处理输入的信息防抖  发送请求
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        // 当输入框的值未空的话 不发送请求
        if (this.kw.length === 0) {
          this.suggestList = []
          return
        }
        // console.log(123)
        const res = await suggestListAPI({
          q: this.kw
        })
        // console.log(res)
        this.suggestList = res.data.data.options
        console.log(this.suggestList)
      }, 500)
    },
    // 关键字高亮显示的处理
    lightFn,
    // 输入框回车  触发该事件
    enterFn() {
      this.history.push(this.kw)
      // 当kw的值不为空的时候跳转
      setTimeout(() => {
        if (this.kw.length > 0) {
          this.$router.push({
            path: `/search/${this.kw}`
          })
        }
      })
      this.history = Array.from(new Set(this.history)) // 去重
    },
    // 点击搜索建议触发该事件 联想菜单
    suggestFn(str) {
      this.history.push(str)
      setTimeout(() => {
        this.$router.push(`/search/${str}`)
      })
      this.history = Array.from(new Set(this.history)) // 去重
    },
    // 点击历史记录
    historyFn(str) {
      this.$router.push(`/search/${str}`)
    },
    // 清空搜索历史
    delFn() {
      this.history = []
    }
  },
  watch: {
    // 监听history的变化
    history: {
      deep: true, // 深度监听
      handler() {
        localStorage.setItem('his', JSON.stringify(this.history))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
