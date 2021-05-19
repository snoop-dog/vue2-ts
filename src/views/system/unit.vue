<!--
 * @Description: 单位管理
 * @Author: snoop-dog
 * @Date: 2021-05-03 10:13:47
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-19 23:57:05
 * @FilePath: \vue2-ts\src\views\system\unit.vue
-->
<template>
  <el-container class="unit-container">
    <el-main class="unit-main">
      <el-container class="tree-container">
        <tree-single
          :siteTreeData="unitTree"
          :defaultProps="defaultProps"
        >
        </tree-single>
      </el-container>
      <el-container class="table-container"></el-container>
    </el-main>
  </el-container>
</template>

<script>
// apis
import {
  addDepartment,
  deleteDepartment,
  getUnitTree,
  updateUnit
} from '@/apis/index'

// conponents
import treeSingle from '@/components/common/select/select-tree-single'

export default {
  name: 'unit',
  data () {
    return {
      unitTree: [], // 单位树
      defaultProps: {
        id: 'id',
        label: 'name',
        children: 'children'
      }
    }
  },
  components: {
    treeSingle
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
        console.log(data)
        this.unitTree = data.data
      }).catch(err => {
        console.log(err)
        this.unitTree = []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.unit-container {
  width: 100%;
  height: 100%;
  .unit-main {
    width: 100%;
    height: 100%;
    padding: 0;
    display: flex;
    /deep/.tree-container {
      flex: 0 0 22rem;
      background: #fff;
      padding: 3rem 1rem;
      border-radius: 0.5rem;
      .sitebox {
        width: 100%;
        height: 100%;
        .Collection_site {
          width: 100%;
          .el-select__input {
            width: 100%;
            border: 1px solid #ccc;
            padding-left: 1rem;
            margin-left: 0;
            height: 2.5rem;
            line-height: 2.5;
          }
        }
        .sitetree {
          margin-top: 0.5rem;
        }
      }
    }
    .table-container {
      flex: 1;
    }
  }
}
</style>
