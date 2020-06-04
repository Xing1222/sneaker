<template>
  <div class="add">
    <el-form ref="ruleForm" :model="ruleForm" class="demo-ruleForm flex-form" :inline="true">
      <el-form-item label="文章标题" style="display:block;text-align: left;">
        <el-input v-model="ruleForm.title" placeholder="请输入标题" style="width:200px" />
      </el-form-item>
      <el-form-item label="文章话题" style="display:block;text-align: left;">
        <el-input v-model="ruleForm.conversation" placeholder="请输入话题" style="width:200px" />
      </el-form-item>
      <el-form-item label="文章作者" style="display:block;text-align: left;">
        <el-input v-model="ruleForm.author" readonly style="width:200px" />
      </el-form-item>
      <el-form-item label="文章封面" style="display:block;text-align: left;">
        <!-- <el-upload :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :action="uploadFile" name="files" class="avatar-uploader"> -->
        <el-upload :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="files" :action="uploadFile" class="avatar-uploader">
          <img v-if="ruleForm.mainImg" :src="ruleForm.mainImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" style="display:block;text-align: left;">
        <tinymce-editor ref="editor" v-model="ruleForm.content" @onClick="onClick" />
      </el-form-item>
      <el-form-item class="only-child">
        <el-button :loading="submitLoding" type="primary" @click="submitForm('ruleForm')">
          创建
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import TinymceEditor from '@/components/tinymceEditor'
import { uploadFile } from '@/api/commom.js'
import { addPosts } from '@/api/posts.js'
export default {
  components: {
    TinymceEditor
  },
  props: {
    typeId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      submitLoding: false,
      uploadFile: uploadFile(),
      ruleForm: {
        title: '',
        mainImg: '',
        conversation: '',
        author: '',
        content: '',
        clickNum: 0,
        replyNum: 0
      },
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 400,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: this.uploadFile,
        // UEditor 资源文件的存放路径，如果你使用的是 vue- cli 生成的项目，通常不需要设置该选项，vue- ueditor - wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/UEditor/',
        // UEDITOR_HOME_URL: '/UEditor/'
        convert_urls: false // 这个参数加上去就可以了
      }
    }
  },
  created() {
    console.log(this.typeId, 'this.typeId')
    this.ruleForm.author = JSON.parse(sessionStorage.getItem('userInfo')).username
    console.log(JSON.parse(sessionStorage.getItem('userInfo')).img)
  },
  methods: {
    submitForm(formName, propType) {
      this.submitLoding = true
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          var date = new Date()
          var year = date.getFullYear()
          var month = date.getMonth() + 1
          var day = date.getDate()
          if (month < 10) {
            month = '0' + month
          }
          if (day < 10) {
            day = '0' + day
          }
          var nowDate = year + '年' + month + '月' + day + '日'
          console.log(this.ruleForm, 'this.ruleForm')
          const authorImg = JSON.parse(sessionStorage.getItem('userInfo')).img
          console.log(authorImg)
          const postData = this.qs.stringify({
            'title': this.ruleForm.title,
            'conversation': this.ruleForm.conversation,
            'author': this.ruleForm.author,
            'authorImg': authorImg,
            'userId': JSON.parse(sessionStorage.getItem('userInfo')).id,
            'imageUrl': this.ruleForm.mainImg,
            'content': this.ruleForm.content,
            'clickNum': 0,
            'replyNum': 0,
            'time': nowDate,
            'type': this.typeId
          })
          addPosts(postData).then(() => {
            this.$message({
              message: '创建成功',
              type: 'success',
              onClose: () => {
                this.$emit('dataInit')
                this.submitLoding = false
              }
            })
          }).catch(rej => {
            this.submitLoding = false
          })
        } else {
          this.submitLoding = false
          return false
        }
      })
    },
    // 鼠标单击的事件
    onClick(e, editor) {
      console.log('Element clicked')
      console.log(e)
      console.log(editor)
    },
    // 清空内容
    clear() {
      this.$refs.editor.clear()
    },
    ready(editorInstance) {
      console.log(`编辑器实例${editorInstance.key}: `, editorInstance)
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      this.ruleForm.mainImg = 'http://www.shoe.cn' + res.data[0].pics
    },
    // 上传图片前控制图片大小和格式
    beforeAvatarUpload(file) {
      console.log(file)
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB！')
      }
      return isLt2M
    }
  }
}
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px !important;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
