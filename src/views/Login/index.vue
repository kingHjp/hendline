<template>
  <div>
    <!-- <h1>登录页面</h1> -->
    <!-- 头部 -->
    <van-nav-bar title="头条-登录" />
    <!-- //表单 -->
    <van-form @submit="onSubmit">
      <!-- label 文本框之前的文字
      required必填项 加上属性后会出现一个红色五角星提示
      placeholder 文本框内默认的内容
      rules定义验证规则
       -->
      <van-field
        v-model="mobile"
        name="mobile"
        label="手机号"
        required
        placeholder="手机号"
        :rules="[
          { required: true, message: '请填写手机号' },
          { trigger: 'onChange', pattern: /^1[3456789]\d{9}$/, message: '手机号格式错误' }
        ]"
      />
      <van-field
        v-model="code"
        type="password"
        name="code"
        label="密码"
        required
        placeholder="密码"
        :rules="[
          { required: true, message: '请填写密码' },
          { trigger: 'onBlur', pattern: /^\d{6}$/, message: '填写正确的验证码' }
        ]"
      />
      <div style="margin: 16px;">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          :loading="isLoding"
          :disabled="isLoding"
          loading-text="加载中,请稍后..."
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// import { loginAPI } from '@/api/login.js'
import { Notify, Toast } from 'vant'

import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      mobile: '13888888889',
      code: '246810',
      isLoding: false
    }
  },
  methods: {
    ...mapActions(['asyncLoginAction']),
    async onSubmit(values) {
      // console.log('submit', values)
      this.isLoding = true
      try {
        await this.asyncLoginAction(values)
        // Notify({ type: 'success', message: '登录成功' })
        Toast.success('登录成功')
        this.$router.replace('/layout')
        // const res = await loginAPI(values)
        // // console.log(res)
        // const { token, refresh_token } = res.data.data
        // console.log(token)
        // console.log(refresh_token)
        // Notify({ type: 'success', message: '登录成功' })
        this.isLoding = false
      } catch (error) {
        Notify({ type: 'warning', message: '手机号或密码错误' })
        this.isLoding = false
        Toast.fail('登录失败')
        // console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
// .van-nav-bar {
//   background-color: #007bff;
//   /deep/ .van-nav-bar__title {
//     color: white;
//   }
// }
</style>
