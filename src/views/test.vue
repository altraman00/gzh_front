<template>
  <div class="wrap">
      <div class="avatar"></div>
      <div class="info-item">
          <label>昵称</label>
          <p></p>
      </div>
      <div class="info-item">
          <label>性别</label>
          <p></p>
      </div>
      <div class="info-item">
          <label>地址</label>
          <p></p>
      </div>
      <div class="info-item">
          <label>openid</label>
          <p></p>
      </div>
  </div>
</template>
<script>
import axios from 'axios'
const APPID = 'wx1ae5569fd1bd1e3e'
const SECRET = '22437a698a6bac6837a866d723c9a261'

export default {
    data () {
        return {
            code: null
        }
    },
    created () {
        const code = this.$route.query.code
        this.code = code
        console.log('router', this.$route.query.code)
        let url = `/wechat/sns/oauth2/access_token?appid=${APPID}&secret=${SECRET}&code=${code}&grant_type=authorization_code`
        axios.get(url).then(res => {

        })
    }
}
</script>
<style lang="scss" scoped>
.wrap{
    display: flex;
    justify-self: center;
    align-items: center;
    flex-direction: column;
    background: rgba($color: #ddd, $alpha: 0.6);
    .avatar{
        display: inline-block;
        width: 100px;
        height: 100px;
        background-color: #3f3;
        border-radius: 50%;
    }
}
</style>