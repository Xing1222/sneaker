<template>
  <div class="shopInfo">
    <headers :active="active" />
    <div class="infoBox">
      <div class="left">
        <div class="imageBox">
          <!-- <div style="display:flex;justify-content: center;"> -->
          <div v-if="goodsInfo.imageUrl">
            <img :src="goodsInfo.imageUrl.split(',')[0]" alt="" width="80%">
          </div>
          <div v-if="goodsInfo.imageUrl" style="display:flex;width:80%;margin:10px auto">
            <el-image v-for="(item,index) in goodsInfo.imageUrl.split(',')" :key="index" :style="{width: '19%',marginRight:(index===4?'0px':'3%')}" :src="item" :preview-src-list="goodsInfo.imageUrl.split(',')" />
          </div>
        </div>
      </div>
      <div class="right">
        <h1>{{ goodsInfo.name }}</h1>
        <el-divider />
        <div style="display:flex;justify-content: space-between;margin: 10px 0px;">
          <h3>
            累计销量：{{ goodsInfo.num }}
          </h3>
        </div>
        <div class="pricebox">
          <span class="title">
            价格
          </span>
          <h1 class="price">
            售价：￥{{ goodsInfo.price }}
          </h1>
        </div>
        <div class="pricebox">
          <span class="title">配送</span>
          <el-cascader v-model="addCode" :options="areas" :props="{ label: 'name', value: 'code' }" placeholder="请选择配送地址" filterable />
          <!-- <span class="title" style="margin-left: 20px;"> 快递￥12</span> -->
          <p style="margin-top:10px">
            详细地址
            <el-input v-model="address" placeholder="请输入详细地址" style="width:300px;margin-left:8px" />
          </p>
        </div>
        <el-divider />
        <div class="choose">
          <span class="title">颜色</span>
          <el-radio-group v-model="color" size="small">
            <el-radio v-for="(item,index) in JSON.parse(goodsInfo.color)" :key="index" :label="item.color" border>
              {{ item.color }}
            </el-radio>
          </el-radio-group>
        </div>
        <div class="choose">
          <span class="title">码数</span>
          <el-radio-group v-model="size" size="small">
            <el-radio v-for="(item,index) in JSON.parse(goodsInfo.size)" :key="index" :label="item.size" border>
              {{ item.size }}
            </el-radio>
          </el-radio-group>
        </div>
        <div class="choose">
          <span class="title">数量</span>
          <el-input-number v-model="num" size="small" :min="1" label="描述文字" />
        </div>
        <div style="display:flex;margin-top:20px">
          <el-button type="primary" style="color: #E5511D !important;border-color: #F0CAB6!important;background: #FFE4D0!important;" @click="pay">
            立即付款
          </el-button>
          <el-button type="primary" icon="el-icon-shopping-cart-full" style="color: #FFF!important;border-color: #F40!important;background: #F40!important;" @click="intoCar">
            加入购物车
          </el-button>
        </div>
        <el-drawer title="购物车" :visible.sync="drawer" direction="rtl">
          <div v-for="(item,index) in car" :key="index" class="shop">
            <el-image style="width:30%" :src="item.imageUrl" fit="contain" />
            <div style="width:60%;">
              <div style="display:flex;justify-content: space-between;margin-bottom:12px">
                <div>
                  <p style="font-size: 16px;text-align:left">
                    {{ item.title }}
                  </p>
                  <p style="text-align:left;font-size: 14px;">
                    码数：{{ item.size }}
                  </p>
                  <p style="text-align:left;font-size: 14px;">
                    颜色：{{ item.color }}
                  </p>
                </div>
                <el-button type="danger" size="mini" style="height:30px;" @click="del(item)">
                  删除
                </el-button>
              </div>
              <div style="display:flex;justify-content: space-between;align-items: center;">
                <p style="color: red;font-size: 16px;">
                  ￥{{ item.price }}
                </p>
                <el-input-number v-model="item.num" size="mini" :min="1" label="描述文字" style="width:120px" />
              </div>
            </div>
          </div>
          <div style="display:flex;justify-content: flex-end;margin-right:15px;font-size:23px">
            <div>
              <span style="color:red">
                总价：
              </span>
              ￥{{ allPrice }}
            </div>
          </div>
          <el-button type="primary" style="color: #E5511D !important;border-color: #F0CAB6!important;background: #FFE4D0!important;" @click="pay">
            立即付款
          </el-button>
        </el-drawer>
      </div>
    </div>
    <!-- <div class="infoitro">
      <el-divider />
    </div> -->
    <footers />
  </div>
</template>
<script>
import headers from '@/components/header.vue'
import footers from '@/components/footer.vue'
import area from '@/utils/area.json'
export default {
  components: {
    headers,
    footers
  },
  data() {
    return {
      active: '2',
      areas: area,
      size: '',
      color: '',
      num: 1,
      drawer: false,
      addCode: '',
      address: '',
      goodsInfo: '',
      car: [],
      lists: [
        require('../assets/1.jpg'),
        require('../assets/2.jpg'),
        require('../assets/3.jpg'),
        require('../assets/4.jpg'),
        require('../assets/5.jpg')
      ]
    }
  },
  computed: {
    allPrice() {
      if (this.car.length > 0) {
        var all = 0
        for (const i in this.car) {
          all = this.car[i].price * this.car[i].num + all
        }
      }
      return all
    }
  },
  created() {
    this.car = JSON.parse(localStorage.getItem('car'))
    console.log(this.$route.params.lists, 'this.$route.params.lists')
    if (this.$route.params.lists !== undefined) {
      this.goodsInfo = this.$route.params.lists
      localStorage.setItem('goodsInfo', JSON.stringify(this.$route.params.lists))
    } else {
      this.goodsInfo = JSON.parse(localStorage.getItem('goodsInfo'))
    }
    this.init()
  },
  destroyed() {
    localStorage.setItem('goodsInfo', '')
  },
  methods: {
    del(list) {
      console.log(list)
      for (const i in this.car) {
        if (list.id === this.car[i].id) {
          this.car.splice(i, 1)
          localStorage.setItem('car', JSON.stringify(this.car))
        }
      }
    },
    pay() {
      this.$message({
        type: 'success',
        message: '付款成功'
      })
    },
    init() {
      console.log(this.goodsInfo, 'goodsInfo')
    },
    intoCar() {
      // if (!this.addCode || !this.address) {
      //   this.$message({
      //     type: 'error',
      //     message: '请填写完整地址信息'
      //   })
      //   return
      // }
      if (!this.color || !this.size) {
        this.$message({
          type: 'error',
          message: '请选择颜色或者码数'
        })
        return
      }
      this.drawer = true
      const obj = {}
      obj.id = this.goodsInfo.id
      obj.imageUrl = this.goodsInfo.imageUrl.split(',')[0]
      obj.title = this.goodsInfo.name
      obj.size = this.size
      obj.color = this.color
      obj.price = this.goodsInfo.price
      obj.num = this.num
      // console.log(obj, 'arr')
      const arr = JSON.parse(localStorage.getItem('car'))
      if (arr.length === 0) {
        arr.push(obj)
        localStorage.setItem('car', JSON.stringify(arr))
        this.car = JSON.parse(localStorage.getItem('car'))
      } else {
        for (const i in arr) {
          if (arr[i].id === obj.id) {
            this.$notify.info({
              type: 'info',
              message: '该商品已添加至购物车',
              position: 'top-left'
            })
            return
          }
        }
        arr.push(obj)
        localStorage.setItem('car', JSON.stringify(arr))
        this.car = JSON.parse(localStorage.getItem('car'))
      }
    }
  }
}
</script>
<style lang="scss">
.shopInfo {
  .infoBox {
    width: 80%;
    margin: 50px auto;
    min-height: 800px;
    display: flex;
    .left {
      width: 40%;
    }
    .right {
      .el-drawer__header span {
        outline: none !important;
        text-align: left;
        font-size: 23px;
      }
      width: 60%;
      .pricebox {
        background-color: #fff2e8;
        padding: 10px;
        vertical-align: middle;
        padding-right: 5px;
        text-align: left;
        .title {
          display: inline-block;
          width: 60px;
          color: #6c6c6c;
          text-align: left;
        }
        .price {
          font-size: 24px;
          font-weight: 700;
          font-family: Tahoma, Arial, Helvetica, sans-serif;
          color: #f40;
          display: inline-block;
        }
      }
      .choose {
        padding: 10px;
        vertical-align: middle;
        padding-right: 5px;
        text-align: left;
        .title {
          display: inline-block;
          width: 60px;
          color: #6c6c6c;
          text-align: left;
        }
      }
      // background-color: lightcoral;
      h1 {
        font-size: 22px;
      }
      .el-divider {
        background-color: #cccccc !important;
      }
      .shop {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 20px;
        align-items: center;
      }
    }
  }
  .infoitro {
    width: 80%;
    margin: 50px auto;
    min-height: 800px;
    display: flex;
  }
  .el-drawer.rtl {
    overflow-y: scroll;
  }
}
</style>
