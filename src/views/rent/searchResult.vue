<!--
 * @Description: 关键字查询结果
 * @Author: snoop-dog
 * @Date: 2021-05-06 21:34:20
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-07 00:59:56
 * @FilePath: \vue2-ts\src\views\rent\searchResult.vue
-->

<template>
  <el-container class="result-container">
    <el-main class="type-main">
      <el-tabs tab-position="left" v-model="activeTab">
        <el-tab-pane label="房主列表" name="1"></el-tab-pane>
        <el-tab-pane label="房屋列表" name="2"></el-tab-pane>
        <el-tab-pane label="租户列表" name="3"></el-tab-pane>
      </el-tabs>
    </el-main>
    <el-main class="table-container">
      <el-row class="searchModel" v-show="false">
        <layout-search :search-param="searchParam" :query-loading='queryLoading' @query="searchList" ></layout-search>
      </el-row>
      <el-row class="tableModel">
        <layout-table
          :pagination="pagination"
          :ending-load="endingLoad"
          :data-list="dataList"
          :table-head="tableHead"
          :table-title="tableTitle"
          ref="multipleTable"
        >
          <div slot="name" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="nation" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="sex" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | sexFilter"></my-tooltip>
          </div>
          <div slot="owners_type" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="idcard" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="phone" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="provinceStr" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="cityStr" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="areaStr" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="streetStr" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="communityStr" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="address" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
        </layout-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
// apis
import { dataSearch } from '@/apis/index'

// components
import layoutTable from '@/components/common/layout/layout-table.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'
import layoutSearch from '@/components/common/layout/layout-search.vue'
export default {
  name: 'search-result',
  data () {
    return {
      dataList: [], // 列表数据
      queryLoading: false, // 查询loading
      endingLoad: true,
      searchParam: [],
      pagination: { // 分页参数
        totalCount: 0,
        pageCount: 0,
        pageIndex: 1
      },
      tableHead: [ // 表头
        {
          name: '姓名',
          prop: 'name',
          value: 'name'
        },
        {
          name: '民族',
          prop: 'nation',
          value: 'nation'
        },
        {
          name: '性别',
          prop: 'sex',
          value: 'sex'
        },
        {
          name: '类别',
          prop: 'owners_type',
          value: 'owners_type'
        },
        {
          name: '身份证',
          prop: 'idcard',
          value: 'idcard',
          width: 140
        },
        {
          name: '手机号',
          prop: 'phone',
          value: 'phone',
          width: 120
        },
        {
          name: '省',
          prop: 'provinceStr',
          value: 'provinceStr'
        },
        {
          name: '市',
          prop: 'cityStr',
          value: 'cityStr'
        },
        {
          name: '区/县',
          prop: 'areaStr',
          value: 'areaStr'
        },
        {
          name: '街道',
          prop: 'streetStr',
          value: 'streetStr'
        },
        {
          name: '社区',
          prop: 'communityStr',
          value: 'communityStr'
        },
        {
          name: '详细地址',
          prop: 'address',
          value: 'address'
        }
      ],
      tableTitle: { // 表格title
        name: '查询结果列表'
      },
      activeTab: '1',
      keyword: '',
      pageIndex: 1,
      size: 20
    }
  },
  components: {
    layoutTable,
    myTooltip,
    layoutSearch
  },
  created () {
    this.keyword = this.$route.query.keyword
  },
  methods: {
    /**
     * @description: 查询出租房屋列表数据
     * @param {*} none
     * @returns {*} void
     */
    searchList (param, val, size) {
      const params = {
        keyword: this.keyword,
        type: Number(this.activeTab),
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true
      this.size = size

      dataSearch(params).then(data => {
        const res = data.data
        this.dataList = _.cloneDeep(res.data)
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = data.data.totalPage
        this.pagination.totalCount = data.data.totalCount
        this.pagination.pageIndex = data.data.pageIndex
      }).catch(error => {
        console.log(error)
        this.dataList = []
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = 1
        this.pagination.totalCount = 0
        this.pagination.pageIndex = 1
      })
    }
  },
  watch: {
    activeTab (val) {
      console.log(val)
      this.searchList({}, this.pagination.pageIndex, this.size)
    }
  },
  filters: {
    nullTextFilter (val) {
      return val || '--'
    },
    sexFilter (val) {
      return val ? '女' : '男'
    }
  }
}
</script>

<style lang="scss" scoped>
.result-container {
  display: flex;
  .el-main {
    padding: 0;
  }
  .type-main {
    flex: 0 0 8rem;
    border-radius: 0.7rem;
    background: #fff;
    margin-right: 0.6rem;
    // border-top-right-radius: 0;
    // border-bottom-right-radius: 0;
    /deep/.el-tabs--left {
      padding-top: 1rem;
      .el-tabs__header {
        &.is-left {
          width: 100%;
          margin: 0;
        }
      }
      .el-tabs__active-bar {
        &.is-left {
          width: 4px;
        }
      }
      .el-tabs__nav-wrap {
        &.is-left {
          &::after {
            background-color: transparent;
          }
        }
      }
    }
  }
  /deep/.table-container {
    flex: 1;
    .tableModel {
      margin-top: 0;
      // border-top-left-radius: 0;
      // border-bottom-left-radius: 0;
    }
  }
}
</style>
