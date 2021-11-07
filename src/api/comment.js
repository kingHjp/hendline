import request from '@/utils/request.js'
// 评论列表
const commentListAPI = ({ source, offset, limit = 10 }) => {
  return request({
    url: '/v1_0/comments',
    params: {
      type: 'a',
      source,
      offset,
      limit
    }
  })
}
// 评论 - 点赞
const commentLikeAPI = ({ comId }) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: comId
    }
  })
}
// 评论 - 取消点赞 (RestFul API)
const commentUnLikeAPI = ({ comId }) => {
  return request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
  })
}
// 发布评论
const commentSendAPI = ({ artId, sendText }) => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: {
      target: artId,
      content: sendText
    }
  })
}
export { commentListAPI, commentLikeAPI, commentUnLikeAPI, commentSendAPI }
