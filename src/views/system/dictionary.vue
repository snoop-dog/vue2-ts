<!--
 * @Description: 字典管理
 * @Author: snoop-dog
 * @Date: 2021-05-13 23:15:22
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-06-05 00:18:31
 * @FilePath: \vue2-ts\src\views\system\dictionary.vue
-->
<template>
  <el-container class="dic-container table-container">
    <!-- <el-row class="tab-main">
      <el-tabs class="tab-content" v-model="activeDic" closable @tab-click="handleClick" @tab-remove="removeTab">
        <el-tab-pane :label="item.name" :name="String(index)" :key="item.name" v-for="(item, index) in firstDicList">
        </el-tab-pane>
      </el-tabs>
    </el-row> -->

    <el-row class="searchModel">
      <layout-search name="search" :search-param="searchParam" :query-loading='queryLoading' @query="searchList" ></layout-search>
    </el-row>

    <el-row class="tableModel">
      <layout-table
        name="table"
        :pagination="pagination"
        :ending-load="endingLoad"
        :data-list="firstDicList"
        :table-head="tableHead"
        :table-title="tableTitle"
        @title-click="clickTitleBtn"
        ref="multipleTable"
        :oprate="oprate"
      >
        <div slot="id" slot-scope="props">
         <span>{{props.value}}</span>
        </div>
        <div slot="pid" slot-scope="props">
         <span>{{props.value}}</span>
        </div>
        <div slot="name" slot-scope="props">
         <span>{{props.value}}</span>
        </div>
        <div slot="code" slot-scope="props">
         <span>{{props.value}}</span>
        </div>
        <div slot="sort" slot-scope="props">
         <span>{{props.value}}</span>
        </div>
        <div slot="oprate" slot-scope="props">
          <el-button @click.stop="goDetails(props.value.id)" class="btnPrimary">下级字典</el-button>
          <el-button @click.stop="editDic(props.value)" class="btnPrimary">编辑</el-button>
          <el-button @click.stop="deleteDic(props.value.id)" class="btnPrimary">删除</el-button>
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
        <el-form-item label="上级字典：" v-if="isAddSecond">
          <el-select
            clearable
            :multiple="false"
            v-model="ruleForm.pid"
          >
            <el-option
              v-for="item in firstDicList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典名称：" class="required">
          <el-input clearable v-model.trim="ruleForm.name" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="字典值：" class="required">
          <el-input clearable v-model.trim="ruleForm.code" placeholder="请输入字典值"></el-input>
        </el-form-item>
        <el-form-item label="排序：" class="required">
          <el-input
            clearable
            v-model.trim="ruleForm.sort"
            @input="ruleForm.sort=ruleForm.sort.replace(/[^\d]/g,'')"
            @blur="ruleForm.sort=ruleForm.sort.replace(/[^\d]/g,'')"
            placeholder="请输入数字">
          </el-input>
        </el-form-item>
      </el-form>
    </my-dialog>

    <my-dialog
      size="large"
      modal
      class="second-modal"
      :visible.sync="showDialogTable"
      title="二级字典列表"
      :show-btns="false"
    >
      <el-row class="searchModel">
        <layout-search name="secSearch" :search-param="searchParamSec" :query-loading='queryLoadingSec' @query="searchSecList" ></layout-search>
      </el-row>

      <el-row class="tableModel">
        <layout-table
          name="secTable"
          :pagination="paginationSec"
          :ending-load="endingLoadSec"
          :data-list="dataList"
          :table-head="tableHead"
          :table-title="tableTitle"
          @title-click="clickTitleBtn"
          ref="multipleTable"
          :oprate="oprateSec"
        >
          <div slot="id" slot-scope="props">
          <span>{{props.value}}</span>
          </div>
          <div slot="pid" slot-scope="props">
          <span>{{props.value}}</span>
          </div>
          <div slot="name" slot-scope="props">
          <span>{{props.value}}</span>
          </div>
          <div slot="code" slot-scope="props">
          <span>{{props.value}}</span>
          </div>
          <div slot="sort" slot-scope="props">
          <span>{{props.value}}</span>
          </div>
          <div slot="oprate" slot-scope="props">
            <el-button @click.stop="editDic(props.value)" class="btnPrimary">编辑</el-button>
            <el-button @click.stop="deleteDic(props.value.id)" class="btnPrimary">删除</el-button>
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
          <el-form-item label="上级字典：" v-if="isAddSecond">
            <el-select
              clearable
              disabled
              :multiple="false"
              v-model="parentId"
            >
              <el-option
                v-for="item in firstDicList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字典名称：" class="required">
            <el-input clearable v-model.trim="ruleForm.name" placeholder="请输入字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典值：" class="required">
            <el-input clearable v-model.trim="ruleForm.code" placeholder="请输入字典值"></el-input>
          </el-form-item>
          <el-form-item label="排序：" class="required">
            <el-input
              clearable
              v-model.trim="ruleForm.sort"
              @input="ruleForm.sort=ruleForm.sort.replace(/[^\d]/g,'')"
              @blur="ruleForm.sort=ruleForm.sort.replace(/[^\d]/g,'')"
              placeholder="请输入数字">
            </el-input>
          </el-form-item>
        </el-form>
      </my-dialog>

    </my-dialog>
  </el-container>
</template>

<script>
// apis 
import {
  addDictionary,
  delDictionary,
  getDicList,
  updateDictionary,
  insertLog
} from '@/apis/index'

// components
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myDialog from '@/components/common/layout/layout-dialog.vue'
// import myTooltip from '@/components/common/layout/layout-tooltip.vue'

export default {
  name: 'dictionary',
  data () {
    return {
      firstDicList: [], // 一级字典列表
      dataList: [], // 二级字典列表
      activeDic: '0', // 当前选中tab
      searchParam: [
        {
          label: '关键字：',
          type: 'input',
          property: 'name',
          name: '',
          placeholder: '请输入关键字'
        }
      ],
      searchParamSec: [
        {
          label: '关键字：',
          type: 'input',
          property: 'name',
          name: '',
          placeholder: '请输入关键字'
        }
      ],
      queryLoading: false, // 查询loading
      endingLoad: true,
      pagination: { // 分页参数
        totalCount: 0,
        pageCount: 1,
        pageIndex: 1
      },
      tableHead: [ // 表头
        {
          name: 'id',
          prop: 'id',
          value: 'id',
          width: 60
        },
        {
          name: '上级字典id',
          prop: 'pid',
          value: 'pid',
          width: 100
        },
        {
          name: '字典名称',
          prop: 'name',
          value: 'name',
          width: 100
        },
        {
          name: '字典值',
          prop: 'code',
          value: 'code',
          width: 100
        },
        {
          name: '排序',
          prop: 'sort',
          value: 'sort',
          width: 100
        }
      ],
      tableTitle: { // 表格title
        name: '字典列表',
        button: [
          {
            label: '新增',
            value: 'add'
          }
        ]
      },
      oprate: { // 数据操作列
        isShow: true, // 是否含有操作列
        name: '操作',
        fixed: 'right',
        width: 400
      },
      propsParams: {}, // 初始参数
      size: 20, // 每页条数
      ruleForm: {
        id: '',
        pid: 0,
        name: '',
        code: '',
        sort: 1
      },
      showDialog: false,
      isEdit: false,
      dialogTitle: '新增字典',
      isAddSecond: false,
      showDialogTable: false, // 二级字典是否显示
      parentId: '', // 一级字典id
      propsParamsSec: {}, // 二级字典默认参数
      paginationSec: { // 二级字典分页参数
        totalCount: 0,
        pageCount: 1,
        pageIndex: 1
      },
      queryLoadingSec: false,
      endingLoadSec: false,
      sizeSec: 20,
      oprateSec: { // 数据操作列
        isShow: true, // 是否含有操作列
        name: '操作',
        fixed: 'right',
        width: 200
      }
    }
  },
  components: {
    layoutSearch,
    layoutTable,
    myDialog
    // myTooltip
  },
  created () {
    // this.getDicList(0) // 获取一级字典列表
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
        pid: 0,
        name: param.name,
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true

      getDicList(params).then(data => {
        const res = data.data
        this.firstDicList = _.cloneDeep(res.data)
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = data.data.totalPage
        this.pagination.totalCount = data.data.totalCount
        this.pagination.pageIndex = data.data.pageIndex

        insertLog({
          menu_name: '字典管理',
          operation_type: 'query',
          operation_condition: {
            ...params
          },
          sub_menu_name: '',
          operation_type_detail: '查询字典管理列表',
          source: 0
        })
      }).catch(error => {
        cosnole.log(error)
        this.firstDicList = []
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = 1
        this.pagination.totalCount = 0
        this.pagination.pageIndex = 1
      })
    },
    /**
     * @description: 查询二级字典列表
     * @param {Object} param 查询参数
     * @param {Number} val 页码
     * @param {Number} size 每页条数
     * @returns {*} void
     */
    searchSecList (param, val, size) {
      this.propsSecParams = _.cloneDeep(param)
      this.sizeSec = size
      const params = {
        pid: this.parentId,
        name: param.name,
        pageIndex: val,
        pageSize: size
      }

      this.queryLoadingSec = true
      this.endingLoadSec = true

      getDicList(params).then(data => {
        const res = data.data
        this.dataList = _.cloneDeep(res.data)
        this.queryLoadingSec = false
        this.endingLoadSec = false
        this.paginationSec.pageCount = data.data.totalPage
        this.paginationSec.totalCount = data.data.totalCount
        this.paginationSec.pageIndex = data.data.pageIndex

        insertLog({
          menu_name: '字典管理',
          operation_type: 'query',
          operation_condition: {
            ...params
          },
          sub_menu_name: '',
          operation_type_detail: '查询二级字典列表',
          source: 0
        })
      }).catch(error => {
        cosnole.log(error)
        this.dataList = []
        this.queryLoadingSec = false
        this.endingLoadSec = false
        this.paginationSec.pageCount = 1
        this.paginationSec.totalCount = 0
        this.paginationSec.pageIndex = 1
      })
    },
    /**
     * @description: 查看二级字典列表
     * @param {Number} id 一级字典id
     * @returns {*} void
     */    
    goDetails (id) {
      console.log(id)
      this.parentId = id
      this.isAddSecond = true
      this.showDialogTable = true
    },
    /**
     * @description: 获取字典列表
     * @param {Number} pid 上级字典id
     * @returns {*} void
     */
    getDicList (pid) {
      const params = {
        pid
      }

      getDicList(params).then(data => {
        console.log(data)
        if (pid === 0) {
          this.firstDicList = data.data.data
        } else {
          this.dataList = data.data.data
        }
      })
    },
    // handleClick (e) {
    //   console.log(e)
    //   this.activeDic = e.name
    //   this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
    // },
    /**
     * @description: 编辑字典
     * @param {Object} item 
     * @returns {*} void
     */
    editDic (item) {
      this.isEdit = true
      this.dialogTitle = '修改字典'
      this.ruleForm = { ...item }
      this.showDialog = true
    },
    /**
     * @description: 删除一级字典
     * @param {*} idx 一级字典索引
     * @returns {*} void
     */
    removeTab (idx) {
      this.$confirm('是否删除当前字典?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.confirmDelete(this.firstDicList[idx].id)
      }).catch(err => {
        console.log(err)
        this.showMessageBox('已取消！')
      })
    },
    /**
     * @description: 点击表头按钮
     * @param {String} val 表头按钮值
     * @returns {*} void
     */
    clickTitleBtn (val) {
      if (val === 'add') {
        this.dialogTitle = '新增字典'
        this.isEdit = false
        this.showDialog = true
      } else {
        this.dialogTitle = '修改字典'
        this.showDialog = true
        this.isEdit = true
      }
    },
    /**
     * @description: 确认提交表单
     * @param {*}
     * @returns {*}
     */
    confirmUpdate () {
      const params = {
        pid: this.parentId || 0,
        name: this.ruleForm.name,
        code: this.ruleForm.code,
        sort: this.ruleForm.sort
      }

      if (!this.isEdit) {
        addDictionary(params).then(data => {
          if (this.isAddSecond) {
            this.searchSecList(this.propsParamsSec, this.paginationSec.pageIndex, this.sizeSEc)
            insertLog({
              menu_name: '字典管理',
              operation_type: 'add',
              operation_condition: {
                ...params
              },
              sub_menu_name: '',
              operation_type_detail: '添加二级字典',
              source: 0
            })
          } else {
            this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
            insertLog({
              menu_name: '字典管理',
              operation_type: 'add',
              operation_condition: {
                ...params
              },
              sub_menu_name: '',
              operation_type_detail: '添加一级字典',
              source: 0
            })
          }
          this.showDialog = false
          this.showMessageBox(data.message, 'success')
        })
      } else {
        updateDictionary({ ...params, ...{ id: this.ruleForm.id } }).then(data => {
          if (this.isAddSecond) {
            this.searchSecList(this.propsParamsSec, this.paginationSec.pageIndex, this.sizeSEc)
            insertLog({
              menu_name: '字典管理',
              operation_type: 'edit',
              operation_condition: {
                ...params
              },
              sub_menu_name: '',
              operation_type_detail: '修改二级字典',
              source: 0
            })
          } else {
            this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
            insertLog({
              menu_name: '字典管理',
              operation_type: 'edit',
              operation_condition: {
                ...params
              },
              sub_menu_name: '',
              operation_type_detail: '修改一级字典',
              source: 0
            })
          }
          this.showDialog = false
          this.showMessageBox(data.message, 'success')
        })
      }
    },
    /**
     * @description: 删除字典
     * @param {Number} id 字典id
     * @returns {*} void
     */
    deleteDic (id) {
      this.$confirm('是否删除当前字典?', '提示', {
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
     * @description: 确认删除字典
     * @param {Number} id 字典id
     * @returns {*} void
     */
    confirmDelete (id) {
      const params = {
        ids: id
      }

      delDictionary(params).then(data => {
        this.showDialog = false
        this.showMessageBox(data.message, 'success')
        if (this.isAddSecond) {
          this.searchSecList(this.propsParamsSec, this.paginationSec.pageIndex, this.sizeSEc)
          insertLog({
            menu_name: '字典管理',
            operation_type: 'del',
            operation_condition: {
              ...params
            },
            sub_menu_name: '',
            operation_type_detail: '删除二级字典',
            source: 0
          })
        } else {
          this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
          insertLog({
            menu_name: '字典管理',
            operation_type: 'del',
            operation_condition: {
              ...params
            },
            sub_menu_name: '',
            operation_type_detail: '删除一级字典',
            source: 0
          })
        }
      })
    }
  },
  watch: {
    // 监听一级字典弹框显示隐藏
    showDialog (val) {
      if (!val) {
        for (const k in this.ruleForm) {
          this.ruleForm[k] = ''
        }
      }
    },
    // 监听二级字典列表弹框显示隐藏
    showDialogTable (val) {
      if (val) {
        this.isAddSecond = true
      } else {
        this.parentId = 0
        this.isAddSecond = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dic-container {
  width: 100%;
  height: 100%;
  /deep/.tab-main {
    .el-tabs {
      .el-tabs__header  {
        background: #fff;
        padding: 0 1rem;
      }
      .el-tabs__nav-wrap {
        &::after {
          background: transparent;
        }
      }
    }
  }
  /deep/.second-modal {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .modal-box {
      .modal-body {
        background: #efefef;
        .el-form-item {
          .el-form-item__content {
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>
