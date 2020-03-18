<template>
    <div class="wrap">
        <div class="icon"></div>
        <p>欢迎进入</p>
    </div>
</template>
<script>
import { getRouters } from '@/api/test'
export default {
    mounted () {
        // getRouters()
    }
}
</script>
<style lang="scss" scoped>
.wrap{
    width: 100%;
    min-height: calc(100vh - 84px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .icon{
        width: 164px;
        height: 88px;
        background: url(../assets/image/home.png) no-repeat center center;
        background-size: contain;
    }
}
</style>