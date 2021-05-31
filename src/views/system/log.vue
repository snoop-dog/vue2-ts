<!--
 * @Description: 系统日志
 * @Author: snoop-dog
 * @Date: 2021-04-24 21:22:27
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-06-01 00:09:30
 * @FilePath: \vue2-ts\src\views\system\log.vue
-->

<template>
  <el-container class="log-container table-container">
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
        ref="multipleTable"
      >
        <div slot="menu_name" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="operation_type" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="operation_condition" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="sub_menu_name" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="operation_type_detail" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="source" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | sourceFilter"></my-tooltip>
        </div>
        <div slot="result_type" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | resultFilter"></my-tooltip>
        </div>
      </layout-table>
    </el-row>
  </el-container>
</template>

<script>
// apis
import {
  getLogList,
  insertLog
} from '@/apis/index'

// utils
import { doDateTimeShift } from '@/utils/date'
// components
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'
export default {
  name: 'log',
  data () {
    return {
      dataList: [],
      queryLoading: false, // 查询loading
      searchParam: [ // 查询参数
        {
          label: '操作类型：',
          type: 'select',
          property: 'operation_type',
          operation_type: '',
          data: [
            {
              label: '查询',
              value: 'query'
            },
            {
              label: '增加',
              value: 'add'
            },
            {
              label: '修改',
              value: 'edit'
            },
            {
              label: '删除',
              value: 'del'
            },
            {
              label: '登录',
              value: 'login'
            }
          ],
          placeholder: '请选择'
        },
        {
          label: '时间：',
          type: 'time',
          property: 'time',
          dateType: 'datetime',
          time: [new Date(new Date().getTime() - 3600 * 24 * 1000 * 30), new Date(new Date().getTime())],
          disableddate: {
            disabledDate (date) {
              return date.getTime() > new Date().getTime() + 3600 * 24 * 1000
            }
          }
        }
      ],
      endingLoad: true,
      pagination: { // 分页参数
        totalCount: 0,
        pageCount: 1,
        pageIndex: 1
      },
      tableHead: [ // 表头
        {
          name: '菜单名称',
          prop: 'menu_name',
          value: 'menu_name'
        },
        {
          name: '操作类型',
          prop: 'operation_type',
          value: 'operation_type'
        },
        {
          name: '操作条件',
          prop: 'operation_condition',
          value: 'operation_condition',
          width: 200
        },
        {
          name: '二级菜单名称',
          prop: 'sub_menu_name',
          value: 'sub_menu_name'
        },
        {
          name: '操作类型明细',
          prop: 'operation_type_detail',
          value: 'operation_type_detail'
        },
        {
          name: '数据来源',
          prop: 'source',
          value: 'source'
        },
        {
          name: '结果类型',
          prop: 'result_type',
          value: 'result_type'
        }
      ],
      tableTitle: { // 表格title
        name: '日志列表'
      },
      propsParams: {}, // 初始参数
      size: 20 // 每页条数
    }
  },
  components: {
    myTooltip,
    layoutSearch,
    layoutTable
  },
  methods: {
    /**
     * @description: 查询角色列表
     * @param {Object} param 查询参数
     * @param {Number} val 页码
     * @param {Number} size 每页条数
     * @returns {*} void
     */
    searchList (param, val, size) {
      this.propsParams = _.cloneDeep(param)
      this.size = size
      const params = {
        operation_type: param.operation_type,
        startTime: doDateTimeShift(param.time[0]),
        endTime: doDateTimeShift(param.time[1]),
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true

      getLogList(params).then(data => {
        const res = data.data
        this.dataList = _.cloneDeep(res.data)
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = data.data.totalPage
        this.pagination.totalCount = data.data.totalCount
        this.pagination.pageIndex = data.data.pageIndex
      }).catch(error => {
        cosnole.log(error)
        this.dataList = []
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = 1
        this.pagination.totalCount = 0
        this.pagination.pageIndex = 1
      })
    }
  },
  filters: {
    nullTextFilter (val) {
      return val || '--'
    },
    sourceFilter (val) {
      if (Number(val) === 0) {
        return 'web'
      } else {
        return 'vx'
      }
    },
    resultFilter (val) {
      if (Number(val) === 0) {
        return '登录成功'
      } else {
        return '登录失败'
      }
    }
  }
}
</script>

<style>

</style>
