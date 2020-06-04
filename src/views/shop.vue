<template>
  <div class="shop">
    <headers :active="active" />
    <div v-for="(item,index) in newLists" :key="index" class="xiezi">
      <div class="title">
        <span style="margin-left:10px">
          {{ item.type }}
        </span>
        <el-link>更多<i class="el-icon-arrow-right el-icon--right" /></el-link>
      </div>
      <div style="display:flex;justify-content: space-between;flex-direction: row;flex-wrap: wrap;">
        <el-card v-for="(k,i) in item.goods" :key="i" :body-style="{ padding: '0px',height:'100%' }" shadow="hover" style="width:21%;cursor: pointer;margin-bottom: 10px; min-height: 385px;">
          <div v-if="index<=7" style="height:100%">
            <router-link :to="{name:'shopInfo',params:{lists:k}}">
              <div style="height:75%;overflow: hidden;flex-wrap: wrap;display: flex;align-items: center;">
                <img :src="k.imageUrl.split(',')[0]" class="image" style="">
              </div>
              <div style="padding: 14px;">
                <span>{{ k.name }}</span>
                <div class="bottom clearfix">
                  <time class="time">￥{{ k.price }}</time>
                </div>
              </div>
            </router-link>
          </div>
        </el-card>
      </div>
    </div>
    <footers />
  </div>
</template>
<script>
import headers from '@/components/header.vue'
import footers from '@/components/footer.vue'
import { selectGoods, classificationLists } from '@/api/goods.js'
export default {
  components: {
    headers,
    footers
  },
  data() {
    return {
      active: '2',
      goodsLists: [],
      classLists: [],
      newLists: []
    }
  },
  created() {
    this.selectGoods()
  },
  methods: {
    selectGoods() {
      const postData = this.qs.stringify({
        pageNum: 1,
        pageSize: 99999
      })
      selectGoods(postData)
        .then(res => {
          this.goodsLists = res.data.lists
          const postData = this.qs.stringify({
            pageNum: 1,
            pageSize: 99999
          })
          classificationLists(postData).then(item => {
            this.classLists = item.data.lists
            const list = []
            for (const i in this.classLists) {
              list.push({ type: this.classLists[i].name })
              list[i].goods = []
              for (const k in this.goodsLists) {
                if (this.classLists[i].id === this.goodsLists[k].type) {
                  list[i].goods.push(this.goodsLists[k])
                }
              }
            }
            console.log(list, 'listzzzzzzzzzzzz')
            this.newLists = list
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.shop {
  .xiezi {
    margin: 100px auto;
    width: 80%;
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
</style>
