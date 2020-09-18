import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isFold: false,
    activeTab: '一键搜',
    menuData: []
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
    }
  },
  actions: {
    /**
     * @description 获取菜单数据
     * @param param0
     * @param menu
     */
    getMenuData ({ commit }, menu) {
      commit('getMenu', menu)
    }
  },
  modules: {
  }
})
