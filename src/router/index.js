import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import shop from '../views/shop.vue'
import shopInfo from '../views/shopInfo.vue'
import forum from '../views/forum.vue'
import forumDetails from '../views/forumDetails.vue'
import login from '../views/login.vue'
import mine from '../views/mine.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: {
      name: 'home'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/shop',
    name: 'shop',
    component: shop
  },
  {
    path: '/shopInfo',
    name: 'shopInfo',
    component: shopInfo
  },
  {
    path: '/forum',
    name: 'forum',
    component: forum
  },
  {
    path: '/forumDetails',
    name: 'forumDetails',
    component: forumDetails
  },
  {
    path: '/mine',
    name: 'mine',
    component: mine
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
