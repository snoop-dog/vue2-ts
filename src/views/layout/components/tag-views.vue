<template>
  <el-container class="tag-container">
    <el-main class="tag-title">
      <el-row class="tag-content">
        <el-col :span="4" class="tag-icon">
          <i :class="Fold ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click.stop="foldSideBar"></i>
        </el-col>
        <el-col :span="20" class="tag-text">
          <span>安邦源</span>
          <!-- <span>安邦源</span> -->
        </el-col>
      </el-row>
    </el-main>

    <el-main class="tag-tab">
      <el-tabs class="tab-content" v-model="activeName" closable @tab-click="handleClick" @tab-remove="removeTab">
        <el-tab-pane :label="item.name" :name="item.url" :key="item.url" v-for="item in tabList">
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <el-main class="tag-toolbox">
      <!-- <el-avatar :size="25" src="../../../assets/logo.png">
        <img src="../../../assets/logo.png"/>
      </el-avatar> -->
      <el-popover
        placement="bottom"
        width="160"
        trigger="hover"
      >
        <el-row class="drop-item" style="display: flex;" @click.native="jumpApprove">
          <el-badge :value="message.approve" class="item" type="warning">
            <el-col :span="6"><i class="iconfont icon-approve"></i></el-col>
            <el-col :span="18">我的审批</el-col>
          </el-badge>
        </el-row>
        <el-row class="drop-item" style="display: flex;" @click.native="jumpTodo">
          <el-badge :value="message.agent" class="item" type="warning">
            <el-col :span="6"><i class="iconfont icon-todo"></i></el-col>
            <el-col :span="18">我的待办</el-col>
          </el-badge>
        </el-row>
        <el-row slot="reference" class="tool-logout message-box">
          <el-badge :value="totalMessage" class="item">
            <i class="el-icon-message-solid"></i>
          </el-badge>
        </el-row>
      </el-popover>
      <el-row class="tool-logout" @click.native='reload'>
        <i class="el-icon-refresh"></i>
      </el-row>
      <el-popover
        placement="bottom"
        width="160"
        trigger="hover"
      >
        <el-row class="drop-item text">{{userInfo.username}}</el-row>
        <el-row class="drop-item text">{{userInfo.role_id_str}}</el-row>
        <el-row class="drop-item" @click.native="editPassword">
          <el-col :span="6"><i class="el-icon-edit"></i></el-col>
          <el-col :span="18">修改密码</el-col>
        </el-row>
        <el-row class="drop-item" @click.native='logout'>
          <el-col :span="6"><i class="el-icon-switch-button"></i></el-col>
          <el-col :span="18">系统退出</el-col>
        </el-row>
        <el-row slot="reference" class="tool-logout">
          <i class="el-icon-s-custom"></i>
        </el-row>
      </el-popover>
    </el-main>

    <my-dialog
      size="small"
      modal
      :visible.sync="showDialog"
      title="修改密码"
      @submit="confirmUpdate"
    >
      <el-form label-width="8rem" label-position="left" class="alarm-form required-form">
        <el-form-item label="旧密码：" class="required">
          <el-input 
            clearable 
            type="password"
            v-model.trim="ruleForm.old_password" 
            placeholder="请输入旧密码"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="新密码：" class="required">
          <el-input 
            clearable 
            type="password"
            v-model.trim="ruleForm.new_password" 
            placeholder="请输入新密码"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码：" class="required">
          <el-input 
            clearable 
            type="password"
            v-model.trim="ruleForm.confirm_password" 
            placeholder="请输入确认密码"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </my-dialog>
  </el-container>
</template>

<script lang="ts">
import { ElMenuItemGroup } from 'element-ui/types/menu-item-group'
import Vue from 'vue'
import { mapState } from 'vuex'
import { removeToken } from '../../../utils/auth'
import md5 from 'js-md5'
import eventBus from '../../../components/event-bus.js'
import myDialog from '@/components/common/layout/layout-dialog.vue'
import { updatePassword } from '@/apis/index'
import { res } from '@/utils/interface'
export default Vue.extend({
  data () {
    return {
      showDialog: false,
      ruleForm: {
        id: '',
        old_password: '',
        new_password: '',
        confirm_password: ''
      },
      message: {
        approve: 0,
        agent: 0
      }
    }
  },
  computed: {
    ...mapState({
      tabList: (state: any) => state.tabList,
      Fold: (state: any) => state.isFold,
      userInfo: (state: any) => state.user
    }),
    activeName: {
      get () {
        return this.$store.state.activeTab
      },
      set (val) {
        return val
      }
    },
    totalMessage () {
      return this.message.approve + this.message.agent
    }
  },
  components: {
    myDialog
  },
  watch: {
    tabList (newval, oldVal) {
      console.log(newval)
      console.log(oldVal)
    }
  },
  created () {
    this.initWebsocket()
  },
  methods: {
    /**
     * @description 点击切换tab
     * @param item tab标签实例
     * @return noen
     */
    handleClick (item: any) {
      this.$store.commit(
        'changeActive',
        item?.name
      )
      this.$router.push(item.name)
      this.reload()
    },
    /**
     * @description: 开发中提示
     * @param {*}
     * @returns {*}
     */    
    waitDep () {
      this.showMessageBox('正在开发中，敬请期待！')
    },
    /**
     * @description: 点击铃铛跳转我的审批
     * @param {*} void
     * @returns {*} none
     */    
    jumpApprove () {
      this.$store.commit(
        'addTabList',
        {
          url: '/system/approve',
          param: {}
        }
      )
      this.$router.push({
        path: '/system/approve'
      })
    },
    /**
     * @description: 点击铃铛跳转我的审批
     * @param {*} void
     * @returns {*} none
     */    
    jumpTodo () {
      this.$store.commit(
        'addTabList',
        {
          url: '/system/todo',
          param: {}
        }
      )
      this.$router.push({
        path: '/system/todo'
      })
    },
    /**
     * @description: 铃铛消息websocket链接
     * @param {*} none
     * @returns {*} void
     */    
    initWebsocket () {
      const _self = this
      const userId = this.$store.state.user.id
      const url = 'ws://47.114.46.149:8766/websocket/taskNum/' + userId
      const ws = new WebSocket(url)

      ws.onopen = (e) => {
        console.log(e)
      }

      ws.onmessage = (e) => {
        console.log(e)
        if (e.data === 'success') return
        const data = JSON.parse(e.data)
        console.log(data)
        _self.message.approve = data.data.approve || 0
        _self.message.agent = data.data.agent || 0
      }

      ws.onclose = (e) => {
        console.log(e)
      }
    },
    /**
     * @description 点击切换tab
     * @param item tab标签实例
     * @return noen
     */
    removeTab (item: string) {
      this.$store.commit(
        'removeTab',
        item
      )
      this.$router.push(this.activeName)
    },
    /**
     * @description: 刷新页面
     * @param {*} none
     * @returns {*} void
     */
    reload () {
      eventBus.$emit('reload-page')
    },
    /**
     * @description 菜单折叠
     * @param none
     * @return none
     */
    foldSideBar () {
      this.$store.commit(
        'foldSideBar',
        !this.$store.state.isFold
      )
    },
    /**
     * @description 注销登录
     * @param none
     * @return none
     */
    logout () {
      this.$confirm('是否登出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeToken()
          this.$store.commit('resetState')
          this.$router.push('/')
        })
        .catch(() => {
          this.$message({
            message: '已取消登出！',
            type: 'info',
            showClose: true
          })
        })
    },
    /**
     * @description: 点击打开修改密码弹框
     * @param {*} none
     * @returns {*} void
     */    
    editPassword () {
      this.showDialog = true
    },
    /**
     * @description: 密码修改参数验证
     * @param {*} none
     * @returns {*} void
     */    
    validParam () {
      if (!this.ruleForm.old_password) {
        this.showMessageBox('请输入老密码！', 'warning')
        return false
      } else if (!this.ruleForm.new_password) {
        this.showMessageBox('请输入新密码！', 'warning')
        return false
      } else if (this.ruleForm.new_password.length < 6) {
        this.showMessageBox('密码长度不能小于6位！', 'warning')
        return false
      } else if (!this.ruleForm.confirm_password) {
        this.showMessageBox('请输入确认密码！', 'warning')
        return false
      } else if (this.ruleForm.new_password !== this.ruleForm.confirm_password) {
        this.showMessageBox('确认密码输入错误！', 'warning')
        return false
      } else {
        return true
      }
    },
    /**
     * @description: 确认提交密码修改
     * @param {*} none
     * @returns {*} void
     */    
    confirmUpdate () {
      if (!this.validParam()) return

      const params = {
        id: this.userInfo.id,
        new_password: md5(this.ruleForm.new_password),
        old_password: md5(this.ruleForm.old_password)
      }

      updatePassword(params).then((res: res) => {
        console.log(res)
        if (res.status === 200) {
          this.showDialog = false
          this.showMessageBox('密码修改成功，请重新登录！', 'success')
          setTimeout(() => {
            removeToken()
            this.$store.commit('resetState')
            this.$router.push('/')
          }, 1000)
        } else {
          this.showMessageBox(res.message, 'error')
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
  .tag-container {
    width: 100%;
    height: 100%;
    display: flex;
    .tag-title {
      flex: 0 0 20rem;
      height: 100%;
      .tag-content {
        height: 100%;
        .el-col {
          height: 100%;
          color: #abd;
          &.tag-icon {
            font-size: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            &:hover {
              color: #37e;
              background: rgba(18, 28, 68, 0.8);
              transition: all 1s linear 0s;
            }
          }
          &.tag-text {
            line-height: 3.2rem;
            font-size: 2rem;
            font-weight: 700;
            letter-spacing: 0.2rem;
            position: relative;
            span {
              width: 100%;
              height: 100%;
              top: 50%;
              left: 50%;
              display: block;
              position: absolute;
              color: #fff;
              transform: translate(-50%, -50%);
              &:nth-child(1) {
                color: #37e;
                // -webkit-text-stroke: 0.1px #37e;
              }
              &:nth-child(2) {
                color: #37e;
                animation: animate 4s ease-in-out 0s infinite;
              }
            }
          }
        }
      }
    }
    /deep/.tag-tab {
      flex: 1;
      height: 100%;
      .el-tabs {
        &__header {
          margin: 0;
        }
        &__nav-wrap {
          display: flex;
          align-items: center;
          &::after {
            background: transparent;
          }
        }
        &__item {
          height: 3.2rem;
          line-height: 3.2rem;
          color: #fff;
          font-size: 1.2rem;
          background: transparent;
          min-width: 6rem;
          padding: 0 1rem;
          &.is-active {
            background: #37e;
          }
          &.is-top {
            &:nth-child(2) {
              .el-icon-close {
                display: none;
              }
            }
          }
        }
        &__active-bar {
          background: #37e;
        }
      }
    }
    .tag-toolbox {
      flex: 0 0 16rem;
      display: flex;
      padding-right: 1.5rem;
      align-items: center;
      justify-content: flex-end;
      .tool-logout {
        flex: 0 0 3.2rem;
        width: 3.2rem;
        height: 100%;
        line-height: 3.2rem;
        font-size: 1.6rem;
        text-align: center;
        cursor: pointer;
        i {
          color: #fff;
          font-weight: 600;
        }
        &:hover {
          background: rgba(18, 28, 68, 0.8);
          i {
            color: #37e;
          }
        }
        &.message-box {
          width: 4rem;
          flex: 0 0 4rem;
          text-align: left;
          text-indent: 0.2em;
          /deep/.el-badge {
            width: 100%;
            height: 100%;
            display: block;
            .el-badge__content {
              &.is-fixed {
                top: 15px;
                right: 33px;
              }
            }
          }
        }
      }
    }
    .modal {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  @keyframes animate {
    0%, 100% {
      clip-path: polygon(1% 15%, 32% 66%, 40% 70%, 69% 70%,86% 62%,97% 57%,100% 54%, 100% 99%, 3% 100%, 1% 50%)
    }
    50% {
      clip-path: polygon(1% 50%, 24% 74%, 40% 64%, 66% 59%,87% 50%,97% 45%,100% 43%, 100% 99%, 3% 100%, 1% 36%)
    }
  }
  .el-popover {
    .drop-item {
      height: 2.33rem;
      line-height: 2.33rem;
      padding: 0 1.5rem;
      cursor: pointer;
      &:hover {
        background: #efefef;
      }
      &.text {
        color: #f23335;
        text-align: center;
        &:hover {
          background: #fff;
        }
      }
      /deep/.el-badge {
        width: 100%;
        height: 100%;
        .el-badge__content {
          &.is-fixed {
            top: 10px;
            right: 15px;
          }
        }
      }
    }
  }
</style>
