import request from '@/utils/request.js'
// 文章详情接口
const articleDetailAPI = ({ art_id }) => {
  return request({
    url: `/v1_0/articles/${art_id}`
  })
}
// 文章作者关注
const authorFollowedAPI = ({ target }) => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target
    }
  })
}
// 取消文章作者关注
const authorUnFollowedAPI = ({ aut_id }) => {
  return request({
    url: `/v1_0/user/followings/${aut_id}`,
    method: 'DELETE'
  })
}
// 文章点赞
const articleLikeAPI = ({ target }) => {
  return request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target
    }
  })
}
// 取消文章点赞
const articleUnLikeAPI = ({ aut_id }) => {
  return request({
    url: `/v1_0/article/likings/${aut_id}`,
    method: 'DELETE',
    data: {
      aut_id
    }
  })
}
export { articleDetailAPI, authorFollowedAPI, authorUnFollowedAPI, articleLikeAPI, articleUnLikeAPI }
