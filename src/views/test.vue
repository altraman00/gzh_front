<template>
  <div class="wrap">
    <div
      v-if="user && user.headImgUrl"
      :style="{backgroundImage: `url(${user.headImgUrl})`}"
      class="avatar"
    ></div>
    <div v-if="user && user.nickname" class="info-item">
      <label>昵称</label>
      <p>{{user.nickname}}</p>
    </div>
    <div v-if="user && user.sexDesc" class="info-item">
      <label>性别</label>
      <p>{{user.sexDesc}}</p>
    </div>
    <div v-if="user && user.country && user.province" class="info-item">
      <label>地址</label>
      <p>{{user.country}} {{user.province}}</p>
    </div>
  </div>
</template>
<script>
import { getWechatInfo, getOauth2 } from "@/api/test";
const APPID = "wx1ae5569fd1bd1e3e";
const SECRET = "22437a698a6bac6837a866d723c9a261";

export default {
  data() {
    return {
      code: null,
      res: null,
      user: null
    };
  },
  methods: {
    getWechatInfo() {
      getWechatInfo({ appIdentify: "online_study" }).then(res => {
        console.log("res", res);
        const appid = res.data.data.wxMp.appId;
        console.log("appId", appId);
      });
    },
    getUserInfo(code) {
      getOauth2({ code }).then(res => {
        this.res = res;
        this.user = res.data.data.wxMpUser;
      });
    }
  },
  created() {
    // this.getWechatInfo()
    if (this.$route.query.code) {
      const code = this.$route.query.code;
      this.getUserInfo(code);
    }
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9047d074c6a5a211&redirect_uri=http://gzh.supplus.cn/402&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-self: center;
  align-items: center;
  flex-direction: column;
  .avatar {
    display: inline-block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 100px;
    height: 100px;
    background-color: #3f3;
    border-radius: 50%;
  }
  .info-item{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
  }
}
</style>