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
      <el-table :data="tableData" stripe style="width: 100%;white-space:pre-line;">
        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="repTypeDesc" label="类型" width="80"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <div v-if="scope.row.repType === 'text'" v-html="scope.row.repContent"></div>
            <img
              style="max-width: 201px;max-height: 201px;"
              v-if="scope.row.repType === 'poster'"
              :src="scope.row.repContent"
              alt
            />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.repType === 'poster'"
              @click="handlePreviewPosterModal(scope.row)"
              size="mini"
              type="primary"
            >预览</el-button>
            <el-button size="mini" @click="handleEditTmp(scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="danger">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑海报" :visible.sync="editPosterModalShow">
      <div style="text-align:center;" v-if="selectedTmp" class="msg-main">
        <p style="text-align:left">内容</p>
        <el-upload
          :action="actionUrl"
          :headers="headers"
          multiple
          :limit="1"
          :before-upload="beforeImageUpload"
          :on-success="handleUploadSuccess"
          :file-list="fileList"
          :data="uploadData"
        >
          <el-button type="primary">上传图片</el-button>
          <div slot="tip" class="el-upload__tip">支持bmp/png/jpeg/jpg/gif格式，大小不超过2M</div>
        </el-upload>
        <p style="text-align:left">备注</p>
        <el-input type="textarea" v-model="selectedTmp.remark"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditPosterModalShow">取 消</el-button>
        <el-button type="primary" @click="confirmEditPosterModal">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="预览海报" :visible.sync="previewPosterModalShow">
      <div style="text-align:center;" v-if="selectedTmp" class="msg-main">
        <img :src="selectedTmp.repContent" style="max-width:400px;max-height:400px;" />
        <p>{{selectedTmp.remark}}</p>
      </div>
    </el-dialog>
    <el-dialog title="编辑海报" :visible.sync="editTextModalShow">
      <div v-if="selectedTmp" class="msg-main">
        <p class="title">内容</p>
        <el-input type="textarea" v-model="selectedTmp.repContent"></el-input>
        <p>备注</p>
        <el-input type="textarea" v-model="selectedTmp.remark"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTextModalShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditTextModal">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="配置运营活动" :visible.sync="dialogShow">
      <div class="msg-main">
        <p>选择活动模板</p>
        <el-select v-model="currentTemp">
          <el-option
            v-for="item in tempList"
            :key="item.id"
            :label="item.templateName"
            :value="item"
          ></el-option>
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
  bindTemplate,
  editTemplate
} from "@/api/wxmp/wxsetting";
import { getToken } from "@/utils/auth";
import { getWechatInfo } from "@/api/test";
export default {
  components: {},
  data() {
    return {
      currentFile: null,
      editPosterModalShow: false,
      selectedTmp: null,
      previewPosterModalShow: false,
      editTextModalShow: false,
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
      },
      actionUrl: "/api/wxmaterial/materialFileUpload",
      headers: {
        Authorization: "Bearer " + getToken()
      },
      file: null,
      tempFile: null,
      uploadImgUrl: null,
      fileList: [],
      uploadData:{
          "mediaType": 'image',
          "title":'',
          "introduction":''
        },
    };
  },
  methods: {
    cancelEditPosterModalShow() {
      this.fileList = []
      this.uploadData = {
          "mediaType": 'image',
          "title":'',
          "introduction":''
        }
      this.editPosterModalShow = false
    },
    selectMaterial(item){
        let tempObjItem = {}
        tempObjItem.repType = this.objData.repType
        tempObjItem.repMediaId = item.mediaId
        tempObjItem.media_id = item.mediaId
        tempObjItem.content = item.content

        this.dialogNewsVisible = false
        this.dialogImageVisible = false
        this.dialogVoiceVisible = false
        this.dialogVideoVisible = false
        this.objData.repMediaId = item.mediaId
        this.objData.media_id = item.mediaId
        this.objData.content = item.content
        if(this.objData.repType == 'music'){
          tempObjItem.repThumbMediaId = item.mediaId
          tempObjItem.repThumbUrl = item.url
          this.objData.repThumbMediaId = item.mediaId
          this.objData.repThumbUrl = item.url
          this.dialogThumbVisible = false
        }else{
          tempObjItem.repName = item.name
          tempObjItem.repUrl = item.url
          this.objData.repName = item.name
          this.objData.repUrl = item.url
        }
        if(this.objData.repType == 'video'){
          getMaterialVideo({
            mediaId:item.mediaId
          }).then(response => {
            if(response.code == 200){
              let data = response.data
              this.$set(this.objData,'repName',data.title)
              this.$set(this.objData,'repDesc',data.description)
              this.$set(this.objData,'repUrl',data.downUrl)
              tempObjItem.repDesc = data.description
              tempObjItem.repUrl = data.downUrl
            }
          })
        }
        this.tempObj.set(this.objData.repType,tempObjItem)
      },
    confirmEditPosterModal(){
      let params = {
        remark: this.selectedTmp.remark,
        repContent: this.tempFile || this.selectedTmp.repContent,
        repMediaId: this.uploadImgUrl || this.selectedTmp.repMediaId
      }
      editTemplate(this.selectedTmp.id, params).then(res => {
        console.log('res', res)
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.editPosterModalShow = false
          this.getWechatInfo()
        }
      })
    },
    confirmEditTextModal(){
      let params = {
        remark: this.selectedTmp.remark,
        repContent: this.selectedTmp.repContent,
        repMediaId: ''
      }
      editTemplate(this.selectedTmp.id, params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.editTextModalShow = false
          this.getTemplateList()
        }
      })
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.tempFile = response.data.url
        this.uploadImgUrl = response.data.mediaId
        // this.selectedTmp.repContent = response.url
        // this.selectedTmp.repMediaId = response.mediaId
        // this.fileList = [];
        // this.uploadData.title = "";
        // this.uploadData.introduction = "";
        // let item = response.data;
      } else {
        this.$message.error("上传出错：" + response.msg);
      }
    },
    beforeImageUpload(file){
        const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp' || file.type === 'image/jpg';
        const isLt = file.size / 1024 / 1024 < 2;
        if (!isType) {
          this.$message.error('上传图片格式不对!');
        }
        if (!isLt) {
          this.$message.error('上传图片大小不能超过2M!');
        }
        return isType && isLt;
      },
    handleConfirmEditPosterModal(tmp) {},
    // handleEditPosterModal() {
    //   this.editPosterModalShow = true
    // },
    handlePreviewPosterModal(tmp) {
      this.previewPosterModalShow = true;
      this.selectedTmp = tmp;
    },
    handleConfirmEditTextModal() {
      this.editTextModalShow = false;
      this.selectedTmp = null;
    },
    handleEditTmp(tmp) {
      if (tmp.repType === "poster") {
        this.selectedTmp = tmp;
        this.editPosterModalShow = true;
      } else {
        this.selectedTmp = tmp;
        this.editTextModalShow = true;
      }
    },
    handleConfirmModal() {
      const params = {
        appId: this.appId,
        templateId: this.currentTemp.id
      };
      bindTemplate(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.dialogShow = false;
        }
      });
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
<style lang="scss">
.el-table .cell {
  white-space: pre-line !important;
}
</style>