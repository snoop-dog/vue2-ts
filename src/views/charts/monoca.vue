<template>
  <el-container class="monoca-container">
    <el-main id="monaco" style="width: 800px; height: 80%" class="monoca-main"></el-main>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js'

@Component
export default class Chart extends Vue {
  public monacoInstance
  public str = 'hello world'

  public createMonacoInstance () {
    this.monacoInstance = monaco.editor.create(
      document.getElementById('monaco'),
      {
        value: `console.log(${this.str})`,
        language: 'typescript'
      }
    )
  }

  mounted () {
    this.createMonacoInstance()
  }
}
</script>

<style lang="scss" scoped>
  .monoca-container {
    width: 100%;
    height: 100%;
    .monoca-main {
      width: 50%;
      height: 80%;
      flex: unset;
    }
  }
</style>
