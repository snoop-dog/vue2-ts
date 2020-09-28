<template>
  <el-container class="monoca-container">
    <el-main id="monoca" class="monoca-main"></el-main>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js'
import { component } from 'vue/types/umd'

@Component
export default class Chart extends Vue {
  public monoca
  public str = 'hello world'

  created () {
    // this.monoca = monaco.editor.create(
    //   document.querySelector('#monoca'),
    //   {
    //     value: `console.log(${this.str})`,
    //     language: 'typescript'
    //   }
    // )
  }
}
</script>

<style lang="scss" scoped>
  .monoca-container {
    width: 100%;
    height: 100%;
    .monoca-main {
      width: 100%;
      height: 100%;
    }
  }
</style>
