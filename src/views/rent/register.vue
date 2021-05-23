<!--
 * @Description: 出租登记
 * @Author: snoop-dog
 * @Date: 2021-04-24 15:00:07
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-24 00:32:49
 * @FilePath: \vue2-ts\src\views\rent\register.vue
-->
<template>
  <el-container class="register-container table-container">
    <el-row class="searchModel">
      <layout-search :search-param="searchParam" :query-loading='queryLoading' @query="searchList" ></layout-search>
    </el-row>

    <el-row class="tableModel">
      <layout-table
        fixed
        :pagination="pagination"
        :ending-load="endingLoad"
        :data-list="dataList"
        :table-head="tableHead"
        :table-title="tableTitle"
        @title-click="handleClick"
        ref="multipleTable"
        >
        <div slot="homeowner" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="ownername" slot-scope="props">
          <my-tooltip width="100%" :value="props.value.homeownerInfo.name | nullTextFilter"></my-tooltip>
        </div>
        <div slot="nation" slot-scope="props">
          <my-tooltip width="100%" :value="props.value.homeownerInfo.nation | nullTextFilter"></my-tooltip>
        </div>
        <div slot="idcard" slot-scope="props">
          <my-tooltip width="100%" :value="props.value.homeownerInfo.idcard | nullTextFilter"></my-tooltip>
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
        <div slot="housingNatureStr" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="planningPurposesStr" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="constructionArea" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="premisesPermitNo" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
      </layout-table>
    </el-row>
  </el-container>
</template>

<script>
import { getHousePage } from '@/apis/index'
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'
export default {
  name: 'register',
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
          name: '户主id',
          prop: 'homeowner',
          value: 'homeowner',
          width: 40
        },
        {
          name: '户主姓名',
          prop: 'ownername',
          value: 'ownername',
          showRow: true,
          width: 60
        },
        {
          name: '民族',
          prop: 'nation',
          value: 'nation',
          showRow: true,
          width: 40
        },
        {
          name: '身份证',
          prop: 'idcard',
          value: 'idcard',
          showRow: true,
          width: 150
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
          value: 'address',
          width: 120
        },
        {
          name: '房屋性质',
          prop: 'housingNatureStr',
          value: 'housingNatureStr'
        },
        {
          name: '规划用途',
          prop: 'planningPurposesStr',
          value: 'planningPurposesStr',
          width: 100
        },
        {
          name: '房屋面积',
          prop: 'constructionArea',
          value: 'constructionArea',
          width: 100
        },
        {
          name: '房产证编号',
          prop: 'premisesPermitNo',
          value: 'premisesPermitNo',
          width: 100
        }
      ],
      tableTitle: { // 表格title
        name: '出租登记'
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
  created () {
    // this.searchList()
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
        keyword: param.keyword,
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true

      getHousePage(params).then(data => {
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

<style>

</style>
