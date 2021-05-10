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
        <el-tab-pane :label="item.name" :name="item.url" :key="item.name" v-for="item in tabList">
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <el-main class="tag-toolbox">
      <!-- <el-avatar :size="25" src="../../../assets/logo.png">
        <img src="../../../assets/logo.png"/>
      </el-avatar> -->
      <el-row class="tool-logout" @click.native='reload'>
        <i class="el-icon-refresh"></i>
      </el-row>
      <el-row class="tool-logout" @click.native='logout'>
        <i class="el-icon-switch-button"></i>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { ElMenuItemGroup } from 'element-ui/types/menu-item-group'
import Vue from 'vue'
import { mapState } from 'vuex'
import { removeToken } from '../../../utils/auth'
import eventBus from '../../../components/event-bus.js'
export default Vue.extend({
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      tabList: (state: any) => state.tabList,
      Fold: (state: any) => state.isFold
    }),
    activeName: {
      get () {
        return this.$store.state.activeTab
      },
      set (val) {
        return val
      }
    }
  },
  watch: {
    tabList (newval, oldVal) {
      console.log(newval)
      console.log(oldVal)
    }
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
      flex: 0 0 25rem;
      display: flex;
      padding-right: 0.5rem;
      align-items: center;
      justify-content: flex-end;
      .tool-logout {
        flex: 0 0 3.2rem;
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
      }
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
</style>
