<!--
 * @Description: 出租登记
 * @Author: snoop-dog
 * @Date: 2021-04-24 15:00:07
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-04-25 01:06:28
 * @FilePath: \vue2-ts\src\views\rent\register.vue
-->
<template>
  <el-container class="register-container table-container">
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
        <div slot="id" slot-scope="props">
          <span>{{props.value}}</span>
        </div>
      </layout-table>
    </el-row>
  </el-container>
</template>

<script>
import { getHousePage } from '../../apis/index'
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
export default {
  name: 'register',
  data () {
    return {
      dataList: [
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        },
        {
          id: 'iii'
        }
      ], // 列表数据
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
          name: '对象ID',
          prop: 'id',
          value: 'id'
        },
        {
          name: '对象姓名',
          prop: 'object_name',
          value: 'object_name',
          width: 110
        },
        {
          name: '手机号',
          prop: 'phonenum',
          value: 'phonenum',
          width: 110
        },
        {
          name: '运营商',
          prop: 'operator_str',
          value: 'operator_str',
          width: 100
        },
        {
          name: '归属地',
          prop: 'city_name',
          value: 'city_name',
          width: 100
        },
        {
          name: 'IMSI',
          prop: 'imsi',
          value: 'imsi'
        },
        {
          name: 'IMEI',
          prop: 'imei',
          value: 'imei'
        },
        {
          name: '证件号',
          prop: 'idcard_num',
          value: 'idcard_num',
          width: 110
        },
        {
          name: '采集设备',
          prop: 'device_num',
          value: 'device_num',
          width: 110
        },
        {
          name: '手动对象',
          prop: 'is_debug',
          value: 'is_debug',
          width: 110
        }
      ],
      tableTitle: { // 表格title
        name: '出租登记',
        button: [
          {
            label: '创建',
            value: 'addObject'
          },
          {
            label: '全部导出',
            value: 'allDownload',
            iconfont: 'el-icon-download'
          }
        ]
      },
      propsParams: {} // 初始参数
    }
  },
  components: {
    layoutSearch,
    layoutTable
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
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true

      getHousePage(params).then(data => {
        const res = data.data
        // this.dataList = _.cloneDeep(res.data)
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = data.data.totalPage
        this.pagination.totalCount = data.data.totalCount
        this.pagination.pageIndex = data.data.pageIndex
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
  }
}
</script>

<style>

</style>
