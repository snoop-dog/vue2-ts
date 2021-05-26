<!--
 * @Description: 出租登记详情
 * @Author: snoop-dog
 * @Date: 2021-05-26 01:20:32
 * @LastEditors  : snoop-dog
 * @LastEditTime : 2021-05-26 19:00:07
 * @FilePath     : \vue2-ts\src\views\rent\detail.vue
-->
<template>
  <el-container class="detail-container">
    <el-main class="detail-main">
      <el-container class="basic-info">
        <el-main class="basic-main">
          <el-header class="basic-title">房主信息</el-header>
          
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
// apis
import { getRegisterDetail } from '@/apis/index'

export default {
  name: 'detail',
  data () {
    return {
      id: '', // 出租登记信息id
      type: '', // 查询类型
      detailData: null // 详情数据
    }
  },
  created () {
    console.log(this.$route)
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.getRegisterDetail()
  },
  methods: {
    /**
     * @description: 查询出租登记详情
     * @param {*} none
     * @returns {*} void
     */    
    getRegisterDetail () {
      const params = {
        id: this.id,
        type: this.type
      }

      getRegisterDetail(params).then(data => {
        console.log(data)
        this.detailData = data.data.homeowner
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}

.detail-container {
  width: 100%;
  height: 100%;
  background: #fff;
  .detail-main {
    flex: unset;
    width: 80%;
    height: auto;
    overflow-y: auto;
    margin: 1rem auto;
    padding: 0 5%;
    .basic-info {
      width: 100%;
      height: 30rem;
      background: url('../../assets/images/bg_basic_inf_blue.png') 0 0 no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
