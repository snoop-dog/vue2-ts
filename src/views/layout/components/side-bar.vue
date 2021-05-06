<template>
  <el-container class="sideBar-container">
    <el-main class="sideBar-main">
      <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        text-color="#abd"
        :collapse="isCollapse"
        router
        @select='addTab'>
        <!-- <el-submenu :index="item.name" :key="index" v-for="(item, index) in menuData">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item-group v-for="(it, idx) in item.children" :key="idx">
            <el-menu-item :index="it.name">
              <span slot="title">{{it.name}}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu> -->
        <template>
          <el-menu-item v-for="item in menuData" :index="item.url"  v-if="!item.is_show" :key="item.url">
            <i :class="['iconfont', item.icon_name]"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getMenuData } from '../../../apis/index'
import { res } from '../../../utils/interface'

@Component
export default class Sidebar extends Vue {
  public menuData = []

  // computed
  get defaultActive (): string {
    return this.$store.state.activeTab
  }

  get defaultOpen (): string[] {
    return this.menuData
      .reduce((prev: any, cur: any, index) => {
        prev.push(cur.name)
        return prev
      }, [])
  }

  get isCollapse (): boolean {
    return this.$store.state.isFold
  }

  /**
   * @description 点击菜单
   * @param url 菜单路径
   */
  private addTab (url: string) {
    this.$store.commit(
      'addTabList',
      {
        url: url,
        param: {}
      }
    )
    this.$router.push(url)
  }

  private getMenuData () {
    getMenuData({})
      .then((res: res) => {
        this.menuData = res?.data
        console.log(this.menuData)
        this.$store.dispatch(
          'getMenuData',
          this.menuData
        )
      })
      .catch(err => {
        console.log(err)
      })
  }

  created () {
    this.getMenuData()
  }
}
</script>

<style lang="scss" scoped>
  .sideBar-container {
    width: 100%;
    height: 100%;
    .sideBar-main {
      width: 100%;
      height: 100%;
      /deep/.el-menu {
        border: none;
        background: rgba(18, 28, 68, 0.8);
        padding: 0.5rem 0;
        color: #abd;
        .el-submenu {
          &__title {
            font-size: 1.05rem;
            font-weight: 600;
            height: 3.2rem;
            line-height: 3.2rem;
            text-align: left;
            &:hover {
              background: #203060;
              span {
                color: #37e;
              }

              i {
                color: #37e;
              }
            }

            span {
              padding: 0 2rem 0 0.5rem;
              color: #ecf5ff;
            }

            i {
              color: #abd;
            }
          }
          .el-menu-item {
            padding: 0 3rem;
            min-width: 12rem;
          }

          &__icon-arrow {
            font-size: 1rem;
          }

          [class^=el-icon-] {
            margin-right: 0.4rem;
            width: 2rem;
            font-size: 1.3rem;
          }
        }
        .el-menu-item {
          width: 12rem;
          height: 3.2rem;
          line-height: 3.2rem;
          text-align: center;
          min-width: unset;

          &:hover {
            background: #203060;
            color: #37e !important;
            i {
              color: #37e;
            }
          }
          &.is-active {
            color: #37e !important;
          }
          [class^=el-icon-] {
            font-size: 1.2rem;
          }

          [class^=iconfont] {
            color: #abd;
            margin-right: 0.6rem;
          }
        }

        .el-menu-item-group {
          &__title {
            padding: 0;
          }
        }

        &.el-menu--collapse {
          // width: 2.66rem;
          padding: 0.5rem 0;

          .el-menu-item {
            // width: 2.66rem;
            width: 5rem;
            height: 3.2rem;
            line-height: 3.2rem;
            padding: 0 !important;
            color: #abd;

            &.is-active {
              background: #203060;
              color: #37e;

              .el-tooltip {
                i {
                  color: #37e;
                }
              }
            }

            .el-tooltip {
              padding: 0 !important;
              text-align: center;
              line-height: 2.66rem;

              i {
                font-size: 1.2rem;
                color: #abd;
                margin-right: 0;

                &:hover {
                  color: #37e;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
