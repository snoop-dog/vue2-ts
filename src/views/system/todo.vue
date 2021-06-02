<!--
 * @Description: 我的待办
 * @Author: snoop-dog
 * @Date: 2021-06-02 22:25:21
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-06-03 01:52:35
 * @FilePath: \vue2-ts\src\views\system\todo.vue
-->

<template>
  <el-container class="todo-container">
    <el-main class="type-main">
      <el-tabs tab-position="left" v-model="activeTab">
        <el-tab-pane label="待处理" name="1"></el-tab-pane>
        <el-tab-pane label="待办记录" name="2"></el-tab-pane>
      </el-tabs>
    </el-main>
    <el-main class="table-container">
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
          :oprate="oprate"
          ref="multipleTable"
        >
          <div slot="content" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="typeStr" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="applicantName" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="phone" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="create_time" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="address" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="start_time" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="end_time" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="dispose_time" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="user_name" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="describe" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="oprate" slot-scope="props">
            <el-button @click.stop="approveSuccess(props.value)" class="btnPrimary">续租</el-button>
            <el-button @click.stop="approveFail(props.value)" class="btnPrimary">停租</el-button>
            <el-button @click.stop="approveIgnore(props.value)" class="btnPrimary">忽略</el-button>
          </div>
        </layout-table>
      </el-row>
    </el-main>

    <my-dialog
      size="extra-small"
      modal
      :visible.sync="showDialog"
      :title="dialogTitle"
      @submit="confirmUpdate"
    >
      <el-form label-width="8rem" label-position="left" class="alarm-form required-form">
        <el-form-item label="续租时间：" v-if="ruleForm.state === 2">
          <date-picker
            v-model="ruleForm.end_time"
            format="yyyy-MM-dd HH:mm:ss"
            clearable
            type="datetime"
            placeholder="续租时间">
          </date-picker>
        </el-form-item>
        <el-form-item label="停租时间：" v-if="ruleForm.state === 3">
          <date-picker
            v-model="ruleForm.end_time"
            format="yyyy-MM-dd HH:mm:ss"
            clearable
            type="datetime"
            placeholder="停租时间">
          </date-picker>
        </el-form-item>
        <el-form-item label="处理说明：">
          <el-input 
            v-model.trim="ruleForm.describe" 
            type="textarea" 
            resize='none' 
            :rows="4" 
            placeholder="请输入处理说明"
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
import { getTaskPage, processingTask } from '@/apis/index'

// utils
import { doDateTimeShift } from '@/utils/date'

// components
import layoutTable from '@/components/common/layout/layout-table.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'
import myDialog from '@/components/common/layout/layout-dialog.vue'
import layoutSearch from '@/components/common/layout/layout-search.vue'

export default {
  name: 'todo',
  data () {
    return {
      dataList: [], // 列表数据
      queryLoading: false, // 查询loading
      endingLoad: true,
      searchParam: [
        {
          label: '关键字：',
          type: 'input',
          property: 'keyword',
          keyword: '',
          placeholder: '请输入关键字'
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
      pagination: { // 分页参数
        totalCount: 0,
        pageCount: 0,
        pageIndex: 1
      },
      tableHead: [ // 表头
        {
          name: '申请内容',
          prop: 'content',
          value: 'content'
        },
        {
          name: '任务类型',
          prop: 'typeStr',
          value: 'typeStr'
        },
        {
          name: '租户姓名',
          prop: 'applicantName',
          value: 'applicantName'
        },
        {
          name: '租户电话',
          prop: 'phone',
          value: 'phone'
        },
        {
          name: '创建时间',
          prop: 'create_time',
          value: 'create_time',
          width: 120
        },
        {
          name: '房屋地址',
          prop: 'address',
          value: 'address',
          width: 140
        },
        {
          name: '承租起始时间',
          prop: 'start_time',
          value: 'start_time',
          width: 120
        },
        {
          name: '承租结束时间',
          prop: 'end_time',
          value: 'end_time',
          width: 120
        }
      ],
      oprate: { // 数据操作列
        isShow: true, // 是否含有操作列
        name: '操作',
        fixed: 'right',
        width: 300
      },
      tableTitle: { // 表格title
        name: '待办列表'
      },
      activeTab: '1',
      keyword: '',
      pageIndex: 1,
      size: 20,
      ruleForm: { // 审批表单
        id: '',
        state: '',
        end_time: '',
        describe: ''
      },
      showDialog: false, // 弹框是否展示
      dialogTitle: '续租'
    }
  },
  components: {
    layoutTable,
    myTooltip,
    myDialog,
    layoutSearch
  },
  methods: {
    /**
     * @description: 查询出租房屋列表数据
     * @param {*} none
     * @returns {*} void
     */
    searchList (param, val, size) {
      const params = {
        keyword: param.keyword,
        type: 2,
        state: this.activeTab === '1' ? 1 : '',
        start_time: doDateTimeShift(param.time[0]),
        end_time: doDateTimeShift(param.time[1]),
        user_id: this.$store.state.id,
        pageIndex: val,
        pageSize: size
      }

      this.propsParams = _.cloneDeep(param)
      this.queryLoading = true
      this.endingLoad = true
      this.size = size

      getTaskPage(params).then(data => {
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
     * @description: 续租
     * @param {*} item
     * @returns {*} void
     */   
    approveSuccess (item) {
      this.showDialog = true
      this.dialogTitle = '续租'
      this.ruleForm.id = item.id
      this.ruleForm.state = 2
    },
    /**
     * @description: 停租
     * @param {*} item
     * @returns {*} void
     */   
    approveFail (item) {
      this.showDialog = true
      this.dialogTitle = '停租'
      this.ruleForm.id = item.id
      this.ruleForm.state = 3
    },
    /**
     * @description: 忽略
     * @param {*} item
     * @returns {*} void
     */   
    approveIgnore (item) {
      this.showDialog = true
      this.dialogTitle = '忽略'
      this.ruleForm.id = item.id
      this.ruleForm.state = 4
    },
    confirmUpdate () {
      const params = {
        id: this.ruleForm.id,
        state: this.ruleForm.state,
        describe: this.ruleForm.describe,
        end_time: doDateTimeShift(this.ruleForm.end_time)
      }

      processingTask(params).then(data => {
        console.log(data)
        if (data.status === 200) {
          this.showMessageBox(data.message, 'success')
          this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
        } else {
          this.showMessageBox(data.message, 'error')
        }
        this.showDialog = false
      }).catch(err => {
        this.showDialog = false
        this.showMessageBox(err.message, 'error')
      })
    }
  },
  watch: {
    activeTab (val) {
      console.log(val)
      if (val === '2') {
        this.$set(this.oprate, 'isShow', false)
        this.tableHead = this.tableHead.concat([
          {
            name: '处理人',
            prop: 'user_name',
            value: 'user_name'
          },
          {
            name: '处理时间',
            prop: 'dispose_time',
            value: 'dispose_time'
          },
          {
            name: '处理说明',
            prop: 'describe',
            value: 'describe'
          }
        ])
      } else {
        this.$set(this.oprate, 'isShow', true)
        this.tableHead.splice(this.tableHead.length - 3, 3)
      }
      this.propsParams.keyword = ''
      this.pagination.pageIndex = 1
      this.size = 20
      this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
    },
    showDialog (val) {
      if (!val) {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = ''
        }
      }
    }
  },
  filters: {
    nullTextFilter (val) {
      return val || '--'
    },
    sexFilter (val) {
      return val ? '女' : '男'
    },
    addressFilter (val) {
      return (val.provinceStr || '') + (val.cityStr || '') + (val.areaStr || '') +
        (val.streetStr || '') + (val.communityStr || '') + (val.address || '')
    }
  }
}
</script>

<style lang="scss" scoped>
.todo-container {
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
      margin-top: 0.66rem;
      // border-top-left-radius: 0;
      // border-bottom-left-radius: 0;
    }
  }
}
</style>
