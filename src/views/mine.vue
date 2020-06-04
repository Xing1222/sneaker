<template>
  <div class="mine">
    <headers :active="active" />
    <div class="mineBox">
      <div class="left">
        <el-tabs v-if="modular === 1" v-model="activeName" style="position: relative">
          <!-- <el-button type="success" size="mini" style="position: absolute;right: 0;top: -50px;" @click.stop="showLayer({ component: 'add', title: '新增帖子', type: 'add' })">
            发帖
          </el-button> -->
          <el-tab-pane label="我的帖子" name="first" style="font-size: 23px;">
            <div v-for="(item,index) in postsLists" :key="index" class="newlist">
              <router-link :to="{name:'forumDetails',params:{ lists:JSON.stringify(item) }}">
                <el-card class="box-card" shadow="hover">
                  <div slot="header" class="clearfix">
                    <span>{{ item.title }}</span>
                  </div>
                  <div class="text item">
                    <el-image style="width: 100px" :src="item.imageUrl" />
                  </div>
                  <div style="position: relative;">
                    <el-avatar :src="item.authorImg" :size="35" />
                    <span class="user">{{ item.author }}</span>
                    <span class="time">{{ item.time }}</span>
                    <!-- <span class="view"><i class="el-icon-view" />157</span> -->
                    <span class="view" style="right:5px"><i class="el-icon-chat-dot-square" />{{ item.replyNum }}</span>
                  </div>
                </el-card>
              </router-link>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-if="modular === 2" v-model="activeName" style="position: relative">
          <el-tab-pane label="我的关注" name="first" style="font-size: 23px;">
            <div class="follow">
              <el-card v-for="(item,index) in followLists" :key="index" class="box-card" shadow="hover">
                <div slot="header" class="clearfix" style="position: relative;">
                  <span>{{ item.title }}</span>
                  <el-button type="danger" size="mini" style="position: absolute;right: 0px;" @click="delFollow(item.id)">
                    取消关注
                  </el-button>
                </div>
                <div class="text item">
                  板块介绍：{{ item.introduction }}
                </div>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-if="modular === 3" v-model="activeName" style="position: relative">
          <el-tab-pane label="我的收藏" name="first" style="font-size: 23px;">
            <div v-for="(item, index) in collectionLists" :key="index" class="newlist">
              <router-link :to="{name:'forumDetails',params:{ lists:JSON.stringify(item),nameFrom:'mineCollection' }}">
                <el-card class="box-card" shadow="hover" style="margin: 10px auto;">
                  <div slot="header" class="clearfix" style="position: relative;">
                    <span>{{ item.title }}</span>
                    <el-button type="danger" size="mini" style="position: absolute;right: 0px;" @click.prevent="delCollection(item)">
                      取消收藏
                    </el-button>
                  </div>
                  <div class="text item">
                    <el-image style="width: 100px" :src="item.imageUrl" />
                  </div>
                  <div style="position: relative;">
                    <el-avatar :src="item.authorImg" :size="35" />
                    <span class="user">{{ item.author }}</span>
                    <span class="time">{{ item.time }}</span>
                    <span class="view" style="right:5px"><i class="el-icon-chat-dot-square" />{{ item.replyNum }}</span>
                  </div>
                </el-card>
              </router-link>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <div class="user">
          <span @click="showLayer({ component: 'userEdit', title: '修改个人资料', type: 'add' })">
            <el-tooltip class="item" effect="dark" content="修改个人资料" placement="top-end">
              <el-avatar :size="73" :src="userInfo.img" class="image" />
            </el-tooltip>
          </span>
          <p class="name">
            {{ userInfo.username }}
          </p>
          <p v-if="flagApproval">
            鉴定人员
          </p>
          <div class="icon">
            <div @click="modular = 1">
              <i class="el-icon-tickets" />
              <p>我的帖子</p>
            </div>
            <div @click="modular = 2">
              <i class="el-icon-view" />
              <p>我的关注</p>
            </div>
            <div @click="modular = 3">
              <i class="el-icon-star-off" />
              <p>我的收藏</p>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-block">
        <el-dialog :title="layerData.title" :visible.sync="drawer">
          <div v-if="drawer" class="body-content">
            <component :is="layerData.component" ref="layerDataComponent" :prop-data="layerData.data" :prop-type="layerData.type" />
          </div>
        </el-dialog>
      </div>
    </div>
    <footers />
  </div>
</template>
<script>
import headers from '@/components/header.vue'
import footers from '@/components/footer.vue'
import add from '@/components/add.vue'
import userEdit from '@/components/userEdit.vue'
import { selectMineFollow, delFollow, selectMinePosts, selectMineCollection, delCollection } from '@/api/posts.js'
export default {
  components: {
    headers,
    footers,
    add,
    userEdit
  },
  data() {
    return {
      active: '4',
      activeName: 'first',
      modular: 1,
      count: 0,
      userInfo: '',
      drawer: false,
      followLists: [],
      postsLists: [],
      collectionLists: [],
      layerComponent: 'add',
      flagApproval: '',
      layerData: {
        title: 'personnelCreation',
        data: {}
      }
    }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    console.log(sessionStorage.getItem('flagApproval'), 'sessionStorage.getIte')
    this.flagApproval = sessionStorage.getItem('flagApproval') !== 'undefined' ? JSON.parse(sessionStorage.getItem('flagApproval')) : ''
    this.selectMineFollow()
    this.selectMinePosts()
    this.selectMineCollection()
  },
  methods: {
    delCollection(lists) {
      const postData = this.qs.stringify({
        userId: lists.userId,
        postsId: lists.postsId
      })
      delCollection(postData).then(res => {
        this.$message({
          type: 'success',
          message: '取消成功'
        })
        this.selectMineCollection()
      })
    },
    selectMineCollection() {
      const postData = this.qs.stringify({
        userId: this.userInfo.id
      })
      selectMineCollection(postData).then(res => {
        this.collectionLists = res.data.lists
      })
    },
    selectMineFollow() {
      const postData = this.qs.stringify({
        userId: this.userInfo.id
      })
      selectMineFollow(postData).then(res => {
        this.followLists = res.data.lists
      })
    },
    selectMinePosts() {
      const postData = this.qs.stringify({
        userId: this.userInfo.id
      })
      selectMinePosts(postData).then(res => {
        this.postsLists = res.data.lists
        console.log(this.postsLists, 'this.postsLists')
      })
    },
    delFollow(id) {
      const postData = this.qs.stringify({
        id: id
      })
      delFollow(postData).then(res => {
        this.$message({
          type: 'success',
          message: '取关成功'
        })
        this.selectMineFollow()
      })
    },
    // 抽屉显示
    showLayer(options) {
      this.layerData.component = options.component
      this.layerData.title = options.title
      this.layerData.data = options.row || {}
      this.layerData.type = options.type || ''
      this.drawer = true
    }
  }
}
</script>
<style lang="scss">
.mine {
  .mineBox {
    width: 80%;
    margin: 100px auto;
    display: flex;
    min-height: 800px;
  }
  .left {
    width: 70%;
    .newlist {
      margin: 10px auto;
      .box-card {
        width: 100%;
      }
    }
    .follow {
      margin: 10px auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .box-card {
        width: 46%;
      }
      .el-card {
        margin: 5px 0px;
      }
    }
    .el-tabs__content {
      overflow: inherit;
    }
    .el-tabs__item.is-top.is-active {
      font-size: 23px;
    }
    .el-card__header {
      text-align: left;
    }
    .el-card__body {
      text-align: left;
    }
    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }
    .user {
      display: inline-block;
      position: relative;
      line-height: 20px;
      font-size: 12px;
      color: #666;
    }
    .time {
      font-size: 12px;
      color: #a7a7a7;
      border-left: 1px solid #eee;
      margin-left: 5px;
      padding-left: 10px;
    }
    .view {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #a7a7a7;
      margin-top: 4px;
      position: absolute;
      right: 45px;
      bottom: 0px;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both;
    }
  }
  .right {
    width: 30%;
    margin-top: 35px;
    .user {
      top: 0;
      position: relative;
      width: 278px;
      min-height: 252px;
      margin: 0 auto;
      background: #fff url(http://www.iplaystone.com/circle/img/peobg.png)
        no-repeat top;
      margin-bottom: 20px;
      .image {
        height: 73px;
        width: 73px;
        line-height: 73px;
        margin: 45px 20px 16px;
        &:hover {
          transform: rotate(360deg);
          transition: 1s;
        }
      }
      .name {
        font-size: 24px;
      }
      .icon {
        display: flex;
        justify-content: space-around;
        margin-top: 30px;
        div {
          cursor: pointer;
          &:hover {
            color: rgb(255, 208, 75);
          }
        }
        p {
          font-size: 16px;
          margin-top: 5px;
        }
        i {
          font-size: 35px;
        }
      }
    }
  }
}
</style>
