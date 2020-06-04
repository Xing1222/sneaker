<template>
  <div class="logRegBox">
    <div v-if="flag === 'login'" class="login">
      <el-form ref="loginForm" label-position="right" label-width="80px" :model="loginForm" class="form">
        <h1 style="color:#ffffff;font-size:25px;">
          Sneaker球鞋鉴定导购社交网
        </h1>
        <el-form-item label="账号：" style="margin:5% 0px">
          <el-input v-model="loginForm.username" style="width:85%;display:flex;" />
        </el-form-item>
        <el-form-item label="密码：" style="margin:5% 0px">
          <el-input v-model="loginForm.password" type="password" autocomplete="off" style="width:85%;display:flex;" />
        </el-form-item>
        <el-link type="info" @click="flag = 'reg'">
          立即注册
        </el-link>
        <el-button :loading="loginLoading" class="logBtn" @click="login">
          登录
        </el-button>
      </el-form>
    </div>
    <div v-if="flag !== 'login'" class="reg">
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm form">
        <h1 style="color:#ffffff;font-size:25px;">
          Sneaker球鞋鉴定导购社交网
        </h1>
        <el-form-item label="账号：" style="margin:5% 0px">
          <el-input v-model="ruleForm.username" style="width:85%;display:flex;" />
        </el-form-item>
        <el-form-item label="密码：" prop="password" style="margin:5% 0px">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off" style="width:85%;display:flex;" />
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPassword" style="margin:5% 0px">
          <el-input v-model="ruleForm.checkPassword" type="password" autocomplete="off" style="width:85%;display:flex;" />
        </el-form-item>
        <el-form-item label="邮箱：" style="margin:5% 0px">
          <el-input v-model="ruleForm.email" style="width:85%;display:flex;" />
        </el-form-item>
        <el-link type="info" @click="flag = 'login'">
          已有账号，前往登录
        </el-link>
        <el-button :loading="submitLoding" class="logBtn" @click="reg">
          注册
        </el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reg } from '@/api/user.js'
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
      loginLoading: false,
      submitLoding: false,
      loginForm: {
        username: '',
        password: ''
      },
      ruleForm: {
        username: '',
        password: '',
        checkPassword: '',
        email: ''
      },
      flag: 'login',
      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkPassword: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          console.log(11111111111111, this.$store.dispatch)
          this.loginLoading = true
          this.$store
            .dispatch('login', this.loginForm)
            .then(() => {
              this.$message({
                type: 'success',
                message: '登录成功',
                onClose: () => {
                  this.$router.push({ path: this.redirect || '/' })
                  this.loginLoading = false
                }
              })
            })
            .catch(() => {
              this.loginLoading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reg() {
      this.submitLoding = true
      const postData = this.qs.stringify({
        username: this.ruleForm.username,
        password: this.ruleForm.password,
        email: this.ruleForm.email,
        img: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      })
      reg(postData)
        .then(res => {
          this.$message({
            message: '注册成功',
            type: 'success',
            onClose: () => {
              this.submitLoding = false
              this.flag = 'login'
              this.ruleForm = {
                username: '',
                password: '',
                checkPassword: '',
                email: ''
              }
            }
          })
        })
        .catch(rej => {
          this.submitLoding = false
        })
    }
  }
}
</script>
<style lang="scss">
.logRegBox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 936px;
  background-image: url("../assets/login.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  .login {
    background-color: rgba(0, 0, 0, 0.5);
    position: relative;
    width: 30%;
    text-align: center;
    border-radius: 15px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    -o-border-radius: 15px;
    .form {
      padding: 5% 0% 0 0%;
      .logBtn {
        font-size: 30px;
        color: #fff;
        outline: none;
        border: none;
        background-color: rgb(255, 208, 75);
        width: 100%;
        padding: 18px 0;
        border-bottom-left-radius: 15px;
        -webkit-border-bottom-left-radius: 15px;
        -moz-border-bottom-left-radius: 15px;
        -o-border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        -webkit-border-bottom-right-radius: 15px;
        -moz-border-bottom-right-radius: 15px;
        -o-border-bottom-right-radius: 15px;
        cursor: pointer;
        &:hover {
          background: #3ea751;
          transition: 0.5s;
        }
      }
      .el-input__inner {
        background-color: transparent !important;
        color: #ffffff;
      }
      .el-form-item__label {
        color: #ffffff !important;
      }
      .el-link.el-link--info {
        margin: 0 0 10px 0;
      }
    }
  }
  .reg {
    background-color: rgba(0, 0, 0, 0.5);
    position: relative;
    width: 30%;
    text-align: center;
    border-radius: 15px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    -o-border-radius: 15px;
    .form {
      padding: 5% 0% 0 0%;
      .logBtn {
        font-size: 30px;
        color: #fff;
        outline: none;
        border: none;
        background-color: rgb(255, 208, 75);
        width: 100%;
        padding: 18px 0;
        border-bottom-left-radius: 15px;
        -webkit-border-bottom-left-radius: 15px;
        -moz-border-bottom-left-radius: 15px;
        -o-border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        -webkit-border-bottom-right-radius: 15px;
        -moz-border-bottom-right-radius: 15px;
        -o-border-bottom-right-radius: 15px;
        cursor: pointer;
        &:hover {
          background: #3ea751;
          transition: 0.5s;
        }
      }
      .el-input__inner {
        background-color: transparent !important;
        color: #ffffff;
      }
      .el-form-item__label {
        color: #ffffff !important;
      }
      .el-link.el-link--info {
        margin: 0 0 10px 0;
      }
    }
  }
}
</style>
