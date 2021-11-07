import request from '@/utils/request.js'
import store from '@/store/index.js'
// 用户基本资料
const userInfoAPI = () => {
  return request({
    url: '/v1_0/user'
  })
}
// 用户个人资料
const userProfileAPI = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}
//  更新头像
const updatePhotoAPI = formObj => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: formObj
  })
}
// 用户 - 更新资料
const updateProfileAPI = ({ birthday, userName }) => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: {
      birthday: birthday,
      name: userName
    }
  })
}
// 用户 - 更新token
// 重点: 需要一个refresh_token(用于续签)
export const refreshTokenAPI = () =>
  request({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${store.state.refresh_token}`
    }
    // 不要担心请求拦截器给你修改和覆盖Authorization的值
    // 因为那边判断了, 如果请求头里有自己的Authorization, 请求拦截器就不再携带了
  })
export { userInfoAPI, userProfileAPI, updatePhotoAPI, updateProfileAPI }
