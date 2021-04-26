/*
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2020-09-21 20:26:17
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-04-27 00:34:22
 * @FilePath: \vue2-ts\src\main.ts
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import _ from 'lodash'
import VueCookies from 'vue-cookies'
import { getToken, removeToken } from './utils/auth'
import Element, { Message, MessageBox } from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/common.scss'
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

Vue.use(Element)
Vue.use(_)
Vue.use(VueCookies)

Vue.prototype.$message = Message
Vue.prototype.$cookies = VueCookies
Vue.prototype.$confirm = MessageBox.confirm

Vue.prototype.showMessageBox = (message: string, type?: string, duration?: number) => {
  Vue.prototype.$message({
    message: message,
    type: type || 'info',
    duration: duration || '4000',
    showClose: true,
    closeOnPressEscape: true,
    customClass: 'custom-messagebox',
    dangerouslyUseHTMLString: true
  })
}

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (getToken()) {
    // if (to.path === '/') removeToken()
    next()
  } else {
    if (to.path === '/') {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      removeToken()
      next()
    } else {
      next('/')
    }
  }
})

export default vm
