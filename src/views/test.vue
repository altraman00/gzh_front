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
          <p>{{res}}</p>
      </div>
      <div class="info-item">
          <label>openid</label>
          <p>{{code}}</p>
      </div>
  </div>
</template>
<script>
import { getWechatInfo, getOauth2 } from '@/api/test'
const APPID = 'wx1ae5569fd1bd1e3e'
const SECRET = '22437a698a6bac6837a866d723c9a261'

export default {
    data () {
        return {
            code: null,
            res: null
        }
    },
    methods: {
        getWechatInfo () {
            getWechatInfo({ appIdentify: 'online_study' }).then(res =>{
                console.log('res', res)
                const appid = res.data.data.wxMp.appId
                console.log('appId', appId)
            })
        },
        getUserInfo (code) {
            getOauth2({ code }).then(res => {
                this.res = res
            })
        }
    },
    created () {
        // this.getWechatInfo()
        if (this.$route.query.code) {
            const code = this.$route.query.code
            this.getUserInfo(code)
        }
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9047d074c6a5a211&redirect_uri=http://gzh.supplus.cn/402&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
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