<!--
 * @Description: 我的审批
 * @Author: snoop-dog
 * @Date: 2021-06-02 22:25:21
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-06-03 22:51:43
 * @FilePath: \vue2-ts\src\views\system\approve.vue
-->

<template>
  <el-container class="approve-container">
    <el-main class="type-main">
      <el-tabs tab-position="left" v-model="activeTab">
        <el-tab-pane label="待核实" name="1"></el-tab-pane>
        <el-tab-pane label="审批记录" name="2"></el-tab-pane>
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
          <div slot="homeownerName" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="homeownerPhone" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="address" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | addressFilter"></my-tooltip>
          </div>
          <div slot="create_time" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="applicantName" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="phone" slot-scope="props">
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
            <el-button @click.stop="approveSuccess(props.value)" class="btnPrimary">通过</el-button>
            <el-button @click.stop="approveFail(props.value)" class="btnPrimary">驳回</el-button>
            <el-button v-if="props.value.houses_id" @click.stop="approveDetail(props.value)" class="btnPrimary">详情</el-button>
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
  name: 'approve',
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
          name: '房主姓名',
          prop: 'homeownerName',
          value: 'homeownerName'
        },
        {
          name: '房主电话',
          prop: 'homeownerPhone',
          value: 'homeownerPhone'
        },
        {
          name: '详细地址',
          prop: 'address',
          value: 'address',
          showRow: true,
          width: 140
        },
        {
          name: '创建时间',
          prop: 'create_time',
          value: 'create_time',
          width: 120
        },
        {
          name: '申请人姓名',
          prop: 'applicantName',
          value: 'applicantName'
        },
        {
          name: '申请人电话',
          prop: 'phone',
          value: 'phone'
        },
        {
          name: '处理时间',
          prop: 'dispose_time',
          value: 'dispose_time'
        }
      ],
      oprate: { // 数据操作列
        isShow: true, // 是否含有操作列
        name: '操作',
        fixed: 'right',
        width: 300
      },
      tableTitle: { // 表格title
        name: '审批列表'
      },
      activeTab: '1',
      keyword: '',
      pageIndex: 1,
      size: 20,
      ruleForm: { // 审批表单
        id: '',
        state: '',
        describe: ''
      },
      showDialog: false, // 弹框是否展示
      dialogTitle: '审批'
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
        type: 1,
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
     * @description: 审批通过
     * @param {*} item
     * @returns {*} void
     */    
    approveSuccess (item) {
      console.log(item)
      this.showDialog = true
      this.dialogTitle = '审批'
      this.ruleForm.id = item.id
      this.ruleForm.state = 2
    },
    /**
     * @description: 审批驳回
     * @param {*} item
     * @returns {*} void
     */
    approveFail (item) {
      console.log(item)
      this.showDialog = true
      this.dialogTitle = '驳回'
      this.ruleForm.id = item.id
      this.ruleForm.state = 3
    },
    /**
     * @description: 确认弹框
     * @param {*} none
     * @returns {*} void
     */    
    confirmUpdate () {
      const params = {
        id: this.ruleForm.id,
        state: this.ruleForm.state,
        describe: this.ruleForm.describe
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
    },
    /**
     * @description: 跳转详情
     * @param {object} item 跳转数据
     * @returns {*} none
     */    
    approveDetail (item) {
      console.log(item)
      const id = item.houses_id
      this.$store.commit(
        'addTabList',
        {
          url: '/rent/detail',
          param: {
            id: id,
            type: 2
          }
        }
      )
      this.$router.push({
        path: '/rent/detail',
        query: {
          id: id,
          type: 2
        }
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
            name: '用户名',
            prop: 'user_name',
            value: 'user_name'
          },
          {
            name: '处理说明',
            prop: 'describe',
            value: 'describe'
          }
        ])
      } else {
        this.$set(this.oprate, 'isShow', true)
        this.tableHead.splice(this.tableHead.length - 2, 2)
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
.approve-container {
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
