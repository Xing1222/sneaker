<template>
  <div class="forum">
    <headers :active="active" />
    <div style="display:flex;width:80%;margin:0 auto">
      <div class="left">
        <el-row class="tac">
          <el-menu default-active="0" class="el-menu-vertical-demo" background-color="#fdfdfd" text-color="#000000" active-text-color="#ffd04b" style="min-height: 800px;" @select="handleSelect" @close="handleClose">
            <el-menu-item v-for="(item,index) in classLists" :key="index" :index="index+''" @click="changeType(item)">
              <i class="el-icon-document" />
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-row>
      </div>
      <div class="right">
        <div class="title">
          <div>
            <span style="margin:0px 15px">
              {{ title }}
            </span>
            <el-button v-if="flagFollow!==false" type="danger" size="mini" plain @click="showLike">
              取消板块
            </el-button>
            <el-button v-else type="success" size="mini" plain @click="showLike('add')">
              关注板块
            </el-button>
          </div>
          <el-button type="success" size="mini" @click.stop="showLayer({ component: 'add', title: '新增帖子', type: 'add' })">
            发帖
          </el-button>
        </div>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="板块介绍" name="1">
            <div class="introduce">
              本版介绍：<span>{{ introduction }}</span>
            </div>
            <div class="time">
              开版时间：<span>{{ time }}</span>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-form ref="filterForm" :model="filterForm" label-width="100px" :inline="true" style="display: flex;align-items: center;justify-content: space-around;">
          <el-form-item label="文章搜索：" style="margin: 20px 0px">
            <el-input v-model="filterForm.title" placeholder="输入关键字搜索" style="width:200px;display:flex" />
          </el-form-item>
          <el-form-item label="文章话题：" style="margin: 20px 0px">
            <el-input v-model="filterForm.conversation" placeholder="输入关键字搜索" style="width:200px;display:flex" />
          </el-form-item>
          <el-button type="success" @click="init(1, 'pageNum',typeId)">
            搜索
          </el-button>
        </el-form>
        <el-table v-loading="listLoading" :data="tableList" style="width: 100%">
          <el-table-column label="封面" sortable align="center">
            <template slot-scope="scope">
              <el-image v-if="scope.row.imageUrl" fit="cover" :src="scope.row.imageUrl" :preview-src-list="scope.row.previewLists" />
              <el-image v-else fit="cover">
                <div slot="error" class="image-slot" style="font-size: 32px;">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="标题" sortable align="center">
            <template slot-scope="scope">
              <router-link :to="{name:'forumDetails',params:{ lists:JSON.stringify(scope.row),typeId:typeId }}" style="color:red">
                {{ scope.row.title }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="话题" prop="conversation" sortable align="center" />
          <el-table-column label="作者" prop="author" sortable align="center" />
          <el-table-column label="回复" prop="replyNum" sortable align="center" />
          <el-table-column label="创建时间" prop="time" sortable align="center" />
          <el-table-column label="是否收藏" sortable align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.collection===false" type="success" size="mini" plain @click="collection(scope.row,'add')">
                收藏
              </el-button>
              <el-button v-else type="danger" size="mini" plain @click="collection(scope.row)">
                取消收藏
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination :current-page="filterForm.pageNum" :page-sizes="[10,20,50]" :page-size="pager.pageSize" :total="pager.pageCount" background layout="total, sizes, prev, pager, next, jumper" @size-change="init($event, 'pageSize',typeId)" @current-change="init($event, 'pageNum',typeId)" />
        </div>
      </div>
      <!-- <div class="mostRight">
        <div class="title">
          <span style="margin-left:10px">
            热门推荐
          </span>
        </div>
        <div class="box">
          <img v-for="(item,index) in lists" :key="index" :src="item.src" alt="" width="45%">
        </div>
      </div> -->
      <div class="demo-block">
        <el-dialog :title="layerData.title" :visible.sync="drawer">
          <div v-if="drawer" class="body-content">
            <component :is="layerData.component" ref="layerDataComponent" :prop-data="layerData.data" :type-id="typeId" :prop-type="layerData.type" @dataInit="init(1, 'pageNum',typeId)" />
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
import { mapGetters } from 'vuex'
import { selectClassification, selectPosts, addFollow, selectFollow, delFollow, addCollection, selectMineCollection, delCollection } from '@/api/posts.js'
export default {
  components: {
    headers,
    footers,
    add
  },
  data() {
    return {
      active: '3',
      activeNames: ['1'],
      search: '',
      listLoading: false,
      classLists: [],
      title: '',
      introduction: '',
      typeId: '',
      time: '',
      lists: [
        { src: require('../assets/1.jpg') },
        { src: require('../assets/2.jpg') },
        { src: require('../assets/3.jpg') },
        { src: require('../assets/4.jpg') },
        { src: require('../assets/5.jpg') },
        { src: require('../assets/5.jpg') },
        { src: require('../assets/3.jpg') },
        { src: require('../assets/4.jpg') }
      ],
      form: {},
      filterForm: {
        conversation: '',
        title: '',
        pageNum: 1,
        pageSize: 20
      }, // 筛选信息
      pager: {
        totalPage: 1,
        pageSize: 20,
        pageCount: 100
      }, // 分页信息
      drawer: false,
      layerComponent: 'add',
      layerData: {
        title: 'personnelCreation',
        data: {}
      },
      tableList: [{}],
      userInfo: '',
      flagFollow: false,
      flag: false,
      followId: '',
      delId: '',
      collectionLists: []
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    selectClassification().then(res => {
      this.classLists = res.data.lists
      this.title = this.classLists[0].name
      this.introduction = this.classLists[0].introduction
      this.time = this.classLists[0].time
      this.followId = this.classLists[0].id
      this.typeId = this.classLists[0].id
      this.init(1, 'pageNum', this.classLists[0].id)
    })
    this.selectFollow()
  },
  methods: {
    // 增删收藏
    collection(row, type) {
      console.log(row)
      if (type === 'add') {
        const postData = this.qs.stringify({
          postsId: row.id,
          title: row.title,
          conversation: row.conversation,
          author: row.author,
          authorImg: row.authorImg,
          imageUrl: row.imageUrl,
          content: row.content,
          replyNum: row.replyNum,
          time: row.time,
          userId: this.userInfo.id
        })
        addCollection(postData)
          .then(res => {
            this.$message({
              type: 'success',
              message: '收藏成功'
            })
            this.init(1, 'pageNum', this.typeId)
          })
      } else {
        const postData = this.qs.stringify({
          userId: this.userInfo.id,
          postsId: row.id
        })
        delCollection(postData).then(res => {
          this.$message({
            type: 'success',
            message: '取消成功'
          })
          this.init(1, 'pageNum', this.typeId)
        })
      }
    },
    selectFollow() {
      selectFollow().then(res => {
        // flagFollow
        if (res.data.lists.length > 0) {
          const plateIdlist = []
          const userIdlist = []
          res.data.lists.forEach(item => {
            plateIdlist.push(item.plateId)
            userIdlist.push(item.userId)
          })
          console.log(plateIdlist, userIdlist, plateIdlist.indexOf(this.followId) !== -1, userIdlist.indexOf(this.userInfo.id) !== -1)
          if (plateIdlist.indexOf(this.followId) !== -1 && userIdlist.indexOf(this.userInfo.id) !== -1) {
            // this.delId = item.id
            res.data.lists.forEach(item => {
              if (item.plateId === this.followId) {
                this.delId = item.id
              }
            })
            this.flagFollow = true
            // this.flag = true
            console.log(2222222222222222, this.followId)
          } else {
            console.log(11111111111)
            this.flagFollow = false
          }
        }
      })
    },
    async init(value, type, id) {
      // this.listLoading = true
      this.drawer = false
      if (type) {
        this.filterForm[type] = value || 1
      }
      if (type !== 'pageNum') {
        this.filterForm.pageNum = 1
      }
      console.log(value, type, id, '呜呜呜呜呜呜呜呜无无无无无无无')
      const postData = this.qs.stringify({
        title: this.filterForm.title,
        conversation: this.filterForm.conversation,
        type: id,
        pageNum: this.filterForm.pageNum,
        pageSize: this.filterForm.pageSize
      })
      selectPosts(postData)
        .then(res => {
          this.listLoading = false
          this.tableList = res.data.lists
          this.tableList.forEach(item => {
            const list = []
            list.push(item.imageUrl)
            this.$set(item, 'previewLists', list)
            this.$set(item, 'collection', false)
          })
          this.pager.pageCount = res.data.pageCount || 0
          this.pager.totalPage = res.data.totalPage || 0
          this.pager.pageSize = res.data.pageSize || this.pager.pageSize
        }).then(res => {
          selectMineCollection().then(res => {
            this.collectionLists = res.data.lists
            console.log(this.collectionLists, this.tableList)
            const list = []
            this.collectionLists.forEach(item => {
              console.log(item, '1111')
              list.push(item.postsId)
            })
            console.log(list, 'zzzzzzzzz')
            this.tableList.forEach(item => {
              this.collectionLists.forEach(e => {
                if (list.indexOf(item.id) !== -1 && e.userId === this.userInfo.id) {
                  console.log(e, item, this.userInfo.id, 'aaaa')
                  item.collection = true
                }
              })
            })
          })
        })
        .catch(() => {
          this.listLoading = false
        })
      console.log('刷新')
    },
    showLike(type) {
      if (!this.token) {
        this.$message({
          type: 'error',
          message: '请先登录'
        })
        return
      }
      if (type === 'add') {
        const postData = this.qs.stringify({
          userId: this.userInfo.id,
          plateId: this.followId,
          introduction: this.introduction,
          title: this.title
        })
        addFollow(postData).then(res => {
          this.$message({
            type: 'success',
            message: '关注成功'
          })
          this.selectFollow()
        })
      } else {
        const postData = this.qs.stringify({
          id: this.delId
        })
        delFollow(postData).then(res => {
          this.$message({
            type: 'success',
            message: '取消成功'
          })
          this.selectFollow()
        })
      }
    },
    // 抽屉显示
    showLayer(options) {
      if (!this.token) {
        this.$message({
          type: 'error',
          message: '请先登录'
        })
        return
      }
      this.layerData.component = options.component
      this.layerData.title = options.title
      this.layerData.data = options.row || {}
      this.layerData.type = options.type || ''
      this.layerData.type = options.type || ''
      this.drawer = true
      console.log(options)
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleChange(val) {
      console.log(val)
    },
    changeType(item) {
      console.log(item)
      // const postData = this.qs.stringify({
      //   type: id,
      // })
      this.typeId = item.id
      this.init(1, 'pageNum', item.id)
    },
    handleSelect(key, keyPath, classLists) {
      console.log(classLists, key, keyPath)
      this.title = this.classLists[key].name
      this.introduction = this.classLists[key].introduction
      this.time = this.classLists[key].time
      this.followId = this.classLists[key].id
      this.selectFollow()
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="scss">
.forum {
  .left {
    width: 15%;
    .el-menu-item:hover {
      color: #fff !important;
      background-color: rgb(255, 208, 75) !important;
      transition: 0.5s;
    }
  }
  .right {
    width: 70%;
    padding: 0px 20px;
    .title {
      width: 100%;
      font-size: 23px;
      border-left: 2px solid red;
      margin: 20px 0px;
      text-align: left;
      display: flex;
      justify-content: space-between;
    }
    .introduce {
      text-align: left;
      font-size: 16px;
    }
    .time {
      text-align: left;
      font-size: 16px;
      span {
        color: red;
      }
    }
    .el-collapse-item__header {
      font-size: 18px;
    }
    .el-pagination.is-background {
      margin-top: 20px;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: rgb(255, 208, 75) !important;
    }
  }
  .mostRight {
    width: 15%;
    .title {
      width: 100%;
      height: 28px;
      font-size: 18px;
      border-left: 2px solid red;
      display: flex;
      justify-content: space-between;
      margin: 20px 0px;
    }
    .box {
      // display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }
  }
}
</style>
