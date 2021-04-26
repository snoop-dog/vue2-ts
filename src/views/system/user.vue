<!--
 * @Description: 用户管理
 * @Author: snoop-dog
 * @Date: 2021-04-24 15:05:30
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-04-27 00:14:02
 * @FilePath: \vue2-ts\src\views\system\user.vue
-->

<template>
  <el-container class="user-container table-container">
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
        :oprate="oprate"
      >
        <div slot="username" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="name" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="phonenumber" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="idcard" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="password" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="position_str" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="role_id_str" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="unit_str" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="provinceStr" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="create_time" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="creater" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="oprate" slot-scope="props">
          <el-button @click.stop="updateRole(props.value)" class="btnPrimary">修改</el-button>
          <el-button @click.stop="deleteRole(props.value.id)" class="btnPrimary">删除</el-button>
          <el-button class="btnPrimary" v-if="!props.value.is_enabled">启用</el-button>
          <el-button class="btnPrimary" v-else>关闭</el-button>
        </div>
      </layout-table>
    </el-row>
  </el-container>
</template>

<script>
// apis
import {
  updateUserInfo,
  updatePassword,
  getUserDetail,
  getUserList,
  updateUserStatus,
  deleteUser,
  addUser
} from '../../apis/index'

// components
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
// import myDialog from '@/components/common/layout/layout-dialog.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'

export default {
  name: 'user',
  data () {
    return {
      dataList: [],
      queryLoading: false, // 查询loading
      searchParam: [ // 查询参数
        {
          label: '关键字：',
          type: 'input',
          property: 'keyword',
          keyword: '',
          placeholder: '请输入账号，用户名，手机号'
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
          name: '用户名',
          prop: 'username',
          value: 'username',
          fixed: true,
          width: 80
        },
        {
          name: '用户姓名',
          prop: 'name',
          value: 'name',
          fixed: true,
          width: 80
        },
        {
          name: '手机号',
          prop: 'phonenumber',
          value: 'phonenumber',
          fixed: true,
          width: 120
        },
        {
          name: '身份证',
          prop: 'idcard',
          value: 'idcard',
          fixed: true,
          width: 150
        },
        {
          name: '密码',
          prop: 'password',
          value: 'password',
          width: 130
        },
        {
          name: '职位',
          prop: 'position_str',
          value: 'position_str',
          width: 120
        },
        {
          name: '角色',
          prop: 'role_id_str',
          value: 'role_id_str',
          width: 80
        },
        {
          name: '单位',
          prop: 'unit_str',
          value: 'unit_str',
          width: 150
        },
        {
          name: '地址',
          prop: 'provinceStr',
          value: 'provinceStr',
          width: 180
        },
        {
          name: '创建时间',
          prop: 'create_time',
          value: 'create_time',
          width: 150
        },
        {
          name: '创建人',
          prop: 'creater',
          value: 'creater',
          width: 80
        }
      ],
      oprate: { // 数据操作列
        isShow: true, // 是否含有操作列
        name: '操作',
        fixed: 'right',
        width: 400
      },
      tableTitle: { // 表格title
        name: '用户列表',
        button: [
          {
            label: '新增',
            value: 'addRole'
          }
        ]
      },
      propsParams: {}, // 初始参数
      ruleForm: { // 表单参数
        id: '',
        name: '',
        sort: 1,
        describe: '',
        is_enabled: 1
      },
      showDialog: false, // 是否显示修改新增弹框
      size: 20, // 每页条数
      isEdit: false // 是否是编辑标识
    }
  },
  components: {
    // myDialog,
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
        keyword: param.keyword,
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true

      getUserList(params).then(data => {
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
    handleClick () {
      console.log(1)
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
