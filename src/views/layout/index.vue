<template>
  <el-container class="layout-container">
    <el-main class="layout-tag">
      <tag-views></tag-views>
    </el-main>
    <el-main class="layout-main">
      <el-row class="layout-sidebar">
        <side-bar></side-bar>
      </el-row>
      <el-row class="layout-content">
        <app-main></app-main>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import tagViews from './components/tag-views.vue'
import sideBar from './components/side-bar.vue'
import appMain from './components/app-main.vue'
export default Vue.extend({
  components: {
    tagViews,
    sideBar,
    appMain
  }
})
</script>

<style lang="scss" scoped>
  .layout-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .layout-tag {
      flex: 0 0 3.2rem;
    }
    .layout-main {
      flex: 1;
      display: flex;
      .layout-sidebar {
        // flex: 0 0 14rem;
        width: auto;
        min-width: 4rem;
        background: rgba(18, 28, 68, 0.8);
        ::-webkit-scrollbar { display: none; }
        scrollbar-width: none;
      }
      .layout-content {
        flex: 1;
        position: relative;
        background: #efefef;
      }
    }
  }
</style>
