import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/layout',
    name: 'Layout',
    component: () => import(/* webpackChunkName: "about" */ '../views/layout/index.vue'),
    redirect: '/echarts',
    children: [
      {
        path: '/echarts',
        name: 'Echarts',
        component: () => import('../views/charts/echarts.vue')
      },
      {
        path: '/monoca',
        name: 'Monoca',
        component: () => import('../views/charts/monoca.vue')
      },
      {
        path: '/table1',
        name: 'Table1',
        component: () => import('../views/table/table1.vue')
      },
      {
        path: '/table2',
        name: 'Table2',
        component: () => import('../views/table/table2.vue')
      },
      {
        path: '/manage1',
        name: 'Manage1',
        component: () => import('../views/manage/manage1.vue')
      },
      {
        path: '/manage2',
        name: 'Manage2',
        component: () => import('../views/manage/manage2.vue')
      },
      {
        path: '/setting',
        name: 'Setting',
        component: () => import('../views/setting/setting.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
