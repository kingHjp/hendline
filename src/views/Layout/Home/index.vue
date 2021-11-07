<template>
  <!-- 主页 -->
  <div>
    <!-- 头部 -->
    <van-nav-bar fixed>
      <template #left>
        <!-- <img class="logo" :src="imgObj" /> -->
        <h4 class="toutiao" @click="$router.push('/layout/home')">头条</h4>
      </template>
      <template #right>
        <van-icon name="search" size="0.48rem" color="#fff" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>
    <!-- 内容选项卡 -->
    <van-tabs animated v-model="channelId" sticky offset-top="1.226667rem">
      <van-tab v-for="item in channelList" :key="item.id" v-highlight :title="item.name" :name="item.id">
        <article-list :cid="channelId"></article-list>
      </van-tab>
    </van-tabs>
    <!-- 点击加号编辑导航 -->
    <van-icon name="plus" size="0.37333334rem" is-link @click="showPopup" class="moreChannels" />
    <!-- 点击加号后要显示的内容 -->
    <van-popup class="edit-channel" v-model="show"
      ><channel-edit
        v-model="channelId"
        :userChannelList="channelList"
        @add="addFn"
        @remove="removeFn"
        @closeFn="show = false"
        @channelC="changechannelFn"
      ></channel-edit
    ></van-popup>
  </div>
</template>

<script>
import logoPng from '@/assets/images/logo.png'
import { getChannelList, updateCannelListAPI } from '@/api/home.js'
import ArticleList from '@/views/Layout/Home/ArticleList.vue'
import ChannelEdit from '@/views/Layout/Home/ChannelEdit.vue'
export default {
  name: 'Home',
  data() {
    return {
      imgObj: logoPng,
      channelId: 0,
      channelList: [],
      // 是否显示加号后编辑频道
      show: false
    }
  },
  methods: {
    showPopup() {
      this.show = true
    },
    //
    changechannelFn(cId) {
      this.channelId = cId
    },
    // 增加用户频道
    addFn(obj) {
      this.channelList.push(obj)
      this.editFn()
    },
    // 删除用户频道
    removeFn(obj) {
      const index = this.channelList.findIndex(item => item.id === obj.id)
      this.channelList.splice(index, 1)
      this.editFn()
    },
    // 更新频道展示数据
    async editFn() {
      const newArr = this.channelList.map(obj => {
        // console.log(obj)
        const newObj = { ...obj }
        // console.log(newObj)
        return newObj
      })
      // console.log(newArr)
      const index = newArr.findIndex(obj => obj.id === 0)
      newArr.splice(index, 1)
      newArr.forEach((obj, index) => {
        obj.seq = index + 1
        delete obj.name
      })
      const res = await updateCannelListAPI({
        channels: newArr
      })
      console.log(res)
    }
  },

  async created() {
    const res = await getChannelList()
    this.channelList = res.data.data.channels
    // console.log(res.data.data.channels)
  },
  components: {
    ArticleList,
    ChannelEdit
  }
}
</script>

<style lang="less" scoped>
.logo {
  width: 100px;
  height: 30px;
}
/* tab内容距离tab导航的距离 */
/deep/ .van-tabs__content {
  padding-top: 44px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
/deep/ .edit-channel {
  width: 100%;
  height: 100%;
}
.loading {
  margin-top: 50px;
  text-align: center;
}
.toutiao {
  text-align: center;
  color: #fff;
}
</style>
