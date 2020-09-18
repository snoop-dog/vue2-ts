<template>
  <el-container class="app-container">
    <keep-alive>
      <router-view :key="key"></router-view>
    </keep-alive>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapState({
      avtiveTab: (state: any) => state.avtiveTab
    }),
    key () {
      return this.$route.path
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
