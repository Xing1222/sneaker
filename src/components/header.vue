<template>
  <div class="head">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
      <div class="author">
        <el-dropdown v-if="token && userInfo" class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="head">
            <el-avatar :src="userInfo.img" />
            {{ userInfo.username }}
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">登出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <router-link v-else to="/login">
          <div class="head">
            登录/注册
          </div>
        </router-link>
      </div>
      <el-menu-item index="4">
        个人中心
      </el-menu-item>
      <el-menu-item index="3">
        社区精选
      </el-menu-item>
      <el-menu-item index="2">
        购买精选
      </el-menu-item>
      <el-menu-item index="1">
        首页
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    active: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeIndex: '1',
      userInfo: ''
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    console.log(this.userInfo, this.token, '12214124')
    this.activeIndex = this.active
  },
  methods: {
    logout() {
      console.log('登出')
      this.$store
        .dispatch('logout', this.token)
        .then(() => {
          this.$message({
            type: 'success',
            message: '登出成功',
            onClose: () => {
              this.$router.push({ path: this.redirect || '/login' })
              this.loginLoading = false
            }
          })
        })
        .catch(() => {
          this.loginLoading = false
        })
    },
    handleSelect(key, keyPath) {
      if (key === '1') {
        console.log(key)
        this.$router.push({ path: '/home' })
      } else if (key === '2') {
        console.log(key)
        this.$router.push({ path: '/shop' })
      } else if (key === '3') {
        console.log(key)
        this.$router.push({ path: '/forum' })
      } else if (key === '4') {
        console.log(key)
        if (this.token) {
          this.$router.push({ path: '/mine' })
        } else {
          this.$message({
            type: 'error',
            message: '请先登录'
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" >
.head {
  .el-menu--horizontal > .el-menu-item {
    float: right;
    width: 200px;
  }
  .author {
    // display: inline-block;
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
    width: 200px;
    height: 60px;
    outline: none;
    .head {
      color: white;
      font-size: 14px;
    }
    .el-avatar.el-avatar--circle {
      vertical-align: middle;
    }
  }
}
.el-dropdown-menu.el-popper {
  top: 47px !important;
}
</style>
