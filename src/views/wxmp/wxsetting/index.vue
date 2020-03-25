<template>
  <div :class="{'nodata': !currentTemp}" class="app-container">
    <div v-if="!currentTemp" class="nodata-setting">
      <p>暂未配置运营活动，请先点击配置</p>
      <el-button type="primary" @click="dialogShow = true">配置运营活动</el-button>
    </div>
    <div v-if="currentTemp" class="toolbar">
      <div v-if="currentTemp" class="left">
        当前活动：
        <span class="activity-name">{{currentTemp.templateName}}</span>
        <span :class="{paused: !active}" class="status">{{active ? '活动进行中' : '活动暂停中'}}</span>
      </div>
      <div class="right">
        <el-button @click="handleToggleActivity">{{active ? '活动暂停' : '活动继续'}}</el-button>
        <el-button @click="handleChangeTemplate" type="primary">切换活动模板</el-button>
      </div>
    </div>
    <!-- <avue-crud ref="crud" :data="tableData" :option="tableOption" :page="page"></avue-crud> -->
    <div v-if="currentTemp" class="content">
      <el-table :data="tableData" stripe style="width: 100%;white-space:pre-line;">
        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="repTypeDesc" label="类型" width="80"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <div v-if="scope.row.repType === 'text' || scope.row.repType === 'schedule'" v-html="scope.row.repContent"></div>
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
            <a
            style="color: #409EFF;cursor: pointer;margin-right: 12px;"
              v-if="scope.row.repType === 'poster'"
              @click="handlePreviewPosterModal(scope.row)"
              size="mini"
              type="primary"
            >预览</a>
            <a style="color: #409EFF;cursor: pointer;" size="mini" @click="handleEditTmp(scope.row)">编辑</a>
            <!-- <el-button size="mini" type="danger">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑海报" :visible.sync="editPosterModalShow">
      <div style="text-align:center;" v-if="selectedTmp" class="msg-main">
        <el-form>
        <p style="text-align:left;font-weight:600">海报底图上传</p>
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
          <div slot="tip" class="el-upload__tip">支持bmp/png/jpeg/jpg/gif格式，大小不超过2M，建议图片尺寸宽750px*高1206px</div>
        </el-upload>
        <el-row style="margin-top: 10px;" type="flex" justify="start" align="middle">
          <span style="width: 150px;text-align:left;">二维码定位坐标(x, y)：</span>
          <el-form-item style="margin-bottom: 0;position: relative;" :class="{'is-error': !rules.qrcodeCoordinate.status}">
            <el-input @blur="checkoutQrcodeCoordinate" v-model="selectedTmp.qrcodeCoordinate" style="width: 100px;"></el-input>&nbsp;
            <small style="position: absolute;left:0;top: 30px;color:#F56C6C;" v-if="!rules.qrcodeCoordinate.status">{{rules.qrcodeCoordinate.msg}}</small>
          </el-form-item>
          <span style="width: 100px;text-align:left;margin-left: 20px;">二维码大小：</span>
          <el-form-item style="margin-bottom: 0;" :class="{'is-error': !rules.qrcodeSize.status}">
            <el-input @blur="checkoutQrcodeSize" v-model="selectedTmp.qrcodeSize" style="width: 100px;"></el-input>&nbsp;px
            <small style="position: absolute;left:0;top: 30px;color:#F56C6C;" v-if="!rules.qrcodeSize.status">{{rules.qrcodeSize.msg}}</small>
          </el-form-item>
        </el-row>
        <el-row style="margin-top: 40px;" type="flex" justify="start" align="middle">
          <span style="width: 150px;text-align:left;">头像定位坐标(x, y)：</span>
          <el-form-item style="margin-bottom: 0;position: relative;" :class="{'is-error': !rules.avatarCoordinate.status}">
            <el-input @blur="checkoutAvatarCoordinate" v-model="selectedTmp.avatarCoordinate" style="width: 100px;"></el-input>&nbsp;
            <small style="position: absolute;left:0;top: 30px;color:#F56C6C;" v-if="!rules.avatarCoordinate.status">{{rules.avatarCoordinate.msg}}</small>
          </el-form-item>
          <span style="width: 100px;text-align:left;margin-left: 20px;">头像大小：</span>
          <el-form-item style="margin-bottom: 0;position: relative;" :class="{'is-error': !rules.avatarSize.status}">
            <el-input @blur="checkoutAvatarSize" v-model="selectedTmp.avatarSize" style="width: 100px"></el-input>&nbsp;px
            <small style="position: absolute;left:0;top: 30px;color:#F56C6C;" v-if="!rules.avatarSize.status">{{rules.avatarSize.msg}}</small>
          </el-form-item>
        </el-row>
        <p style="text-align:left;font-weight:600">备注</p>
        <el-input type="textarea" show-word-limit maxlength="1000" rows="6" v-model="selectedTmp.remark"></el-input>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditPosterModalShow">取 消</el-button>
        <el-button type="primary" @click="confirmEditPosterModal">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="预览海报" :visible.sync="previewPosterModalShow">
      <div v-loading="loading" style="text-align:center;" v-if="selectedTmp" class="msg-main">
        <img :src="currentPoster" style="max-width:400px;max-height:400px;" />
        <p>{{selectedTmp.remark}}</p>
      </div>
    </el-dialog>
    <el-dialog :title="selectedTmp ? selectedTmp.repType === 'schedule' ? '编辑定时任务':'编辑消息':'编辑消息'" :visible.sync="editTextModalShow">
      <div v-if="selectedTmp" class="msg-main">
        <p style="font-weight: 600;margin-bottom: 10px;">标题： <span style="font-weight: 400;">{{selectedTmp.title}}</span></p>
        <p v-if="selectedTmp.repType === 'schedule'" style="font-weight: 600;margin-bottom: 10px;">定时规则：  <el-input style="width: 360px;"  v-model="selectedTmp.scheduleCron"></el-input><el-button plain style="margin-left: 12px" type="primary"><a href="https://www.pppet.net/" target="_blank">规则生成器</a></el-button></p>
        <p style="font-weight: 600;text-align:left;" class="title">内容</p>
        <el-input rows="6" maxlength="1000" type="textarea" show-word-limit v-model="selectedTmp.repContent"></el-input>
        <p style="font-weight: 600;">备注</p>
        <el-input rows="6" maxlength="1000" type="textarea" show-word-limit v-model="selectedTmp.remark"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTextModalShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditTextModal">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="配置运营活动" :visible.sync="dialogShow">
      <div class="msg-main">
        <p>选择活动模板</p>
        <el-select v-model="selectCurrenTemplate">
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
  editTemplate,
  toggleActivity,
  previewPoster
} from "@/api/wxmp/wxsetting";
import { getToken } from "@/utils/auth";
import { getWechatInfo } from "@/api/test";
export default {
  components: {},
  data() {
    return {
      selectCurrenTemplate: null,
      rules: {
        avatarCoordinate: {
          status: true,
          msg: ''
        },
        avatarSize: {
          status: true,
          msg: ''
        },
        qrcodeCoordinate: {
          status: true,
          msg: ''
        },
        qrcodeSize: {
          status: true,
          msg: ''
        }
      },
      loading: false,
      currentFile: null,
      currentPoster: null,
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
      uploadData: {
        mediaType: "image",
        title: "",
        introduction: ""
      },
      active: false,
      typeMap: {
        'text': '文本',
        'poster': '海报',
        'schedule': '定时任务'
      }
    };
  },
  methods: {
    handleChangeTemplate () {
      this.$confirm('切换后当前活动不可用，是否切换活动模板？', '切换活动模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogShow = true
      })
    },
    checkoutQrcodeCoordinate () {
      if (this.selectedTmp && this.selectedTmp.qrcodeCoordinate) {
        let reg = /^(\d)+,(\d)+$/g
        if (!reg.test(this.selectedTmp.qrcodeCoordinate)) {
          this.rules.qrcodeCoordinate.status = false
          this.rules.qrcodeCoordinate.msg = '格式不正确' 
        } else {
          this.rules.qrcodeCoordinate.status = true
          this.rules.qrcodeCoordinate.msg = '' 
        }
      } else {
        this.rules.qrcodeCoordinate.status = false
        this.rules.qrcodeCoordinate.msg = '内容不可以为空' 
      } 
    },
    checkoutAvatarCoordinate () {
      if (this.selectedTmp && this.selectedTmp.avatarCoordinate) {
        let reg = /^(\d)+,(\d)+$/g
        if (!reg.test(this.selectedTmp.avatarCoordinate)) {
          this.rules.avatarCoordinate.status = false
          this.rules.avatarCoordinate.msg = '格式不正确' 
        } else {
          this.rules.avatarCoordinate.status = true
          this.rules.avatarCoordinate.msg = '' 
        }
      } else {
        this.rules.avatarCoordinate.status = false
        this.rules.avatarCoordinate.msg = '内容不可以为空' 
      } 
    },
    checkoutQrcodeSize () {
      if (!this.selectedTmp || !this.selectedTmp.qrcodeSize) {
        this.rules.qrcodeSize.status = false
        this.rules.qrcodeSize.msg = '内容不可以为空'
      } else {
        let reg = /(^(\d)+$)|(^(\d)+.(\d)+$)/g
        if (!reg.test(this.selectedTmp.qrcodeSize)) {
          this.rules.qrcodeSize.status = false
          this.rules.qrcodeSize.msg = '格式不正确' 
        } else {
          this.rules.qrcodeSize.status = true
          this.rules.qrcodeSize.msg = ''
        }
      }
    },
    checkoutAvatarSize () {
      if (!this.selectedTmp || !this.selectedTmp.avatarSize) {
        this.rules.avatarSize.status = false
        this.rules.avatarSize.msg = '内容不可以为空'
      } else {
        let reg =/(^(\d)+$)|(^(\d)+.(\d)+$)/g
        if (!reg.test(this.selectedTmp.avatarSize)) {
          this.rules.avatarSize.status = false
          this.rules.avatarSize.msg = '格式不正确'
        } else {
          this.rules.avatarSize.status = true
          this.rules.avatarSize.msg = ''
        }
      }
    },
    handleToggleActivity() {
      toggleActivity(this.appId, { activityEnable: !this.active }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getWechatInfo();
        }
      });
    },
    cancelEditPosterModalShow() {
      console.log('flad')
      this.fileList = [];
      this.uploadData = {
        mediaType: "image",
        title: "",
        introduction: ""
      };
      this.selectedTmp = null
      this.editPosterModalShow = false;
    },
    selectMaterial(item) {
      let tempObjItem = {};
      tempObjItem.repType = this.objData.repType;
      tempObjItem.repMediaId = item.mediaId;
      tempObjItem.media_id = item.mediaId;
      tempObjItem.content = item.content;

      this.dialogNewsVisible = false;
      this.dialogImageVisible = false;
      this.dialogVoiceVisible = false;
      this.dialogVideoVisible = false;
      this.objData.repMediaId = item.mediaId;
      this.objData.media_id = item.mediaId;
      this.objData.content = item.content;
      if (this.objData.repType == "music") {
        tempObjItem.repThumbMediaId = item.mediaId;
        tempObjItem.repThumbUrl = item.url;
        this.objData.repThumbMediaId = item.mediaId;
        this.objData.repThumbUrl = item.url;
        this.dialogThumbVisible = false;
      } else {
        tempObjItem.repName = item.name;
        tempObjItem.repUrl = item.url;
        this.objData.repName = item.name;
        this.objData.repUrl = item.url;
      }
      if (this.objData.repType == "video") {
        getMaterialVideo({
          mediaId: item.mediaId
        }).then(response => {
          if (response.code == 200) {
            let data = response.data;
            this.$set(this.objData, "repName", data.title);
            this.$set(this.objData, "repDesc", data.description);
            this.$set(this.objData, "repUrl", data.downUrl);
            tempObjItem.repDesc = data.description;
            tempObjItem.repUrl = data.downUrl;
          }
        });
      }
      this.tempObj.set(this.objData.repType, tempObjItem);
    },
    confirmEditPosterModal() {
      this.checkoutQrcodeCoordinate()
      this.checkoutQrcodeSize()
      this.checkoutAvatarCoordinate()
      this.checkoutAvatarSize()
      if (!this.rules.qrcodeCoordinate.status || !this.rules.qrcodeSize.status || !this.rules.avatarCoordinate.status || !this.rules.avatarSize.status) {
        return
      }
      if (this.selectedTmp.remark.length > 1000) {
        return
      }
      let params = {
        remark: this.selectedTmp.remark,
        repContent: this.tempFile || this.selectedTmp.repContent,
        repMediaId: this.uploadImgUrl || this.selectedTmp.repMediaId,
        avatarCoordinate: this.selectedTmp.avatarCoordinate,
        avatarSize: this.selectedTmp.avatarSize,
        qrcodeCoordinate: this.selectedTmp.qrcodeCoordinate,
        qrcodeSize: this.selectedTmp.qrcodeSize
      };
      editTemplate(this.selectedTmp.id, params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.editPosterModalShow = false;
          this.getWechatInfo();
        }
      });
    },
    confirmEditTextModal() {
      if (this.selectedTmp.remark.length > 1000) {
        return
      }
      let params = {
        remark: this.selectedTmp.remark,
        repContent: this.selectedTmp.repContent,
        repMediaId: ""
      };
      if (this.selectedTmp.repType === 'schedule') {
        params = {
          ...params,
          scheduleCron : this.selectedTmp.scheduleCron 
        }
      }
      editTemplate(this.selectedTmp.id, params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.editTextModalShow = false;
          this.getTemplateList();
        }
      });
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.tempFile = response.data.url;
        this.uploadImgUrl = response.data.mediaId;
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
    beforeImageUpload(file) {
      const isType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/bmp" ||
        file.type === "image/jpg";
      const isLt = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error("上传图片格式不对!");
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过2M!");
      }
      return isType && isLt;
    },
    handleConfirmEditPosterModal(tmp) {},
    // handleEditPosterModal() {
    //   this.editPosterModalShow = true
    // },
    handlePreviewPosterModal(tmp) {
      this.loading = true
      previewPoster(tmp.id).then(res => {
        if (res.code === 200) {
          this.currentPoster = `data:image/png;base64,${res.data.posterBase64}`
          this.loading = false
        }
      })
      this.previewPosterModalShow = true;
      this.selectedTmp = tmp;
    },
    handleConfirmEditTextModal() {
      this.editTextModalShow = false;
      this.selectedTmp = null;
    },
    handleEditTmp(tmp) {
      if (tmp.repType === "poster") {
        this.selectedTmp = JSON.parse(JSON.stringify(tmp));
        this.checkoutQrcodeCoordinate()
        this.checkoutAvatarCoordinate()
        this.checkoutQrcodeSize()
        this.checkoutAvatarSize()
        this.editPosterModalShow = true;
      } else {
        this.selectedTmp = tmp;
        this.editTextModalShow = true;
      }
    },
    handleConfirmModal() {
      const params = {
        appId: this.appId,
        templateId: this.selectCurrenTemplate.id
      };
      bindTemplate(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.dialogShow = false;
          this.getWechatInfo();
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
            repTypeDesc: this.typeMap[item.repType]
          };
        });
      });
    },
    getWechatInfo() {
      getWechatInfo({ appIdentify: "online_study" }).then(res => {
        if (res.data.code === 200) {
          this.appId = res.data.data.wxMp.appId;
          this.currentTemp = res.data.data.template;
          this.active = res.data.data.wxMp.activityEnable;
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
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 84px);
  }
  .nodata-setting {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
      &.paused {
        color: #e6a23c;
      }
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