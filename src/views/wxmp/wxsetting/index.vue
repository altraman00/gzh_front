<template lang="html">
  <div class="" >
    <div v-if="settingShow" class="">
      <div class="" style="padding: 20px;padding-bottom:0">
        <el-button @click="goBack" size="mini"><i class="el-icon-back"></i>返回</el-button>
      </div>
      <Single :templateId="chosenTemplateId"></Single>
    </div>
    <div v-else class="" style="padding: 20px;">
      <div class="" style="text-align:right;margin-bottom: 20px;">
        <el-button @click="addClick" type="primary" size="mini">添加活动模板</el-button>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%;white-space:pre-line;">
        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="templateName" label="活动名称"></el-table-column>
        <el-table-column prop="activityEnable" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.activityEnable" style="color:rgb(129, 200, 48)">已启用</span>
            <span v-else>已停用</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="活动启动时间" :formatter="timeFormat"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <a
              style="color: #409EFF;cursor: pointer;margin-right: 12px;"
              size="mini"
              type="primary"
              @click="setting(scope.row.id)"
            >配置</a>
            <a
              @click="changeStatus(scope.row)"
              style="color: #409EFF;cursor: pointer;margin-right: 12px;"
              size="mini"
              type="primary"
            >{{scope.row.activityEnable?'停止':'启用'}}</a>
            <el-popconfirm title="确定删除吗？" @onConfirm="del(scope.row.id)">
              <a slot="reference" style="color: #409EFF;cursor: pointer;"  size="mini">删除</a>
            </el-popconfirm>
            <!-- <el-button size="mini" type="danger">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-dialog title="添加活动模板" width="500px" :visible.sync="dialogShow">
        <div class="">
          <p>
            <label style="width: 100px;display:inline-block;text-align:right;">活动名称：</label>
            <el-input style="width:300px;" v-model="newActivity.title"></el-input>
          </p>
          <p>
            <label style="width: 100px;display:inline-block;text-align:right;">启动时间：</label>
            <el-date-picker
              v-model="newActivity.startDate"
            ></el-date-picker>
          </p>
          <p style="margin-top: 25px;">
            <label style="width: 100px;display:inline-block;text-align:right;">是否启用：</label>
            <el-switch v-model="newActivity.status"></el-switch>
          </p>
        </div>
        <div class="footer" style="text-align:right;margin-top:30px;">
          <el-button @click="dialogShow=false">取消</el-button>
          <el-button type="primary" @click="add">保存</el-button>
        </div>
      </el-dialog> -->

      <el-dialog title="添加活动模板" :visible.sync="dialogShow">
        <div class="msg-main">
          <span>选择活动模板：</span>
          <el-select v-model="selectCurrenTemplate">
            <el-option
              v-for="item in tempList"
              :key="item.id"
              :label="item.templateName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogShow = false">取 消</el-button>
          <el-button :disabled="!selectCurrenTemplate" type="primary" @click="handleConfirmModal">确 定</el-button>
        </div>
      </el-dialog>

    </div>


  </div>
</template>

<script>
import moment from 'moment';
import {
  getAllTemplateList,
  changeTemplateStatus,
  deleteTemplete,
  getTemplateList,
  bindTemplate
} from "@/api/wxmp/wxsetting";
import { getCurrentGZH, setCurrentGZH } from '@/utils/auth'
import Single from './single'
export default {
  components: {
    Single
  },
  data() {
    return {
      tableData: [],
      loading: false,
      dialogShow: false,
      settingShow: false,
      newActivity: {
        status: 1,
        title: '',
        startDate: ''
      },
      chosenTemplateId: '',
      tempList: [],
      selectCurrenTemplate: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getAll() {
      getTemplateList({
        type: ''
      }).then(res => {
        this.tempList = res.data;
      });
    },
    getList() {
      this.loading = true;
      getAllTemplateList({
        appId: getCurrentGZH().appId
      }).then(res => {
        this.loading = false;
        this.tableData = res.data;
      })
    },
    handleConfirmModal() {
      const params = {
        appId: getCurrentGZH().appId,
        templateId: this.selectCurrenTemplate
      };
      bindTemplate(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.dialogShow = false;
          this.getList();
        }
      });
    },
    addClick() {
      this.getAll();
      this.dialogShow = true;
    },
    add() {
      console.log(this.newActivity);
    },
    /*删除活动*/
    del(id) {
      deleteTemplete(id).then(res => {
        this.getList()
      })
    },
    /* 修改状态  params：1、启用/0、停用*/
    changeStatus(item) {
      changeTemplateStatus(item.id, !item.activityEnable).then(res => {
        this.getList()
      })
    },
    setting(id) {
      // this.$router.push({
      //   path: './single',
      //   query: {
      //     id: id
      //   }
      // })
      this.settingShow = true;
      this.chosenTemplateId = id;
    },
    goBack() {
      this.settingShow = false;
      this.getList()
    },
    timeFormat(row, column, cellValue, index) {
      return cellValue?moment(cellValue).format('YYYY-MM-DD'):''
    }
  }
}
</script>

<style lang="css" scoped>
</style>
