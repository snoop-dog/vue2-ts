<!--
 * @Description: 租户信息
 * @Author: snoop-dog
 * @Date: 2021-05-17 01:08:59
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-24 01:06:17
 * @FilePath: \vue2-ts\src\views\system\tenant.vue
-->
<template>
  <el-container class="table-container">
    <el-row class="searchModel">
      <layout-search :search-param="searchParam" :query-loading='queryLoading' @query="searchList" ></layout-search>
    </el-row>

    <el-row class="tableModel">
      <layout-table
        :pagination="pagination"
        :ending-load="endingLoad"
        :data-list="dataList"
        :table-head="tableHead"
        :table-title="tableTitle"
        @title-click="handleClick"
        ref="multipleTable"
        >
        <div slot="name" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="sexStr" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="nationStr" slot-scope="props">
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
        <div slot="houseAddress" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="start_time" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="end_time" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="address" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
      </layout-table>
    </el-row>
  </el-container>
</template>

<script>
// apis
import { getTenantPage } from '@/apis'

// components
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'
export default {
  name: 'tenant',
  data () {
    return {
      dataList: [], // 列表数据
      queryLoading: false, // 查询loading
      searchParam: [ // 查询参数
        {
          label: '关键字：',
          type: 'input',
          property: 'keyword',
          keyword: '',
          placeholder: '请输入关键字'
        }
      ],
      endingLoad: true,
      pagination: { // 分页参数
        totalCount: 0,
        pageCount: 0,
        pageIndex: 1
      },
      tableHead: [ // 表头
        {
          name: '租户姓名',
          prop: 'name',
          value: 'name'
        },
        {
          name: '民族',
          prop: 'nationStr',
          value: 'nationStr',
          width: 50
        },
        {
          name: '性别',
          prop: 'sexStr',
          value: 'sexStr',
          width: 50
        },
        {
          name: '手机号',
          prop: 'phone',
          value: 'phone',
          width: 80
        },
        {
          name: '身份证',
          prop: 'idcard',
          value: 'idcard',
          width: 110
        },
        {
          name: '省',
          prop: 'provinceStr',
          value: 'provinceStr',
          width: 50
        },
        {
          name: '市',
          prop: 'cityStr',
          value: 'cityStr',
          width: 50
        },
        {
          name: '区/县',
          prop: 'areaStr',
          value: 'areaStr',
          width: 50
        },
        {
          name: '街道',
          prop: 'streetStr',
          value: 'streetStr',
          width: 50
        },
        {
          name: '社区',
          prop: 'communityStr',
          value: 'communityStr',
          width: 60
        },
        {
          name: '房屋地址',
          prop: 'houseAddress',
          value: 'houseAddress',
          width: 80
        },
        {
          name: '承租起始时间',
          prop: 'start_time',
          value: 'start_time',
          width: 100
        },
        {
          name: '承租结束时间',
          prop: 'end_time',
          value: 'end_time',
          width: 100
        }
      ],
      tableTitle: { // 表格title
        name: '租户列表'
        // button: [
        //   {
        //     label: '创建',
        //     value: 'addObject'
        //   },
        //   {
        //     label: '全部导出',
        //     value: 'allDownload',
        //     iconfont: 'el-icon-download'
        //   }
        // ]
      },
      propsParams: {} // 初始参数
    }
  },
  components: {
    layoutSearch,
    layoutTable,
    myTooltip
  },
  methods: {
    /**
     * @description: 查询出租房屋列表数据
     * @param {*} none
     * @returns {*} void
     */
    searchList (param, val, size) {
      this.propsParams = _.cloneDeep(param)
      const params = {
        name: param.keyword,
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true

      getTenantPage(params).then(data => {
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
    },
    /**
     * @description: 点击表头按钮
     * @param {*} val
     * @returns {*} void
     */
    handleClick (val) {
      console.log(val)
    }
  },
  filters: {
    nullTextFilter (val) {
      return val || '--'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
