<template lang="html">
  <div class="" style="padding: 20px;">
    <div class="" style="text-align:right;margin-bottom: 20px;">
      <el-button @click="addClick" type="primary" size="mini">添加活动模板</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%;white-space:pre-line;">
      <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
      <el-table-column prop="title" label="活动名称"></el-table-column>
      <el-table-column prop="statue" label="状态"></el-table-column>
      <el-table-column prop="createDate" label="活动启动时间"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <a
          style="color: #409EFF;cursor: pointer;margin-right: 12px;"
            size="mini"
            type="primary"
            @click="setting(scope.row.id)"
          >配置</a>
          <a
          style="color: #409EFF;cursor: pointer;margin-right: 12px;"
            size="mini"
            type="primary"
          >停止</a>
          <a style="color: #409EFF;cursor: pointer;" size="mini" @click="del(scope.row)">删除</a>
          <!-- <el-button size="mini" type="danger">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加活动模板" width="500px" :visible.sync="dialogShow">
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
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        id: '1',
        title: '测试活动',
        status: 1,
        startDate: '2020-04-12'
      }],
      dialogShow: false,
      newActivity: {
        status: 1,
        title: '',
        startDate: ''
      }
    }
  },
  methods: {
    addClick() {
      this.dialogShow = true;
    },
    add() {
      console.log(this.newActivity);
    },
    /*删除活动*/
    del(id) {

    },
    /* 修改状态  params：1、启用/0、停用*/
    changeStatus(id) {

    },
    setting(id) {
      this.$router.push({
        path: './single',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
