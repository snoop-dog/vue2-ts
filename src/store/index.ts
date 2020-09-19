import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

const initState = {
  isFold: false,
  activeTab: 'echarts',
  menuData: [],
  tabList: [
    {
      label: 'echarts',
      name: 'echarts',
      value: 'echarts'
    }
  ]
}

export default new Vuex.Store({
  state: {
    isFold: false,
    activeTab: 'echarts',
    menuData: [],
    tabList: [
      {
        label: 'echarts',
        name: 'echarts',
        value: 'echarts'
      }
    ]
  },
  mutations: {
    /**
     * @description 菜单折叠展开
     * @param state
     * @param fold
     */
    foldSideBar (state, fold) {
      state.isFold = fold
    },
    /**
     * @description 获取菜单数据
     * @param state
     * @param menu
     */
    getMenu (state, menu) {
      state.menuData = state.menuData.concat(menu)
    },
    /**
     * @description add tablist
     * @param state
     * @param path
     */
    addTabList (state, path) {
      const samePath = state.tabList.filter(item => item.value === path)
      if (samePath.length) {
        state.activeTab = samePath[0].name
      } else {
        state.tabList.push({
          label: path,
          name: path,
          value: path
        })
        state.activeTab = path
      }
    },
    /**
     * @description 改变当前active
     * @param state
     * @param tabName
     */
    changeActive (state, tabName) {
      state.activeTab = tabName
    },
    /**
     * @description delete tablist
     * @param state
     * @param tabName
     */
    removeTab (state, tabName) {
      const idx: number = state.tabList.findIndex(item => item.name === tabName)
      state.tabList.splice(idx, 1)
      state.activeTab = state.tabList[state.tabList.length - 1].name
    },
    /**
     * @description reset state
     * @param state
     */
    resetState (state) {
      const stateArray: any[] = Object.keys(state)
      stateArray.forEach((k) => {
        state[k] = _.cloneDeep(initState[k])
      })
    }
  },
  actions: {
    /**
     * @description 获取菜单数据
     * @param commit
     * @param menu
     */
    getMenuData ({ commit }, menu) {
      commit('getMenu', menu)
    }
  },
  modules: {
  }
})
