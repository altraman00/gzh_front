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
export default {
    created () {
        console.log('router', this.$route)
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