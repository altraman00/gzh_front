<template>
  <div :class="{'nodatas': !currentTemp}" class="app-container">
    <!-- <avue-crud ref="crud" :data="tableData" :option="tableOption" :page="page"></avue-crud> -->
    <div class="toolbar">
      <div v-if="currentTemp" class="left">
        当前活动：
        <span class="activity-name">{{currentTemp.templateName}}</span>
        <span class="status">活动进行中</span>
      </div>
      <div class="right">
        <el-button>活动暂停</el-button>
        <el-button @click="dialogShow = true" type="primary">切换活动模板</el-button>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="repTypeDesc" label="类型"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <div v-html="scope.row.repContent"></div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini">编辑</el-button>
            <!-- <el-button size="mini" type="danger">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="配置运营活动" :visible.sync="dialogShow">
      <div class="msg-main">
         <p>选择活动模板</p>
         <el-select v-model="currentTemp">
             <el-option v-for="item in tempList" :key="item.id" :label="item.templateName" :value="item"></el-option>
         </el-select>
     </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmModal">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { tableOption } from "@/const/crud/wxmp/wxsetting";
import {
  getWexinInfo,
  getTemplateList,
  getMsgTemplateList,
  bindTemplate
} from "@/api/wxmp/wxsetting";
import { getWechatInfo } from "@/api/test";
export default {
  components: {
  },
  data() {
    return {
      dialogShow: false,
      tempList: [],
      tableData: [],
      appId: "wx9047d074c6a5a211",
      currentTemp: null,
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        ascs: [],
        descs: "subscribe_time"
      }
    };
  },
  methods: {
      handleConfirmModal(){
        const params = {
            appId: this.appId,
            templateId: this.currentTemp.id
        }
        bindTemplate(params).then(res => {
            if (res.code === 200) {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                this.dialogShow = false
            }
        })
      },
    getTemplateList() {
      getTemplateList().then(res => {
        this.tempList = res.data;
      });
    },
    getMsgTemplateList() {
      getMsgTemplateList({ appId: this.appId }).then(res => {
        this.tableData = res.data.map(item => {
          return {
            ...item,
            repTypeDesc: item.repType === "text" ? "文本" : "海报"
          };
        });
      });
    },
    getWechatInfo() {
      getWechatInfo({ appIdentify: "online_study" }).then(res => {
        if (res.data.code === 200) {
          this.appId = res.data.data.wxMp.appId;
          this.currentTemp = res.data.data.template;
          if (this.currentTemp) {
            this.getMsgTemplateList();
          }
        }
      });
    }
  },
  created() {
    this.getWechatInfo();
    this.getTemplateList();
    // getMsgTemplateList({ appId: 'wx9047d074c6a5a211' })
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  &.nodata {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .toolbar {
    width: 100%;
    display: flex;
    font-size: 14px;
    color: #495060;
    justify-content: space-between;
    span.status {
      color: #67c23a;
      display: inline-block;
      margin-left: 12px;
    }
  }
  .content {
    padding: 20px 0;
  }
}
</style>