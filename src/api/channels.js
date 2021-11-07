import request from '@/utils/request.js'
// 接口方法, 只负责调用一个接口, 返回一个Promise对象
export const allChannelListAPI = () => {
  return request({
    url: '/v1_0/channels'
  })
}
