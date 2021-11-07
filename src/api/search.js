import request from '@/utils/request.js'
// 搜索 联想菜单
const suggestListAPI = ({ q }) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
// 搜索结果列表
const searchListAPI = ({ q, page }) => {
  return request({
    url: '/v1_0/search',
    params: {
      q,
      page
    }
  })
}
export { suggestListAPI, searchListAPI }
