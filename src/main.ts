import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import _ from 'lodash'
import Elementui, { Message, MessageBox } from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/common.scss'

Vue.config.productionTip = false

Vue.use(Elementui)
Vue.use(_)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

// Vue.prototype.showMessageBox =  (message: string, type?: string, duration?: number) => {
//   this.$message({
//     message: message,
//     type: type || 'info',
//     duration: duration || '4000',
//     showClose: true,
//     closeOnPressEscape: true,
//     customClass: 'custom-messagebox',
//     dangerouslyUseHTMLString: true
//   })
// }

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
