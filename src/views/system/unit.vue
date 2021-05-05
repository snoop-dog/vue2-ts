<!--
 * @Description: 单位管理
 * @Author: snoop-dog
 * @Date: 2021-05-03 10:13:47
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-03 22:42:28
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

    }
  }
}
</script>

<style>

</style>
