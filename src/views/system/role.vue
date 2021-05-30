<!--
 * @Description: 角色管理
 * @Author: snoop-dog
 * @Date: 2021-04-24 15:00:59
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-31 01:34:22
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
          <my-tooltip width="100%" :value="props.value"></my-tooltip>
        </div>
        <div slot="typeStr" slot-scope="props">
          <my-tooltip width="100%" :value="props.value"></my-tooltip>
        </div>
        <div slot="describe" slot-scope="props">
          <my-tooltip width="100%" :value="props.value"></my-tooltip>
        </div>
        <div slot="is_enabled" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | enableFilter"></my-tooltip>
        </div>
        <div slot="oprate" slot-scope="props">
          <el-button v-if="props.value.id !== 0" @click.stop="updateRole(props.value)" class="btnPrimary">修改</el-button>
          <el-button v-if="props.value.id !== 0" @click.stop="deleteRole(props.value.id)" class="btnPrimary">删除</el-button>
          <el-button class="btnPrimary" v-if="props.value.is_enabled" @click.native="enableRole(props.value.id, 0)">启用</el-button>
          <el-button class="btnPrimary" v-else @click.native="enableRole(props.value.id, 1)">关闭</el-button>
        </div>
      </layout-table>
    </el-row>

    <my-dialog
      size="extra-small"
      modal
      :visible.sync="showDialog"
      :title="dialogTitle"
      @submit="confirmUpdate"
    >
      <el-form label-width="8rem" label-position="left" class="alarm-form required-form">
        <!-- <el-form-item label="角色编号：" class="required">
          <el-input 
            clearable 
            v-model.trim="ruleForm.id" 
            placeholder="请输入角色编号"
            @input="ruleForm.id=ruleForm.id.replace(/[^\d]/g,'')"
            @blur="ruleForm.id=ruleForm.id.replace(/[^\d]/g,'')"
          >
          </el-input>
        </el-form-item> -->
        <el-form-item label="角色名称：" class="required">
          <el-input clearable v-model.trim="ruleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色类型：" class="required" v-if="userInfo.role_id === 1">
          <el-select
            v-model="ruleForm.type"
            :multiple="false"
            clearable
          >
            <el-option
              v-for="item in roleTypeList"
              :value="item.code"
              :label="item.name"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单权限：" class="required">
          <el-select
            v-model="ruleForm.menu_ids"
            :multiple="true"
            clearable
            collapse-tags
          >
            <el-option
              v-for="item in menuArray"
              :value="item.id"
              :label="item.name"
              :key="item.id"
            ></el-option>
          </el-select>
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
            :active-value='0'
            :inactive-value='1'>
          </el-switch>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input 
            v-model.trim="ruleForm.describe" 
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
  getRoleSimple,
  getDicList,
  getUserDetail
} from '../../apis/index'

// components
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myDialog from '@/components/common/layout/layout-dialog.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'
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
        pageCount: 1,
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
          name: '角色类型',
          prop: 'typeStr',
          value: 'typeStr'
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
        name: '角色列表',
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
        is_enabled: 0,
        type: '',
        menu_ids: []
      },
      showDialog: false, // 是否显示修改新增弹框
      size: 20, // 每页条数
      isEdit: false, // 是否是编辑标识
      roleTypeList: [], // 角色类型列表
      userInfo: null, // 用户信息
      dialogTitle: '新增角色'
    }
  },
  computed: {
    menuArray () {
      const menuData = this.$store.state.menuData
      return menuData.filter(x => !x.is_show)
    }
  },
  components: {
    myTooltip,
    myDialog,
    layoutSearch,
    layoutTable
  },
  created () {
    this.getUserDetail()
    this.getDicList()
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
     * @description: 获取用户信息
     * @param {*} none
     * @returns {*} void
     */    
    getUserDetail () {
      getUserDetail({}).then(data => {
        this.userInfo = data.data
      })
    },
    /**
     * @description: 获取角色类型列表
     * @param {*} none
     * @returns {*} void
     */    
    getDicList () {
      const params = {
        pid: 5
      }

      getDicList(params).then(data => {
        console.log(data)
        this.roleTypeList = data.data.data || []
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
        this.dialogTitle = '新增角色'
      }
    },
    /**
     * @description: 编辑角色
     * @param {Object} item 角色
     * @returns {*} void
     */
    updateRole (item) {
      this.showDialog = true
      this.isEdit = true
      this.dialogTitle = '修改角色'
      for (const k in this.ruleForm) {
        if (k === 'menu_ids') {
          if (typeof (item.menuIds) === 'string' && item.menuIds) {
            this.$set(this.ruleForm, 'menu_ids', item.menuIds.split(','))
          } else {
            this.$set(this.ruleForm, 'menu_ids', [])
          }
        } else {
          this.$set(this.ruleForm, k, item[k])
        }
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
    },
    /**
     * @description: 修改角色状态
     * @param {String} id 角色id
     * @param {Number} status 角色状态
     * @returns {*}
     */
    enableRole (id, status) {
      const params = {
        id: id,
        isEnabled: status
      }

      enableRole(params).then(data => {
        console.log(data)
        this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
        this.showMessageBox('操作成功!', 'success')
      })
    },
    /**
     * @description: 角色新增或修改
     * @param {*} none
     * @returns {*} void
     */
    confirmUpdate () {
      if (!this.validParam()) return
      const params = {
        type: this.ruleForm.type,
        menu_ids: this.ruleForm.menu_ids.join(','),
        name: this.ruleForm.name,
        sort: this.ruleForm.sort,
        describe: this.ruleForm.describe,
        is_enabled: this.ruleForm.is_enabled
      }

      if (this.isEdit) {
        updateRole(Object.assign(params, { id: this.ruleForm.id })).then(data => {
          console.log(data)
          if (data.status === 200) {
            this.showDialog = false
            this.showMessageBox(data.message, 'success')
            this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
          } else {
            this.showDialog = false
            this.showMessageBox(data.message, 'error')
          }
        }).catch(err => {
          console.log(err)
          this.showMessageBox(err.message, 'error')
        })
      } else {
        addRole(params).then(data => {
          console.log(data)
          if (data.status === 200) {
            this.showDialog = false
            this.showMessageBox(data.message, 'success')
            this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
          } else {
            this.showDialog = false
            this.showMessageBox(data.message, 'error')
          }
        }).catch(err => {
          console.log(err)
          this.showMessageBox(err.message, 'error')
        })
      }
    },
    /**
     * @description: 参数验证
     * @param {*} none
     * @returns {*} void
     */
    validParam () {
      if (!this.ruleForm.name) {
        this.showMessageBox('角色名称不能为空！', 'warning')
        return false
      } else if (this.userInfo.role_id === 1 && !this.ruleForm.type) {
        this.showMessageBox('角色类型不能为空！', 'warning')
        return false
      } else if (!this.ruleForm.menu_ids || !this.ruleForm.menu_ids.length) {
        this.showMessageBox('菜单权限不能为空！', 'warning')
        return false
      } else if (!this.ruleForm.sort) {
        this.showMessageBox('角色排序不能为空！', 'warning')
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    showDialog (val) {
      if (!val) {
        for (const key in this.ruleForm) {
          if (key === 'menu_ids') {
            this.ruleForm[key] = []
          } else {
            this.ruleForm[key] = ''
          }
        }
      }
    }
  },
  filters: {
    enableFilter (val) {
      return !val ? '启用' : '关闭'
    }
  }
}
</script>

<style>

</style>
