<template>
  <div class="userEdit">
    <el-form ref="ruleForm" :model="ruleForm" status-icon class="demo-ruleForm" label-position="top" :rules="rules" label-width="80px" style="width:250px;margin:0 auto">
      <el-form-item label="头像" prop="mainImg">
        <!-- <el-upload :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :action="uploadFile" name="files" class="avatar-uploader"> -->
        <el-upload :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :action="uploadFile" class="avatar-uploader">
          <img v-if="ruleForm.mainImg" :src="ruleForm.mainImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="ruleForm.checkPassword" type="password" placeholder="请再次输入密码" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否申请成为鉴定人员">
        <el-radio v-model="radio" label="0">
          否
        </el-radio>
        <el-radio v-model="radio" label="1">
          是
        </el-radio>
      </el-form-item>
      <div v-if="radio==='1'" style="color:red;margin-bottom:30px">
        <span>申请完成后，请等待管理员审核</span>
      </div>
      <el-form-item class="btn">
        <el-button :loading="submitLoding" type="primary" @click="editUser">
          修改
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { uploadFile } from '@/api/commom.js'
import { editUser } from '@/api/user.js'
import { addApproval } from '@/api/approval.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPassword !== '') {
          this.$refs.ruleForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      submitLoding: false,
      uploadFile: uploadFile(),
      radio: '0',
      ruleForm: {
        username: '',
        password: '',
        checkPassword: '',
        mainImg: ''
      },
      rules: {
        password: [{ validator: validatePass, trigger: 'blur', required: true, message: '请输入密码' }],
        checkPassword: [{ validator: validatePass2, trigger: 'blur', required: true, message: '请再输入密码' }],
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        mainImg: [{ required: true, message: '请选择头像', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.ruleForm.username = JSON.parse(sessionStorage.getItem('userInfo')).username
  },
  methods: {
    logout() {
      console.log('登出')
      this.$store
        .dispatch('logout', this.token)
        .then(() => {
          this.$message({
            type: 'success',
            message: '修改成功，请重新登录',
            onClose: () => {
              this.$router.push({ path: this.redirect || '/login' })
            }
          })
        })
        .catch(() => {
        })
    },
    editUser() {
      if (Number(this.radio) === 1) {
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
        const postData = this.qs.stringify({
          userId: JSON.parse(sessionStorage.getItem('userInfo')).id,
          username: this.ruleForm.username,
          imageUrl: this.ruleForm.mainImg,
          time: nowDate
        })
        addApproval(postData).then(res => {
          console.log('申请成功')
        })
      }
      const postData = this.qs.stringify({
        id: JSON.parse(sessionStorage.getItem('userInfo')).id,
        username: this.ruleForm.username,
        password: this.ruleForm.password,
        img: this.ruleForm.mainImg,
        supplyFlag: Number(this.radio)
      })
      editUser(postData).then(res => {
        this.logout()
      })
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
.userEdit {
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
  .btn .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
