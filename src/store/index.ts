import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

const initState = {
  isFold: false,
  activeTab: '/rent/datasearch',
  menuData: [],
  tabList: [
    {
      name: '数据检索',
      url: '/rent/datasearch'
    }
  ],
  echartsUnit: null,
  renovate: false
}

export default new Vuex.Store({
  state: {
    isFold: false, // 菜单是否折叠
    activeTab: '/rent/datasearch', // 当前激活菜单
    menuData: [], // 菜单数据
    tabList: [ // tab集合
      {
        name: '数据检索',
        url: '/rent/datasearch'
      }
    ],
    echartsUnit: null, // echarts单位
    renovate: false
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
    renovate: (state, renovate) => {
      state.renovate = renovate
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
     * @param url
     */
    addTabList (state, url: string) {
      const samePath = state.tabList.filter(x => x.url === url)
      if (samePath.length) {
        state.activeTab = samePath[0].url
      } else {
        const curMenu: any = state.menuData.filter(x => x.url === url)
        state.tabList.push({
          name: curMenu[0].name,
          url: curMenu[0].url
        })
        state.activeTab = url
      }
    },
    /**
     * @description 改变当前active
     * @param state
     * @param url
     */
    changeActive (state, url) {
      state.activeTab = url
    },
    /**
     * @description delete tablist
     * @param state
     * @param url
     */
    removeTab (state, url) {
      const idx: number = state.tabList.findIndex(item => item.url === url)
      state.tabList.splice(idx, 1)
      state.activeTab = state.tabList[state.tabList.length - 1].url
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
    },
    /**
     * @description 设置echarts单位
     * @param state
     * @param echartsUnit
     */
    setEchartsUnit (state, echartsUnit) {
      state.echartsUnit = echartsUnit
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
    },
    setRenovate ({ commit }, param) {
      commit('renovate', param)
    }
  },
  modules: {
  }
})
