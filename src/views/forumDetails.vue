<template>
  <div class="forumDetails">
    <headers :active="active" />
    <!-- eslint-disable -->
    <div style="display:block">
      <div class="user">
        <el-avatar :size="80" :src="dataLists.authorImg"></el-avatar>
        <span>{{dataLists.author}}</span>
      </div>
      <div class="title">
        <h1>
          {{dataLists.title}}
        </h1>
      </div>
      <div class="time">
        创建日期：<span>{{dataLists.time}}</span>
      </div>
    </div>
    <div v-html="lists.content" style="margin:50px" class="htmlBox" />
    <div v-if="classLists[0]">
      <comment v-if="(classLists[0].appraiser === '1') && (userInfo.supplyflag === '1')" commentWidth="100%" @doSend="doSend" @doChidSend="doChidSend" :authorId="dataLists.userId" label="作者" :commentList="commentList" :commentNum="commentNum" :avatar="userInfo.img"></comment>
      <comment v-if="classLists[0].appraiser === '0'" commentWidth="100%" @doSend="doSend" @doChidSend="doChidSend" :authorId="dataLists.userId" label="作者" :commentList="commentList" :commentNum="commentNum" :avatar="userInfo.img"></comment>
    </div>
    <!-- <comments :pageData="pageData" mainColor="#000000" @submit="submit"></comments> -->
    <footers />
  </div>
</template>
<script>
import headers from '@/components/header.vue'
import footers from '@/components/footer.vue'
import { infoPosts, replyPosts, selectReplyPosts, replyChildPosts, selectCommentNum, selectClassification } from '@/api/posts.js'
// import { infoPosts, replyPosts, selectReplyPosts } from '@/api/posts.js'

import comment from 'hbl-comment'
// import Comments from 'vue-comments'

export default {
  name: 'Dashboard',
  components: {
    headers,
    footers,
    comment
  },
  data() {
    return {
      active: '3',
      dataLists: [],
      lists: '',
      userInfo: '',
      commentList: [],
      commentNum: 0,
      classLists: []
    }
  },
  watch: {
    // route.push进来后没有执行获取数据的方法可以watch下路由，有变化后再次获取数据，而不是靠刷新一次来获取数据
    $route(from, to) {
      console.log(from, to, '111111111111')
      if (from.path === '/forumDetails') {
        this.init()
      }
    }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    selectClassification(this.qs.stringify({ id: this.$route.params.typeId })).then(res => {
      this.classLists = res.data.lists
      console.log(this.classLists[0].appraiser, 'asfasfasfasf')
    })
    if (this.$route.params.lists !== undefined) {
      localStorage.setItem('forumDetails', this.$route.params.lists)
      localStorage.setItem('typeId', this.$route.params.typeId)
    }
    if (this.$route.params.nameFrom !== undefined) {
      localStorage.setItem('nameFrom', this.$route.params.nameFrom)
      localStorage.setItem('typeId', this.$route.params.typeId)
    }
    // this.dataLists = JSON.parse(this.$route.params.lists)
    console.log('this.$route.params.lists')
    this.dataLists = this.$route.params.lists === undefined ? JSON.parse(localStorage.getItem('forumDetails')) : JSON.parse(this.$route.params.lists)
    console.log(this.dataLists, 'this.dataLists')
    if ((this.$route.params.nameFrom === undefined ? localStorage.getItem('nameFrom') : this.$route.params.nameFrom) === 'mineCollection') {
      console.log('来自收藏')
      infoPosts(this.qs.stringify({ id: this.dataLists.postsId })).then(res => {
        this.lists = res.data.lists
      })
    } else {
      infoPosts(this.qs.stringify({ id: this.dataLists.id })).then(res => {
        this.lists = res.data.lists
      })
    }
    this.init()
  },
  destroyed() {
    localStorage.setItem('typeId', '')
    localStorage.setItem('nameFrom', '')
  },
  methods: {
    async init() {
      // const =postData
      var postData
      if ((this.$route.params.nameFrom === undefined ? localStorage.getItem('nameFrom') : this.$route.params.nameFrom) === 'mineCollection') {
        postData = this.qs.stringify({
          'articleId': this.$route.params.lists === undefined ? JSON.parse(localStorage.getItem('forumDetails')).postsId : JSON.parse(this.$route.params.lists).postsId
        })
      } else {
        postData = this.qs.stringify({
          'articleId': this.dataLists.id
        })
      }
      selectReplyPosts(postData).then(res => {
        console.log(res.data.lists)
        res.data.lists.map((item, index) => {
          item.commentUser = JSON.parse(res.data.lists[index].commentUser)
          item.targetUser = JSON.parse(res.data.lists[index].targetUser)
          item.childrenList = item.childrenList === null ? [] : JSON.parse(item.childrenList)
        })
        this.commentList = res.data.lists
        this.commentNum = res.data.pageCount
      })
    },
    // 评论
    doSend(content) {
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
      const commentUser = {
        'id': Number(JSON.parse(sessionStorage.getItem('userInfo')).id),
        'nickName': JSON.parse(sessionStorage.getItem('userInfo')).username,
        'avatar': JSON.parse(sessionStorage.getItem('userInfo')).img
      }
      const commentUserJSON = JSON.stringify(commentUser)
      const targetUser = {
        'id': this.dataLists.userId,
        'nickName': this.dataLists.author,
        'avatar': this.dataLists.authorImg
      }
      const targetUserJSON = JSON.stringify(targetUser)
      console.log(nowDate)
      var postData
      if ((this.$route.params.nameFrom === undefined ? localStorage.getItem('nameFrom') : this.$route.params.nameFrom) === 'mineCollection') {
        postData = this.qs.stringify({
          'commentUser': commentUserJSON,
          'targetUser': targetUserJSON,
          'content': content,
          'createDate': nowDate,
          'childrenList': '[]',
          'articleId': this.dataLists.postsId,
          'commentNum': this.commentNum
        })
      } else {
        postData = this.qs.stringify({
          'commentUser': commentUserJSON,
          'targetUser': targetUserJSON,
          'content': content,
          'createDate': nowDate,
          'childrenList': '[]',
          'articleId': this.dataLists.id,
          'commentNum': this.commentNum
        })
      }
      replyPosts(postData).then(res => {
        this.$message({
          type: 'success',
          message: '评论成功',
          onClose: () => {
            var postNum
            if ((this.$route.params.nameFrom === undefined ? localStorage.getItem('nameFrom') : this.$route.params.nameFrom) === 'mineCollection') {
              postNum = this.qs.stringify({
                'id': this.dataLists.postsId,
                'commentNum': this.commentNum + 1
              })
            } else {
              postNum = this.qs.stringify({
                'id': this.dataLists.id,
                'commentNum': this.commentNum + 1
              })
            }
            selectCommentNum(postNum).then(res => {
              console.log('成功')
            })
            this.init()
          }
        })
        console.log('sss')
      })
      console.log(content)
    },
    // 回复
    doChidSend(content, bid, pid) {
      console.log(content, bid, pid)
      var name = ''
      var imgName = ''
      this.commentList.forEach(item => {
        console.log(item.commentUser)
        if (bid === item.commentUser.id) {
          name = item.commentUser.nickName
          imgName = item.commentUser.avatar
        }
      })
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
      const commentUser = {
        'id': Number(JSON.parse(sessionStorage.getItem('userInfo')).id),
        'nickName': JSON.parse(sessionStorage.getItem('userInfo')).username,
        'avatar': JSON.parse(sessionStorage.getItem('userInfo')).img
      }
      const targetUser = {
        'id': bid,
        'nickName': name,
        'avatar': imgName
      }
      this.commentList.forEach(item => {
        if (item.id === pid) {
          item.childrenList.push({
            'commentUser': commentUser,
            'targetUser': targetUser,
            'content': content,
            'createDate': nowDate,
            'childrenList': '[]',
            'articleId': this.dataLists.id
          })
          const postData = this.qs.stringify({
            id: pid,
            lists: JSON.stringify(item.childrenList)
          })
          replyChildPosts(postData).then(res => {
            this.$message({
              type: 'success',
              message: '评论成功',
              onClose: () => {
                this.init()
              }
            })
            console.log('sss')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.forumDetails {
  .hbl-comm,
  .hbl-child,
  .comm {
    width: 80%;
    margin: 0 auto;
  }
  .user {
    display: flex;
    align-items: center;
    width: 60%;
    margin: 50px auto;
    margin-bottom: 0px;
    font-size: 18px;
  }
  .time {
    display: flex;
    margin: 0 auto;
    width: 60%;
    justify-content: flex-end;
    font-size: 13px;
  }
  .title {
    margin: 0 auto;
    width: 60%;
    h1 {
      font-size: 27px;
    }
  }
  .htmlBox {
    height: auto;
    ::v-deep div {
      width: 80% !important;
      margin: 0 auto !important;
      float: none !important;
    }
  }
}
</style>
