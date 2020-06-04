<template>
  <div class="home">
    <headers :active="active" />
    <div class="content">
      <el-carousel :interval="4000" type="card" height="350px" style="margin-top:50px">
        <el-carousel-item v-for="(item, index) in lists" :key="index">
          <img :src="item.src" alt="" style="width:100%;height:100%">
        </el-carousel-item>
      </el-carousel>
      <div class="shequ">
        <div class="title">
          <span style="margin-left:10px">
            社区精选
          </span>
          <el-link href="/forum">
            更多<i class="el-icon-arrow-right el-icon--right" />
          </el-link>
        </div>
        <el-card class="box-card">
          <div class="box">
            <div class="content">
              <div v-for="(item,index) in tableList" :key="index" class="tiezi">
                <router-link :to="{name:'forumDetails',params:{ lists:JSON.stringify(item),typeId:item.type }}">
                  <span v-if="index<=2" class="ziti">
                    {{ item.title }}
                  </span>
                </router-link>
                <span v-if="index<=2" class="time">{{ item.time }}</span>
              </div>
            </div>
            <el-divider direction="vertical" />
            <div class="content">
              <div v-for="(item,index) in tableList" :key="index" class="tiezi">
                <router-link :to="{name:'forumDetails',params:{ lists:JSON.stringify(item),typeId:item.type }}">
                  <span v-if="index>2 && index<=5" class="ziti">
                    {{ item.title }}
                  </span>
                </router-link>
                <span v-if="index>2 && index<=5" class="time">{{ item.time }}</span>
              </div>
            </div>
            <el-divider direction="vertical" />
            <div class="content">
              <div v-for="(item,index) in tableList" :key="index" class="tiezi">
                <router-link :to="{name:'forumDetails',params:{ lists:JSON.stringify(item),typeId:item.type }}">
                  <span v-if="index>5 && index<=8" class="ziti">
                    {{ item.title }}
                  </span>
                </router-link>
                <span v-if="index>5 && index<=8" class="time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="xiezi">
        <div class="title">
          <span style="margin-left:10px">
            购买精选
          </span>
          <el-link href="/shop">更多<i class="el-icon-arrow-right el-icon--right" /></el-link>
        </div>
        <div style="display:flex;justify-content: space-between;flex-direction: row;flex-wrap: wrap;">
          <el-card v-for="(item,index) in goodsLists" :key="index" :body-style="{ padding: '0px', height:'100%' }" shadow="hover" style="width:21%;margin-bottom: 10px;">
            <router-link :to="{name:'shopInfo',params:{ lists:item,typeId:item.type }}">
              <div v-if="index<=7" style="height:100%">
                <div style="height:75%;overflow: hidden;">
                  <img :src="item.imageUrl.split(',')[0]" class="image" style="height:100%">
                </div>
                <div style="padding: 14px;">
                  <span>{{ item.name }}</span>
                  <div class="bottom clearfix">
                    <time class="time">￥{{ item.price }}</time>
                  </div>
                </div>
              </div>
            </router-link>
          </el-card>
        </div>
      </div>
    </div>
    <footers />
  </div>
</template>

<script>
import headers from '@/components/header.vue'
import footers from '@/components/footer.vue'
import { WOW } from 'wowjs'
import { selectPosts } from '@/api/posts.js'
import { selectApprovalLists } from '@/api/user.js'
import { selectGoods } from '@/api/goods.js'
export default {
  name: 'Footer',
  components: {
    headers,
    footers
  },
  data() {
    return {
      active: '1',
      filterForm: {
        pageNum: 1,
        pageSize: 20
      },
      lists: [
        { src: require('../assets/1.jpg') },
        { src: require('../assets/2.jpg') },
        { src: require('../assets/3.jpg') },
        { src: require('../assets/4.jpg') },
        { src: require('../assets/5.jpg') }
      ],
      tableList: [],
      approvalList: [],
      goodsLists: []
    }
  },
  watch: {
    '$route': function(newVal, oldVal) {
      console.log(newVal, oldVal)
      // if (newVal === '/login') {
      //   console.log('欢迎进入登录页面')
      // }
      // if (newVal === '/register') {
      //   console.log('欢迎进入注册页面')
      // }
    }
  },
  created() {
    this.init()
    this.approval()
    this.selectGoods()
  },
  mounted() {
    var wow = new WOW({
      boxClass: 'wow',
      animateClass: 'animated',
      // offset: 0,
      mobile: true,
      live: false,
      flagApproval: false
    })
    wow.init()
  },
  methods: {
    async init() {
      const postData = this.qs.stringify({
        pageNum: this.filterForm.pageNum,
        pageSize: this.filterForm.pageSize
      })
      selectPosts(postData)
        .then(res => {
          this.tableList = res.data.lists
          console.log(this.tableList, ' this.tableList')
        })
    },
    selectGoods() {
      const postData = this.qs.stringify({
        pageNum: 1,
        pageSize: 99999
      })
      selectGoods(postData).then(res => {
        this.goodsLists = res.data.lists
      })
    },
    // 审批
    // 初始化
    async approval() {
      const postData = this.qs.stringify({
        pageNum: 1,
        pageSize: 99999
      })
      selectApprovalLists(postData)
        .then(res => {
          this.approvalList = res.data.lists
          const list = []
          for (const i in this.approvalList) {
            console.log(i, list, 'asdasd')
            if (this.approvalList[i].userId === JSON.parse(sessionStorage.getItem('userInfo')).id) {
              list.push(this.approvalList[i].status)
              if (list.indexOf(1) !== -1) {
                console.log('审核通过')
                this.flagApproval = true
              }
              if (list.indexOf(-1) !== -1) {
                console.log('审核拒绝')
                this.flagApproval = false
              }
              if (list.indexOf(0) !== -1) {
                console.log('等待审批')
                this.flagApproval = 'wait'
              }
            }
          }
          if (this.flagApproval === true) {
            this.$notify({
              title: '申请鉴定人结果',
              message: '审批通过',
              duration: 2000
            })
          }
          if (this.flagApproval === false) {
            this.$notify({
              title: '申请鉴定人结果',
              message: '审批拒绝',
              duration: 2000
            })
          }
          if (this.flagApproval === 'wait') {
            this.$notify({
              title: '申请鉴定人结果',
              message: '等待审批',
              duration: 2000
            })
          }
          sessionStorage.setItem('flagApproval', this.flagApproval)
        })
    }
  }
}
</script>
<style lang="scss">
.home {
  .content {
    width: 80%;
    margin: 0 auto;
    .shequ {
      margin: 100px 0px;
      .title {
        width: 100%;
        font-size: 25px;
        border-left: 2px solid red;
        display: flex;
        justify-content: space-between;
        margin: 20px 0px;
      }
      .box-card {
        width: 100%;
        .box {
          display: flex;
          justify-content: space-between;
          .content {
            width: 33.3%;
            .tiezi {
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              line-height: 3;
              .ziti {
                overflow: hidden;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                white-space: nowrap;
                width: 240px;
                display: block;
                &:hover {
                  color: red;
                }
              }
              .time {
                color: #ff6c00;
              }
            }
          }
        }
      }
    }
    .xiezi {
      margin: 100px 0px;
      .title {
        width: 100%;
        font-size: 25px;
        border-left: 2px solid red;
        display: flex;
        justify-content: space-between;
        margin: 20px 0px;
      }
      .el-card img {
        &:hover {
          transform: scale(1.2);
          transition: 1.2s;
          cursor: pointer;
        }
      }
      .time {
        font-size: 13px;
        color: #999;
      }

      .bottom {
        margin-top: 13px;
        line-height: 12px;
      }

      .button {
        padding: 0;
        float: right;
      }

      .image {
        width: 100%;
        display: block;
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
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
  .el-divider--vertical {
    height: auto;
  }
  .el-carousel.el-carousel--horizontal.el-carousel--card {
    width: 100%;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
</style>
