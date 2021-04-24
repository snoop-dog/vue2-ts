<!--
 * @Description: 角色管理
 * @Author: snoop-dog
 * @Date: 2021-04-24 15:00:59
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-04-25 02:37:58
 * @FilePath: \vue2-ts\src\views\system\role.vue
-->
<template>
  <el-container class="role-container table-container">
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
        :oprate="oprate"
      >
        <div slot="name" slot-scope="props">
          <span>{{props.value}}</span>
        </div>
        <div slot="describe" slot-scope="props">
          <span>{{props.value}}</span>
        </div>
        <div slot="is_enabled" slot-scope="props">
          <span>{{props.value | enableFilter}}</span>
        </div>
        <div slot="oprate" slot-scope="props">
          <el-button @click.stop="updateRole(props.value)" class="btnPrimary">修改</el-button>
          <el-button @click.stop="deleteRole(props.value.id)" class="btnPrimary">删除</el-button>
          <el-button class="btnPrimary" v-if="!props.value.is_enabled">启用</el-button>
          <el-button class="btnPrimary" v-else>关闭</el-button>
        </div>
      </layout-table>
    </el-row>

    <my-dialog
      size="extra-small"
      modal
      :visible.sync="showDialog"
      title="新增角色"
    >
      <el-form label-width="8rem" label-position="left" class="alarm-form required-form">
        <el-form-item label="角色编号：" class="required">
          <el-input clearable v-model.trim="ruleForm.id" placeholder="请输入角色编号"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：" class="required">
          <el-input clearable v-model.trim="ruleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色排序：" class="required">
          <el-input
            clearable
            v-model.trim="ruleForm.sort"
            @input="ruleForm.sort=ruleForm.sort.replace(/[^\d]/g,'')"
            @blur="ruleForm.sort=ruleForm.sort.replace(/[^\d]/g,'')"
            placeholder="请输入数字">
          </el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-switch
            v-model="ruleForm.is_enabled"
            active-color="#b3bcf7"
            inactive-color="#ccc"
            :active-value='1'
            :inactive-value='0'>
          </el-switch>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input 
            v-model.trim="ruleForm.remark" 
            type="textarea" 
            resize='none' 
            :rows="4" 
            placeholder="请输入角色描述"
            show-word-limit
            maxlength="100"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </my-dialog>
  </el-container>
</template>

<script>
// apis
import {
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
  enableRole,
  getRoleSimple
} from '../../apis/index'

// components
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myDialog from '@/components/common/layout/layout-dialog.vue'
export default {
  name: 'system-role',
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
          name: '角色名称',
          prop: 'name',
          value: 'name'
        },
        {
          name: '角色描述',
          prop: 'describe',
          value: 'describe',
          width: 150
        },
        {
          name: '是否启用',
          prop: 'is_enabled',
          value: 'is_enabled',
          width: 80
        }
      ],
      oprate: { // 数据操作列
        isShow: true, // 是否含有操作列
        name: '操作',
        fixed: 'right',
        // width: 350
        width: 400
      },
      tableTitle: { // 表格title
        name: '出租登记',
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
      size: 20 // 每页条数
    }
  },
  components: {
    myDialog,
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
        name: param.keyword,
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true

      getRoleList(params).then(data => {
        const res = data.data
        this.dataList = _.cloneDeep(res.data)
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = data.data.totalPage
        this.pagination.totalCount = data.data.totalCount
        this.pagination.pageIndex = data.data.pageIndex
      })
    },
    /**
     * @description: 点击表头按钮
     * @param {string} val
     * @returns {*} vpid
     */
    handleClick (val) {
      if (val === 'addRole') {
        this.showDialog = true
      }
    },
    /**
     * @description: 编辑角色
     * @param {Object} item 角色
     * @returns {*} void
     */
    updateRole (item) {
      this.showDialog = true
      for (const k in this.ruleForm) {
        this.$set(this.ruleForm, k, item[k])
      }
    },
    /**
     * @description: 删除角色
     * @param {String} id 角色id
     * @returns {*} void
     */
    deleteRole (id) {
      this.$confirm('是否删除当前角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.confirmDelete(id)
      }).catch(err => {
        console.log(err)
        this.showMessageBox('已取消！')
      })
    },
    /**
     * @description: 确认删除角色
     * @param {String} id 角色id
     * @returns {*} void
     */
    confirmDelete (id) {
      const params = {
        ids: id
      }

      deleteRole(params).then(data => {
        this.showMessageBox(data.message, 'success')
        this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
      })
    }
  },
  filters: {
    enableFilter (val) {
      return val ? '启用' : '关闭'
    }
  }
}
</script>

<style>

</style>
