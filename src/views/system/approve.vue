<!--
 * @Description: 我的审批
 * @Author: snoop-dog
 * @Date: 2021-06-02 22:25:21
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-06-09 00:41:05
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
          <div slot="idcard" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
          </div>
          <div slot="address" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | addressFilter"></my-tooltip>
          </div>
          <div slot="create_time" slot-scope="props">
            <my-tooltip width="100%" :value="props.value | dateFilter"></my-tooltip>
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
            <!-- <el-button @click.stop="approveSuccess(props.value)" class="btnPrimary">通过</el-button>
            <el-button @click.stop="approveFail(props.value)" class="btnPrimary">驳回</el-button> -->
            <el-button @click.stop="approveSuccess(props.value)" class="btnPrimary">审核</el-button>
            <el-button v-if="props.value.houses_id" @click.stop="approveDetail(props.value)" class="btnPrimary">详情</el-button>
          </div>
        </layout-table>
      </el-row>
    </el-main>

    <!-- <my-dialog
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
    </my-dialog> -->

    <my-dialog
      size="middle"
      modal
      :visible.sync="showDialog"
      :title="dialogTitle"
      :show-btns="false"
    >
      <el-container class="step-container">
        <!-- <el-steps :active="stepActive" finish-status="success" simple>
          <el-step title="房屋信息" ></el-step>
          <el-step title="房主信息" ></el-step>
          <el-step title="租户信息" ></el-step>
        </el-steps> -->
        <el-tabs class="tab-content" v-model="stepActive">
          <el-tab-pane label="房屋信息" name="1"></el-tab-pane>
          <el-tab-pane label="房主信息" name="2"></el-tab-pane>
          <el-tab-pane label="租户信息" name="3"></el-tab-pane>
        </el-tabs>

        <transition name="el-zoom-in-bottom">
          <el-main class="form-main" v-if="stepActive === '1'">
            <el-form label-width="10rem" label-position="left" class="register-form required-form">
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
              <el-form-item label="房屋类型：" class="required">
                <el-select
                  clearable
                  :multiple="false"
                  v-model="houseObject.houseType"
                >
                  <el-option
                    v-for="item in houseTypeList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="使用类型：" class="required">
                <el-select
                  clearable
                  :multiple="false"
                  v-model="houseObject.useType"
                >
                  <el-option
                    v-for="item in useTypeList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="房屋面积：" class="required">
                <el-input 
                  clearable 
                  v-model.trim="houseObject.houseArea" 
                  placeholder="请输入房屋面积"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="房产证编号：" class="required">
                <el-input 
                  clearable 
                  v-model.trim="houseObject.premisesPermitNo" 
                  placeholder="请输入房产证编号"
                >
                </el-input>
              </el-form-item>
              <transition name="el-zoom-in-center">
                <template>
                  <el-form-item label="省：" class="required">
                    <el-select
                      clearable
                      :multiple="false"
                      v-model="houseObject.province"
                      @change="changeProvice"
                    >
                      <el-option
                        v-for="item in province.data"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </transition>
              <transition name="el-zoom-in-center">
                <template>
                  <el-form-item label="市：" class="required">
                    <el-select
                      clearable
                      :disabled="!houseObject.province"
                      :multiple="false"
                      v-model="houseObject.city"
                      @change="changeCity"
                    >
                      <el-option
                        v-for="item in city.data"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </transition>
              <transition name="el-zoom-in-center">
                <template>
                  <el-form-item label="区/县：" class="required">
                    <el-select
                      clearable
                      :disabled="!houseObject.city"
                      :multiple="false"
                      v-model="houseObject.area"
                      @change="changeCountry"
                    >
                      <el-option
                        v-for="item in area.data"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </transition>
              <transition name="el-zoom-in-center">
                <template>
                  <el-form-item label="街道："  class="required">
                    <el-select
                      clearable
                      :disabled="!houseObject.area"
                      :multiple="false"
                      @change="changeStreet"
                      v-model="houseObject.street"
                    >
                      <el-option
                        v-for="item in street.data"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </transition>
              <transition name="el-zoom-in-center">
                <template>
                  <el-form-item label="社区：" class="required">
                    <el-select
                      clearable
                      :disabled="!houseObject.street"
                      :multiple="false"
                      v-model="houseObject.community"
                    >
                      <el-option
                        v-for="item in community.data"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </transition>
              <el-form-item label="房屋地址：" class="required">
                <el-input 
                  clearable 
                  v-model.trim="houseObject.address" 
                  placeholder="请输入房屋地址"
                >
                </el-input>
              </el-form-item>
            </el-form>
          </el-main>
        </transition>

        <transition name="el-zoom-in-bottom">
          <el-main class="form-main" v-if="stepActive === '2'">
            <el-form label-width="8rem" label-position="left" class="register-form required-form">
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
              <el-form-item label="房主类型：" class="required">
                <el-select
                  :multiple="false"
                  v-model="ownerObject.owners_type"
                >
                  <el-option
                    v-for="item in ownerTypeArray"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <transition name="el-zoom-in-center">
                <el-form-item v-if="ownerObject.owners_type === 2" label="负责人姓名：" class="required">
                  <el-input 
                    clearable 
                    v-model.trim="ownerObject.name" 
                    placeholder="请输入负责人姓名"
                  >
                  </el-input>
                </el-form-item>
              </transition>
              <transition name="el-zoom-in-center">
                <el-form-item v-if="ownerObject.owners_type === 2" label="公司名称：" class="required">
                  <el-input 
                    clearable 
                    v-model.trim="ownerObject.companyName" 
                    placeholder="请输入公司名称"
                  >
                  </el-input>
                </el-form-item>
              </transition>
              <transition name="el-zoom-in-center">
                <el-form-item v-if="ownerObject.owners_type === 2" label="营业执照：" class="required">
                  <el-input 
                    clearable 
                    v-model.trim="ownerObject.businessLicense" 
                    placeholder="请输入营业执照"
                  >
                  </el-input>
                </el-form-item>
              </transition>
              <transition name="el-zoom-in-center">
                <el-form-item v-if="ownerObject.owners_type === 1" label="户主姓名：" class="required">
                  <el-input 
                    clearable 
                    v-model.trim="ownerObject.name" 
                    placeholder="请输入户主姓名"
                  >
                  </el-input>
                </el-form-item>
              </transition>
              <transition name="el-zoom-in-center">
                <el-form-item v-if="ownerObject.owners_type === 1" label="民族：" class="required">
                  <el-select
                    clearable
                    :multiple="false"
                    placeholder="请选择民族"
                    v-model="ownerObject.nation"
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
              </transition>
              <transition name="el-zoom-in-center">
                <el-form-item v-if="ownerObject.owners_type === 1" label="性别：" class="required">
                  <el-select
                    clearable
                    :multiple="false"
                    placeholder="请选择性别"
                    v-model="ownerObject.sex"
                  >
                    <el-option
                      v-for="item in sexArray"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </transition>
              <el-form-item label="手机号：" class="required">
                <el-input 
                  clearable 
                  v-model.trim="ownerObject.phone" 
                  placeholder="请输入手机号"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="身份证号：" class="required">
                <el-input 
                  clearable 
                  v-model.trim="ownerObject.idcard" 
                  placeholder="请输入身份证号"
                >
                </el-input>
              </el-form-item>
              <transition name="el-zoom-in-center">
                <el-form-item v-if="ownerObject.owners_type === 1" label="籍贯：" class="required">
                  <el-input 
                    clearable 
                    v-model.trim="ownerObject.address" 
                    placeholder="请输入籍贯"
                  >
                  </el-input>
                </el-form-item>
              </transition>
              <transition name="el-zoom-in-center">
                <el-form-item v-if="ownerObject.owners_type === 2" label="公司地址：" class="required">
                  <el-input 
                    clearable 
                    v-model.trim="ownerObject.address" 
                    placeholder="请输入公司地址"
                  >
                  </el-input>
                </el-form-item>
              </transition>
            </el-form>
          </el-main>
        </transition>

        <transition name="el-zoom-in-bottom">
          <el-main class="form-main tenant-main" v-if="stepActive === '3'">
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
            <el-row class="tenant-box" v-for="(item, index) in tenantArray" :key="index">
              <el-row class="tenant-title">
                <el-col :span="20" class="label-text">租户信息{{index + 1}}</el-col>
                <el-col :span="4" class="close-icon" v-if="tenantArray.length > 1">
                  <i class="el-icon-circle-close" @click.stop="deleteTenant(index)"></i>
                </el-col>
              </el-row>
              <el-form label-width="8rem" label-position="left" class="register-form required-form">
                <el-form-item label="租户姓名：" class="required">
                  <el-input 
                    clearable 
                    v-model.trim="item.name" 
                    placeholder="请输入租户姓名"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="民族：" class="required">
                  <el-select
                    clearable
                    :multiple="false"
                    placeholder="请选择民族"
                    v-model="item.nation"
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
                <el-form-item label="性别：" class="required">
                  <el-select
                    clearable
                    :multiple="false"
                    placeholder="请选择性别"
                    v-model="item.sex"
                  >
                    <el-option
                      v-for="item in sexArray"
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
                    v-model.trim="item.phone" 
                    placeholder="请输入手机号"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="身份证号：" class="required">
                  <el-input 
                    clearable 
                    v-model.trim="item.idcard" 
                    placeholder="请输入身份证号"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="籍贯：" class="required">
                  <el-input 
                    clearable 
                    v-model.trim="item.address" 
                    placeholder="请输入籍贯"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="承租起始时间：" class="required">
                  <date-picker
                    v-model="item.startTime"
                    type="date"
                    placeholder="承租起始时间"
                    format="yyyy-MM-dd"
                    clearable
                  >
                  </date-picker>
                </el-form-item>
                <el-form-item label="承租结束时间：" class="required">
                  <date-picker
                    v-model="item.endTime"
                    type="date"
                    placeholder="承租起始时间"
                    format="yyyy-MM-dd"
                    clearable
                  >
                  </date-picker>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row class="add-box">
              <i class="el-icon-circle-plus-outline" @click.stop="addTenant"></i>
            </el-row>
          </el-main>
        </transition>

        <el-row class="btn-box">
          <el-button type="primary">审批</el-button>
          <el-button type="primary">驳回</el-button>
        </el-row>
      </el-container>
    </my-dialog>
  </el-container>
</template>

<script>
// apis
import { 
  getTaskPage, 
  processingTask, 
  insertLog,
  getHousePage, 
  getDicList, 
  getAreaDim, 
  getNationDic, 
  addTenant, 
  addTenants
  } from '@/apis/index'

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
          name: '房主身份证',
          prop: 'idcard',
          value: 'idcard'
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
        width: 200
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
      dialogTitle: '审批',
      houseObject: { // 房屋信息
        houseType: '',
        useType: '',
        houseArea: '',
        premisesPermitNo: '',
        address: '',
        province: '',
        city: '',
        area: '',
        street: '',
        community: ''
      },
      ownerObject: { // 户主信息
        name: '',
        sex: '',
        nation: '',
        phone: '',
        idcard: '',
        address: '',
        companyName: '',
        businessLicense: '',
        owners_type: 1
      },
      tenantArray: [ // 租户信息
        {
          name: '',
          nation: '',
          sex: '',
          phone: '',
          idcard: '',
          address: '',
          startTime: '',
          endTime: ''
        }
      ],
      stepActive: '1', // 添加出租登记流程步骤
      useTypeList: [], // 房屋使用类型字典
      houseTypeList: [], // 房屋类型字典
      street: { // 弹框街道数据
        data: [],
        value: ''
      },
      area: { // 弹框区县数据
        data: [],
        value: ''
      },
      city: { // 弹框城市数据
        data: [],
        value: ''
      },
      province: { // 弹框省数据
        data: [],
        value: ''
      },
      community: {
        data: [],
        value: ''
      },
      ownerTypeArray: [
        { name: '个人', id: 1 },
        { name: '企业', id: 2 }
      ],
      tempTenant: { // 租户模板
        name: '',
        nation: '',
        sex: '',
        phone: '',
        idcard: '',
        address: '',
        startTime: '',
        endTime: ''
      },
      nationArray: [], // 民族字典
      sexArray: [ // 性别字典
        { name: '男', id: 0 },
        { name: '女', id: 1 }
      ]
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

        insertLog({
          menu_name: '我的审批',
          operation_type: 'query',
          operation_condition: {
            ...params
          },
          sub_menu_name: '',
          operation_type_detail: '查询我的审批列表',
          source: 0
        })
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

        insertLog({
          menu_name: '我的审批',
          operation_type: 'query',
          operation_condition: {
            ...params
          },
          sub_menu_name: '',
          operation_type_detail: this.ruleForm.state === 2 ? '审批' : '驳回',
          source: 0
        })
        this.showDialog = false
      }).catch(err => {
        this.showDialog = false
        this.showMessageBox(err.message, 'error')
      })
    },
    /**
     * @description: 添加租户
     * @param {*} none
     * @returns {*} void
     */    
    addTenant () {
      this.tenantArray.push(this.tempTenant)
    },
    /**
     * @description: 改变省级数据
     * @param {Number} val 改变后数据
     * @returns {*} void
     */
    changeProvice (val) {
      if (!val) {
        this.city.data = []
        this.houseObject.city = ''
        this.area.data = []
        this.houseObject.area = ''
        this.street.data = []
        this.houseObject.street = ''
        this.community.data = []
        this.houseObject.community = ''
        return
      }
      const params = {
        level: 2,
        pid: val
      }

      getAreaDim(params).then(data => {
        this.city.data = data.data
      }).catch(err => {
        console.log(err)
        this.city.data = []
      })
    },
    /**
     * @description: 改变市级数据
     * @param {Number} val 改变后数据
     * @returns {*} void
     */
    changeCity (val) {
      if (!val) {
        this.area.data = []
        this.houseObject.area = ''
        this.street.data = []
        this.houseObject.street = ''
        this.community.data = []
        this.houseObject.community = ''
        return
      }
      const params = {
        level: 3,
        pid: val
      }

      getAreaDim(params).then(data => {
        this.area.data = data.data
      }).catch(err => {
        console.log(err)
        this.area.data = []
      })
    },
    /**
     * @description: 改变市级数据
     * @param {Number} val 改变后数据
     * @returns {*} void
     */
    changeCountry (val) {
      if (!val) {
        this.street.data = []
        this.houseObject.street = ''
        this.community.data = []
        this.houseObject.community = ''
        return
      }
      const params = {
        level: 4,
        pid: val
      }

      getAreaDim(params).then(data => {
        this.street.data = data.data
      }).catch(err => {
        console.log(err)
        this.street.data = []
      })
    },
    /**
     * @description: 改变街道数据
     * @param {Number} val 改变后数据
     * @returns {*} void
     */
    changeStreet (val) {
      if (!val) {
        this.community.data = []
        this.houseObject.community = ''
        return
      }
      const params = {
        level: 5,
        pid: val
      }

      getAreaDim(params).then(data => {
        this.community.data = data.data
      }).catch(err => {
        console.log(err)
        this.community.data = []
      })
    },
    /**
     * @description: 通过我的审批
     * @param {*} none
     * @returns {*} void
     */    
    submitRegisterInfo () {
      if (!this.validTenantParam()) return

      const tenantParam = []
      this.tenantArray.map(item => {
        const object = {
          name: item.name,
          nation: item.nation,
          sex: item.sex,
          idcard: item.idcard,
          phone: item.phone,
          address: item.address,
          startTime: item.startTime,
          endTime: item.endTime
        }
        tenantParam.push(object)
      })

      const houseParam = {
        housingNature: this.houseObject.houseType,
        planningPurposes: this.houseObject.useType,
        constructionArea: this.houseObject.houseArea,
        premisesPermitNo: this.houseObject.premisesPermitNo,
        province: this.houseObject.province,
        city: this.houseObject.city,
        area: this.houseObject.area,
        street: this.houseObject.street,
        community: this.houseObject.community,
        address: this.houseObject.address
      }

      const ownerParam = {
        name: this.ownerObject.name,
        owners_type: this.ownerObject.owners_type,
        nation: this.ownerObject.nation,
        sex: this.ownerObject.sex,
        phone: this.ownerObject.phone,
        idcard: this.ownerObject.idcard,
        address: this.ownerObject.address,
        companyName: this.ownerObject.owners_type === 2 ? this.ownerObject.companyName : '',
        businessLicense: this.ownerObject.owners_type === 2 ? this.ownerObject.businessLicense : ''
      }

      if (this.isEdit) {
        ownerParam.id = this.ownerId
        houseParam.id = this.houseId
        tenantParam.map((item, index) => {
          item.id = this.tenantArray[index].id
          item.house_id = this.houseId
        })
      }
      
      houseParam.tenants = tenantParam
      ownerParam.house = houseParam

      if (this.isEdit) {
        updateRegisterInfo(ownerParam).then(data => {
          if (data.status === 200) {
            this.showMessageBox(data.message, 'success')
          } else {
            this.showMessageBox(data.message, 'error')
          }
          this.showDialog = false
          this.searchList(this.propsParams, this.pagination.pageIndex, this.size)

          insertLog({
            menu_name: '出租登记列表',
            operation_type: 'edit',
            operation_condition: {
              ...params
            },
            sub_menu_name: '',
            operation_type_detail: '修改出租登记',
            source: 0
          })
        })
      } else {
        if (!this.isAdd) {
          addTenant(ownerParam).then(data => {
            if (data.status === 200) {
              this.showMessageBox(data.message, 'success')
            } else {
              this.showMessageBox(data.message, 'error')
            }
            this.showDialog = false
            this.searchList(this.propsParams, this.pagination.pageIndex, this.size)

            insertLog({
              menu_name: '出租登记列表',
              operation_type: 'add',
              operation_condition: {
                ...params
              },
              sub_menu_name: '',
              operation_type_detail: '补录租户',
              source: 0
            })
          })
        } else {
          tenantParam.map(item => {
            item.house_id = this.house_id
          })
          addTenants(tenantParam).then(data => {
            if (data.status === 200) {
              this.showMessageBox(data.message, 'success')
            } else {
              this.showMessageBox(data.message, 'error')
            }
            this.showDialog = false
            this.searchList(this.propsParams, this.pagination.pageIndex, this.size)

            insertLog({
              menu_name: '出租登记列表',
              operation_type: 'add',
              operation_condition: {
                ...params
              },
              sub_menu_name: '',
              operation_type_detail: '新增出租登记信息',
              source: 0
            })
          })
        }
      }
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
    },
    dateFilter (val) {
      if (!val) {
        return '--'
      } else {
        return val.split(' ')[0]
      }
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

/deep/.modal {
  .modal-body {
    max-height: 44rem;
    overflow-y: hidden;
    padding: 1rem 4rem;
  }
}

.step-container {
  display: flex;
  flex-direction: column;
  .el-steps {
    width: 100%;
  }
  .form-main {
    flex: 0 0 36rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &.tenant-main {
      justify-content: unset;
      align-items: unset;
      .register-form {
        padding-top: 0;
        &.alarm-form {
          padding-top: 2rem;
        }
      }
    }
    .register-form {
      width: 100%;
      margin: 0 auto;
      height: 100%;
      overflow-y: auto;
      padding-top: 2rem;
      .el-form-item {
        width: 70%;
        margin: 0 auto;
        margin-bottom: 0.2rem;
      }
    }
    .alarm-form {
      padding-top: 2rem;
      .el-form-item {
        width: 70%;
        margin: 0 auto;
        margin-bottom: 0.2rem;
      }
    }
    .tenant-box {
      width: 100%;
      margin: 0.2rem 0;
      .tenant-title {
        width: 60%;
        height: 2rem;
        margin: 0.5rem auto;
        line-height: 2rem;
        font-size: 1.4rem;
        .label-text {
          text-align: left;
          text-indent: 3em;
          color: #fa4;
        }
      }
    }
    .add-box {
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      font-size: 1.6rem;
    }
  }
  .btn-box {
    flex: 0 0 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ivu-date-picker {
    width: 100%;
  }

  /deep/.el-tabs {
    .el-tabs__header {
      margin-bottom: 0;
      .el-tabs__nav-scroll {
        display: flex;
        justify-content: center;
        .el-tabs__item {
          padding: 0 50px;
        }
      }
      .el-tabs__nav-wrap {
        &::after {
          background: transparent;
        }
      }
    }
  }
}
</style>
