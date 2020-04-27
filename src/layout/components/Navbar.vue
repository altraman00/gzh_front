<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" />
        
        <el-tooltip effect="dark" content="多公众号版本" placement="bottom">
          <div class="right-menu-item hover-effect">
            <el-link type="success" href="https://demo.joolun.com/" target="_blank" class="el-icon-s-promotion">多公众号版</el-link>
          </div>
        </el-tooltip>

        <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip>-->
        <el-tooltip effect="dark" :content="currentGZH ? currentGZH.appName:  '无'" placement="bottom">
          <div class="right-menu-item hover-effect">
            <el-link type="success"  @click="handleShowModal" class="el-icon-s-promotion">公众号：{{currentGZH ? currentGZH.appName:  '无'}}</el-link>
          </div>
        </el-tooltip>
        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span @click="setting = true">布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="切换公众号" :visible.sync="dialogMsgVisible" width="40%">
      <el-select style="width: 100%" v-model="selectedGZH">
        <el-option v-for="item in gzhList" :key="item.id" :label="`${item.appName}（${item.type == 1 ? '订阅号' : item.type == 2 ? '服务号': '小程序'}）`" :value-key="item.id" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMsgVisible = false">取 消</el-button>
        <el-button :disabled="!selectedGZH" type="primary" @click="updateGZH()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getGZHlist } from '@/api/login'
import { getCurrentGZH, setCurrentGZH } from '@/utils/auth'
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import RuoYiGit from "@/components/RuoYi/Git";
import RuoYiDoc from "@/components/RuoYi/Doc";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  data() {
    return {
      dialogMsgVisible: false,
      selectedGZH: null,
      gzhList: []
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "currentGZH"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    }
  },
  methods: {
    updateGZH () {
      if (!this.selectedGZH) {
        return
      }
      let selectedGZH = null
      this.gzhList.map(item => {
       if (item.id == this.selectedGZH) {
         selectedGZH = item
       }
      })
      setCurrentGZH(selectedGZH)
      this.$store.commit('SET_CURRENTGZH', selectedGZH)
      this.dialogMsgVisible = false;
      window.location.reload()
    },
    handleShowModal() {
      this.dialogMsgVisible = true
      getGZHlist().then(res => {
        this.gzhList = res.data
        this.selectedGZH = getCurrentGZH() ? getCurrentGZH().id : null
      })
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.reload();
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
