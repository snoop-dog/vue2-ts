<!--
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2020-09-21 20:26:17
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-02 14:07:06
 * @FilePath: \vue2-ts\src\views\layout\components\app-main.vue
-->
<template>
  <el-container class="app-container">
    <keep-alive>
      <router-view :key="key" v-if='isRouterShow'></router-view>
    </keep-alive>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import eventBus from '../../../components/event-bus.js'
export default Vue.extend({
  computed: {
    ...mapState({
      activeTab: (state: any) => state.activeTab
    }),
    key () {
      return this.$route.path
    }
  },
  data () {
    return {
      isRouterShow: true
    }
  },
  mounted () {
    this.reload()
  },
  methods: {
    reload () {
      eventBus.$on('reload-page', () => {
        console.log(1)
        this.isRouterShow = false
        this.$nextTick()
        setTimeout(() => {
          this.isRouterShow = true
        }, 500)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
  .app-container {
    position: absolute;
    top: 1.2rem;
    left: 1.2rem;
    right: 1.2rem;
    bottom: 1.2rem;
    border-radius: 0.5rem;
    background: #fff;
  }
</style>
