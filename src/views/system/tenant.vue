<!--
 * @Description: 租户信息
 * @Author: snoop-dog
 * @Date: 2021-05-17 01:08:59
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-25 00:48:37
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
        :oprate="oprate"
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
        <div slot="oprate" slot-scope="props">
          <el-button @click.stop="updateTenant(props.value)" class="btnPrimary">修改</el-button>
          <el-button class="btnPrimary">详情</el-button>
        </div>
      </layout-table>
    </el-row>

    <my-dialog
        size="extra-small"
        modal
        :visible.sync="showDialog"
        title="修改租户信息"
        @submit="confirmUpdate"
      >
        <el-form label-width="8rem" label-position="left" class="alarm-form required-form">
          <el-form-item label="房屋：" class="required">
            <el-select
              clearable
              :multiple="false"
              v-model="ruleForm.house_id"
            >
              <el-option
                v-for="item in houseList"
                :key="item.id"
                :label="item.address"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="租户姓名：" class="required">
            <el-input clearable v-model.trim="ruleForm.name" placeholder="请输入租户姓名"></el-input>
          </el-form-item>
          <el-form-item label="租户性别：" class="required">
            <el-select
              clearable
              :multiple="false"
              v-model="ruleForm.sex"
            >
              <el-option
                v-for="item in sexArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="租户民族：" class="required">
            <el-select
              clearable
              :multiple="false"
              v-model="ruleForm.nation"
            >
              <el-option
                v-for="item in nationArray"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号：" class="required">
            <el-input
              clearable
              v-model.trim="ruleForm.phone"
              @input="ruleForm.phone=ruleForm.phone.replace(/[^\d]/g,'')"
              @blur="ruleForm.phone=ruleForm.phone.replace(/[^\d]/g,'')"
              placeholder="请输入数字">
            </el-input>
          </el-form-item>
          <el-form-item label="身份证：" class="required">
            <el-input
              clearable
              v-model.trim="ruleForm.idcard"
              @input="ruleForm.idcard=ruleForm.idcard.replace(/[^\d]/g,'')"
              @blur="ruleForm.idcard=ruleForm.idcard.replace(/[^\d]/g,'')"
              placeholder="请输入数字">
            </el-input>
          </el-form-item>
          <el-form-item label="详细地址：" class="required">
            <el-input clearable v-model.trim="ruleForm.address" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="承租起始时间：" class="required">
            <date-picker
              v-model="ruleForm.start_time"
              type="date"
              placeholder="承租起始时间"
              format="yyyy-MM-dd"
              clearable
            >
            </date-picker>
          </el-form-item>
          <el-form-item label="承租结束时间：" class="required">
            <date-picker
              v-model="ruleForm.end_time"
              type="date"
              placeholder="承租起始时间"
              format="yyyy-MM-dd"
              clearable
            >
            </date-picker>
          </el-form-item>
        </el-form>
      </my-dialog>
  </el-container>
</template>

<script>
// apis
import { getTenantPage, getHousesList, getNationDic, updateTenant } from '@/apis'

// components
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'
import myDialog from '@/components/common/layout/layout-dialog.vue'
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
      oprate: { // 数据操作列
        isShow: true, // 是否含有操作列
        name: '操作',
        fixed: 'right',
        width: 240
      },
      ruleForm: { // 租户信息表单参数
        id: '', // 租户id
        house_id: '', // 房屋id
        name: '', // 租户姓名
        sex: '', // 租户性别
        nation: '', // 租户民族
        idcard: '', // 租户身份证
        phone: '', // 电话
        address: '', // 租户地址
        start_time: '', // 承租起始时间
        end_time: '' // 承租结束时间
      },
      propsParams: {}, // 初始参数
      showDialog: false, // 租户信息编辑弹框
      sexArray: [ // 性别数组
        {
          label: '男',
          value: 0
        },
        {
          label: '女',
          value: 1
        }
      ],
      nationArray: [], // 民族数组
      houseList: [] // 房屋列表
    }
  },
  components: {
    layoutSearch,
    layoutTable,
    myTooltip,
    myDialog
  },
  created () {
    this.getHousesList()
    this.getNationDic()
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
     * @description: 获取当前用户可以查看的房屋列表
     * @param {*} none
     * @returns {*} void
     */    
    getHousesList () {
      getHousesList({}).then(data => {
        this.houseList = data.data
      })
    },
    /**
     * @description: 获取民族列表
     * @param {*} none
     * @returns {*} void
     */    
    getNationDic () {
      getNationDic({}).then(data => {
        this.nationArray = data.data
      })
    },
    /**
     * @description: 点击表头按钮
     * @param {*} val
     * @returns {*} void
     */
    handleClick (val) {
      console.log(val)
    },
    /**
     * @description: 点击修改按钮
     * @param {Object} item 修改的租户信息
     * @returns {*} void
     */    
    updateTenant (item) {
      console.log(item)
      this.showDialog = true
      for (const k in this.ruleForm) {
        this.ruleForm[k] = item[k]
      }
    },
    /**
     * @description: 新增修改用户参数验证
     * @param {*} none
     * @returns {Boolean} 验证是否通过
     */
    validParam () {
      if (!this.ruleForm.house_id) {
        this.showMessageBox('请选择房屋！', 'warning')
        return false
      } else if (!this.ruleForm.name) {
        this.showMessageBox('请填写租户姓名！', 'warning')
        return false
      } else if (!this.ruleForm.sex) {
        this.showMessageBox('请选择租户性别！', 'warning')
        return false
      } else if (!this.ruleForm.nation) {
        this.showMessageBox('请选择租户民族！', 'warning')
        return false
      } else if (!this.ruleForm.phone) {
        this.showMessageBox('请输入手机号！', 'warning')
        return false
      } else if (!this.ruleForm.idcard) {
        this.showMessageBox('请输入身份证号！', 'warning')
        return false
      } else if (!this.ruleForm.address) {
        this.showMessageBox('请输入详细地址！', 'warning')
        return false
      } else if (!this.ruleForm.start_time) {
        this.showMessageBox('请选择承租起始时间！', 'warning')
        return false
      } else if (!this.ruleForm.end_time) {
        this.showMessageBox('请选择承租结束时间！', 'warning')
        return false
      } else {
        return true
      }
    },
    /**
     * @description: 提交租户编辑表单
     * @param {*} none
     * @returns {*} void
     */    
    confirmUpdate () {
      if (!this.validParam()) return

      const params = {
        id: this.ruleForm.id,
        house_id: this.ruleForm.house_id,
        sex: this.ruleForm.sex,
        nation: this.ruleForm.nation,
        phone: this.ruleForm.phone,
        idcard: this.ruleForm.idcard,
        address: this.ruleForm.address,
        start_time: this.ruleForm.start_time,
        end_time: this.ruleForm.end_time
      }

      updateTenant(params).then(data => {
        this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
        this.showMessageBox('操作成功!', 'success')
      })
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
.ivu-date-picker {
  width: 100%;
}
</style>
