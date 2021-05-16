<!--
 * @Description: 单位管理
 * @Author: snoop-dog
 * @Date: 2021-05-03 10:13:47
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-17 01:45:32
 * @FilePath: \vue2-ts\src\views\system\unit.vue
-->
<template>
  <el-container class="unit-container"></el-container>
</template>

<script>
// apis
import {
  addDepartment,
  deleteDepartment,
  getUnitTree,
  updateUnit
} from '@/apis/index'
export default {
  name: 'unit',
  data () {
    return {
      unitTree: []
    }
  },
  created () {
    this.getUnitTree() // 获取单位树
  },
  methods: {
    /**
     * @description: 获取单位树
     * @param {*} none
     * @returns {*} void
     */
    getUnitTree () {
      getUnitTree().then(data => {
        this.getUnitTree = data.data
      }).catch(err => {
        console.log(err)
        this.unitTree = []
      })
    }
  }
}
</script>

<style>

</style>
