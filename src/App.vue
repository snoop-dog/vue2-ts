<!--
 * @Description: write something
 * @Author: snoop-dog
 * @Date: 2020-09-21 20:26:17
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-04-24 21:35:13
 * @FilePath: \vue2-ts\src\App.vue
-->
<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mounted () {
    let echartsUnit
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    if (width > 768 && width <= 1800) {
      echartsUnit = 12
    } else if (width > 1800 && width <= 2000) {
      echartsUnit = 15
    } else if (width > 2000 && width <= 2560) {
      echartsUnit = 20
    } else if (width > 2560 && width <= 3840) {
      echartsUnit = 30
    } else if (width > 3840) {
      echartsUnit = 35
    }
    this.$store.commit('setEchartsUnit', echartsUnit)
    window.addEventListener('resize', () => {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      if (width > 768 && width <= 1800) {
        echartsUnit = 12
      } else if (width > 1800 && width <= 2000) {
        echartsUnit = 15
      } else if (width > 2000 && width <= 2560) {
        echartsUnit = 20
      } else if (width > 2560 && width <= 3840) {
        echartsUnit = 30
      } else if (width > 3840) {
        echartsUnit = 35
      }
      this.$store.commit('setEchartsUnit', echartsUnit)
    })

    window.addEventListener('beforeunload', () => {
      debugger
      this.$store.commit('resetState')
    }, false)
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #203060;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
