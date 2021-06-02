/*
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2020-09-21 20:26:17
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-06-02 22:32:31
 * @FilePath: \vue2-ts\src\router\index.ts
 */
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
    redirect: '/rent/datasearch',
    children: [
      {
        path: '/rent/datasearch',
        name: 'Dataserach',
        component: () => import('../views/rent/datasearch.vue')
      },
      {
        path: '/rent/searchResult:keyword?',
        name: 'Rearchresult',
        component: () => import('../views/rent/searchResult.vue')
      },
      {
        path: '/rent/register',
        name: 'Register',
        component: () => import('../views/rent/register.vue')
      },
      {
        path: '/rent/detail:id?:type?',
        name: 'Registerdetail',
        component: () => import('../views/rent/detail.vue')
      },
      {
        path: '/system/role',
        name: 'Systemrole',
        component: () => import('../views/system/role.vue')
      },
      {
        path: '/system/user',
        name: 'Systemuser',
        component: () => import('../views/system/user.vue')
      },
      {
        path: '/system/region',
        name: 'Systemregion',
        component: () => import('../views/system/region.vue')
      },
      {
        path: '/system/position',
        name: 'Systemposition',
        component: () => import('../views/system/position.vue')
      },
      {
        path: '/system/unit',
        name: 'Systemunit',
        component: () => import('../views/system/unit.vue')
      },
      {
        path: '/system/log',
        name: 'Systemlog',
        component: () => import('../views/system/log.vue')
      },
      {
        path: '/system/banner',
        name: 'Systembanner',
        component: () => import('../views/system/banner.vue')
      },
      {
        path: '/system/dictionary',
        name: 'Systemdictionary',
        component: () => import('../views/system/dictionary.vue')
      },
      {
        path: '/system/tenant',
        name: 'Systemtenant',
        component: () => import('../views/system/tenant.vue')
      },
      {
        path: '/system/approve',
        name: 'Systemapprove',
        component: () => import('../views/system/approve.vue')
      },
      {
        path: '/system/todo',
        name: 'Systemtodo',
        component: () => import('../views/system/todo.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
