<!--
 * @Description: 数据检索
 * @Author: snoop-dog
 * @Date: 2021-04-24 14:59:31
 * @LastEditors  : snoop-dog
 * @LastEditTime : 2021-05-27 10:03:44
 * @FilePath     : \vue2-ts\src\views\rent\datasearch.vue
-->

<template>
  <el-container class="datasearch-container">
    <el-input placeholder="请输入内容" @keyup.enter.native="queryKeyword" v-model.trim="keyword" class="input-with-select">
      <!-- <el-select v-model="select" slot="prepend" placeholder="请选择">
        <el-option label="餐厅名" value="1"></el-option>
        <el-option label="订单号" value="2"></el-option>
        <el-option label="用户电话" value="3"></el-option>
      </el-select> -->
      <el-button slot="append" icon="el-icon-search" @click.native="queryKeyword"></el-button>
    </el-input>
  </el-container>
</template>

<script>
export default {
  name: 'data-search',
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    queryKeyword () {
      if (!this.keyword) {
        return this.showMessageBox('请输入关键字！', 'warning')
      } else if (this.keyword.length > 20) {
        return this.showMessageBox('关键字长度不能大于20个字符！', 'warning')
      }
      
      this.$store.commit(
        'addTabList',
        {
          url: '/rent/searchResult',
          param: {
            keyword: this.keyword
          }
        }
      )
      this.$router.push({
        path: '/rent/searchResult',
        query: {
          keyword: this.keyword
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.datasearch-container {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  /deep/.input-with-select {
    width: 50%;
    margin-top: -8rem;
    &.el-input-group {
      >.el-input__inner {
        height: 2.66rem;
        line-height: 2.66rem;
        display: unset;
      }
    }
  }
}
</style>
