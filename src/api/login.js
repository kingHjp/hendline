import request from '@/utils/request.js'
import store from '@/store/index.js'
export const loginAPI = ({ mobile, code }) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    },
    isAuth: false
  })
}
// 用户 - 更新token
export const refreshTokenAPI = () =>
  request({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${store.state.refresh_token}`
    }
  })
