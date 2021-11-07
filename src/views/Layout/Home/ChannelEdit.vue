<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="close" />
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span
          >我的频道
          <span class="small-title"> 点击{{ isEdit ? '删除' : '进入' }}频道 </span>
        </span>
        <span @click="editFn">{{ isEdit ? '完成' : '编辑' }}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col
          span="6"
          v-for="item in userChannelList"
          :key="item.id"
          @click="removeFn(item)"
          :style="{ color: value === item.id ? 'red' : '' }"
        >
          <!-- { color: value === item.id ? 'red' : '' } -->
          <div class="channel-item van-hairline--surround">
            {{ item.name }}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge" v-show="isEdit && item.name !== '推荐'">
              <template #content>
                <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="0.32rem" />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="item in unChannelList" :key="item.id" @click="moreFn(item)">
          <div class="channel-item van-hairline--surround">{{ item.name }}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { allChannelListAPI } from '@/api/home.js'
export default {
  data() {
    return {
      allChannelList: [], // 所有的用户频道
      isEdit: false // 编辑频道 开启或关闭
    }
  },
  props: {
    value: {
      type: Number
    },
    userChannelList: {
      // 用户已选
      type: Array
    }
  },
  computed: {
    // 用户未选择的
    unChannelList() {
      return this.allChannelList.filter(obj => {
        return this.userChannelList.findIndex(item => item.id === obj.id) === -1
      })
    }
  },
  methods: {
    // 用户未选择的
    editFn() {
      this.isEdit = !this.isEdit
    },
    moreFn(obj) {
      if (this.isEdit) {
        this.$emit('add', obj)
      }
    },
    removeFn(obj) {
      if (this.isEdit && obj.name !== '推荐') {
        this.$emit('remove', obj)
      } else if (this.isEdit === false) {
        // 在频道编辑页面 不是编辑的状态下 点击进入相应的频道
        // this.$emit('channelC', obj.id)
        this.$emit('input', obj.id)
        this.$emit('closeFn')
      }
    },
    // 关闭弹出层
    close() {
      // 把事件抛给父组件处理
      this.$emit('closeFn')
      this.isEdit = false
    }
  },
  async created() {
    const res = await allChannelListAPI()
    this.allChannelList = res.data.data.channels
    // console.log(res)
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
