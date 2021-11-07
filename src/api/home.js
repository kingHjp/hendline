import request from '@/utils/request.js'
// import store from '@/store/index.js'
// 首页获取用户选择的频道列表
// console.log(store)
const getChannelList = () =>
  request({
    url: '/v1_0/user/channels'
    // headers: {
    //   Authorization: 'Bearer ' + store.state.token
    // }
  })

// 获取所有的频道列表
const allChannelListAPI = () => {
  return request({
    url: '/v1_0/channels'
  })
}
// 首页获取文章列表
const getArticleListAPi = ({ channelId, timestamp }) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp: timestamp || new Date().getTime()
    },
    isAuth: false
  })
}
// 更新用户已选频道
const updateCannelListAPI = ({ channels }) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels
    }
  })
}
// 不感兴趣的文章删除
const articleDislikeAPI = ({ artId }) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/dislikes',
    data: {
      target: artId
    }
    // headers: {
    //   Authorization: `Bearer ${store.state.token}`
    // }
  })
}
// 举报文章
const articleReportsAPI = ({ target, type, remark }) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/reports',
    data: { target, type, remark }
    // headers: {
    //   Authorization: `Bearer ${store.state.token}`
    // }
  })
}
export {
  getChannelList,
  allChannelListAPI,
  updateCannelListAPI,
  getArticleListAPi,
  articleDislikeAPI,
  articleReportsAPI
}
