<!--
 * @Description: 出租登记
 * @Author: snoop-dog
 * @Date: 2021-04-24 15:00:07
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-06-16 23:56:04
 * @FilePath: \vue2-ts\src\views\rent\register.vue
-->
<template>
  <el-container class="register-container table-container">
    <el-row class="searchModel">
      <layout-search 
        :search-param="searchParam" 
        :query-loading='queryLoading' 
        @change="changeParam"  
        @query="searchList"
      >
      </layout-search>
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
        :oprate="oprate"
        ref="multipleTable"
        >
        <div slot="ownername" slot-scope="props">
          <my-tooltip width="100%" :value="props.value.homeownerInfo.name | nullTextFilter"></my-tooltip>
        </div>
        <div slot="nation" slot-scope="props">
          <my-tooltip width="100%" :value="props.value.homeownerInfo.nationStr | nullTextFilter"></my-tooltip>
        </div>
        <div slot="idcard" slot-scope="props">
          <my-tooltip width="100%" :value="props.value.homeownerInfo.idcard | nullTextFilter"></my-tooltip>
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
        <div slot="address" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="housingNatureStr" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="planningPurposesStr" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="constructionArea" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="premisesPermitNo" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="oprate" slot-scope="props">
          <el-button @click.stop="updateRegister(props.value)" class="btnPrimary">修改</el-button>
          <el-button class="btnPrimary" @click.stop="addTenants(props.value)">租户补录</el-button>
          <el-button class="btnPrimary" @click.stop="goRegisterDetail(props.value.id)">详情</el-button>
        </div>
      </layout-table>
    </el-row>

    <my-dialog
      size="middle"
      modal
      :visible.sync="showDialog"
      :title="dialogTitle"
      :show-btns="false"
    >
      <el-container class="step-container">
        <el-steps :active="stepActive" finish-status="success" simple>
          <el-step title="房屋信息" ></el-step>
          <el-step title="房主信息" ></el-step>
          <el-step title="租户信息" ></el-step>
        </el-steps>

        <transition name="el-zoom-in-bottom">
          <el-main class="form-main" v-if="stepActive === 1">
            <el-form label-width="10rem" label-position="left" class="alarm-form required-form">
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
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
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
          <el-main class="form-main" v-if="stepActive === 2">
            <el-form label-width="8rem" label-position="left" class="alarm-form required-form">
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
          <el-main class="form-main tenant-main" v-if="stepActive === 3">
            <el-row class="tenant-box" v-for="(item, index) in tenantArray" :key="index">
              <el-row class="tenant-title">
                <el-col :span="20" class="label-text">租户信息{{index + 1}}</el-col>
                <el-col :span="4" class="close-icon" v-if="tenantArray.length > 1 && !isEdit">
                  <i class="el-icon-circle-close" @click.stop="deleteTenant(index)"></i>
                </el-col>
              </el-row>
              <el-form label-width="8rem" label-position="left" class="alarm-form required-form">
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
            <el-row class="add-box" v-if="!isEdit">
              <i class="el-icon-circle-plus-outline" @click.stop="addTenant"></i>
            </el-row>
          </el-main>
        </transition>

        <el-row class="btn-box">
          <el-button v-if="stepActive !== 1 && !isAdd" @click.stop="prevStep" type="primary">上一步</el-button>
          <el-button v-if="stepActive !== 3" @click.stop="nextStep" type="primary">下一步</el-button>
          <el-button v-else type="primary" @click.stop="submitRegisterInfo">提交</el-button>
        </el-row>
      </el-container>
    </my-dialog>
  </el-container>
</template>

<script>
// apis
import { 
  getHousePage, 
  getDicList, 
  getAreaDim, 
  getNationDic, 
  addTenant, 
  addTenants,
  insertLog,
  getRegisterDetail,
  updateRegisterInfo
} from '@/apis/index'

// components
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'
import myDialog from '@/components/common/layout/layout-dialog.vue'

// utils
import { verifyPhoneFormat } from '@/utils/index'

export default {
  name: 'register',
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
        },
        {
          label: '省：',
          type: 'select',
          data: [],
          property: 'province',
          province: '',
          multiple: false,
          placeholder: '请选择'
        },
        {
          label: '市：',
          type: 'select',
          data: [],
          property: 'city',
          city: '',
          multiple: false,
          disabled: true,
          placeholder: '请选择'
        },
        {
          label: '区/县：',
          type: 'select',
          data: [],
          property: 'area',
          area: '',
          multiple: false,
          disabled: true,
          placeholder: '请选择'
        },
        {
          label: '街道：',
          type: 'select',
          data: [],
          property: 'street',
          street: '',
          multiple: false,
          disabled: true,
          placeholder: '请选择'
        },
        {
          label: '社区：',
          type: 'select',
          data: [],
          property: 'community',
          community: '',
          multiple: false,
          disabled: true,
          placeholder: '请选择'
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
          name: '户主姓名',
          prop: 'ownername',
          value: 'ownername',
          showRow: true,
          width: 100
        },
        {
          name: '民族',
          prop: 'nation',
          value: 'nation',
          showRow: true,
          width: 60
        },
        {
          name: '身份证',
          prop: 'idcard',
          value: 'idcard',
          showRow: true,
          width: 200
        },
        {
          name: '省',
          prop: 'provinceStr',
          value: 'provinceStr',
          width: 80
        },
        {
          name: '市',
          prop: 'cityStr',
          value: 'cityStr',
          width: 80
        },
        {
          name: '区/县',
          prop: 'areaStr',
          value: 'areaStr',
          width: 80
        },
        {
          name: '街道',
          prop: 'streetStr',
          value: 'streetStr',
          width: 100
        },
        {
          name: '社区',
          prop: 'communityStr',
          value: 'communityStr',
          width: 100
        },
        {
          name: '详细地址',
          prop: 'address',
          value: 'address',
          width: 120
        },
        {
          name: '房屋性质',
          prop: 'housingNatureStr',
          value: 'housingNatureStr',
          width: 100
        },
        {
          name: '规划用途',
          prop: 'planningPurposesStr',
          value: 'planningPurposesStr',
          width: 100
        },
        {
          name: '房屋面积',
          prop: 'constructionArea',
          value: 'constructionArea',
          width: 100
        },
        {
          name: '房产证编号',
          prop: 'premisesPermitNo',
          value: 'premisesPermitNo',
          width: 100
        }
      ],
      oprate: { // 数据操作列
        isShow: true, // 是否含有操作列
        name: '操作',
        fixed: 'right',
        width: 350
      },
      tableTitle: { // 表格title
        name: '出租登记',
        button: [
          {
            label: '添加',
            value: 'addObject'
          }
          // {
          //   label: '全部导出',
          //   value: 'allDownload',
          //   iconfont: 'el-icon-download'
          // }
        ]
      },
      propsParams: {
        keyword: '',
        provice: '',
        city: '',
        area: '',
        street: '',
        community: ''
      }, // 初始参数
      showDialog: false, // 添加出租登记信息弹框
      dialogTitle: '添加出租登记', // dialog title
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
      stepActive: 1, // 添加出租登记流程步骤
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
      ],
      isEdit: false, // 是否是修改数据
      ownerId: '', // 房主id
      houseId: '', // 房屋id
      tenantId: '',
      isAdd: false, // 是否补录租户
      house_id: ''
    }
  },
  components: {
    layoutSearch,
    layoutTable,
    myTooltip,
    myDialog
  },
  created () {
    // this.searchList()
    this.getRegionSimple()
    this.getNationDic() // 获取民族字典
    // this.getProviceData() // 获取省份数据
    this.getHouseTypeList() // 获取房屋类型字典
    this.getUseTypeList() // 获取房屋使用类型字典
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
        keyword: param.keyword,
        province: param.province,
        city: param.city,
        community: param.community,
        area: param.area,
        street: param.street,
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true

      getHousePage(params).then(data => {
        const res = data.data
        this.dataList = _.cloneDeep(res.data)
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = data.data.totalPage
        this.pagination.totalCount = data.data.totalCount
        this.pagination.pageIndex = data.data.pageIndex

        insertLog({
          menu_name: '出租登记列表',
          operation_type: 'query',
          operation_condition: {
            ...params
          },
          sub_menu_name: '',
          operation_type_detail: '查询出租登记列表',
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
     * @description: 改变查询参数
     * @param {Object} param 改变后查询参数
     * @returns {*}
     */
    changeParam (param) {
      if (this.propsParams.province !== param.province) {
        this.$set(this.searchParam[2], 'city', '')
        this.$set(this.searchParam[3], 'area', '')
        this.$set(this.searchParam[4], 'street', '')
        this.$set(this.searchParam[5], 'community', '')
      } else if (this.propsParams.city !== param.city) {
        this.$set(this.searchParam[3], 'area', '')
        this.$set(this.searchParam[4], 'street', '')
        this.$set(this.searchParam[5], 'community', '')
      } else if (this.propsParams.area !== param.area) {
        this.$set(this.searchParam[4], 'street', '')
        this.$set(this.searchParam[5], 'community', '')
      } else if (this.propsParams.street !== param.street) {
        this.$set(this.searchParam[5], 'community', '')
      }
      
      this.propsParams = _.cloneDeep(param)
      this.getRegionSimple()
    },
    /**
     * @description: 获取省市区查询条件精简信息
     * @param {*} none
     * @returns {*} void
     */
    getRegionSimple () {
      const params = {
        level: this.getLevelAndPid(this.propsParams).level,
        name: '',
        pid: this.getLevelAndPid(this.propsParams).pid
      }

      getAreaDim(params)
        .then(data => {
          const res = JSON.parse(
            JSON.stringify(data.data).replace(/name/g, 'label').replace(/id/g, 'value')
          )

          if (this.getLevelAndPid(this.propsParams).level === 1) {
            this.$set(this.searchParam[1], 'data', res)
            this.province.data = res
          } else if (this.getLevelAndPid(this.propsParams).level === 2) {
            this.$set(this.searchParam[2], 'data', res)
          } else if (this.getLevelAndPid(this.propsParams).level === 3) {
            this.$set(this.searchParam[3], 'data', res)
          } else if (this.getLevelAndPid(this.propsParams).level === 4) {
            this.$set(this.searchParam[4], 'data', res)
          } else if (this.getLevelAndPid(this.propsParams).level === 5) {
            this.$set(this.searchParam[5], 'data', res)
          }

          if (this.propsParams.province) {
            this.$set(this.searchParam[2], 'disabled', false)
          } else {
            this.$set(this.searchParam[2], 'disabled', true)
            this.$set(this.searchParam[2], 'city', '')
          }
          if (this.propsParams.city) {
            this.$set(this.searchParam[3], 'disabled', false)
          } else {
            this.$set(this.searchParam[3], 'disabled', true)
            this.$set(this.searchParam[3], 'area', '')
          }
          if (this.propsParams.area) {
            this.$set(this.searchParam[4], 'disabled', false)
          } else {
            this.$set(this.searchParam[4], 'disabled', true)
            this.$set(this.searchParam[4], 'street', '')
          }

          if (this.propsParams.street) {
            this.$set(this.searchParam[5], 'disabled', false)
          } else {
            this.$set(this.searchParam[5], 'disabled', true)
            this.$set(this.searchParam[5], 'community', '')
          }
        })
    },
    /**
     * @description: 获取级别和pid
     * @param {Object} param 参数
     * @returns {Object} 级别和pid
     */
    getLevelAndPid (param) {
      let level, pid
      if (param.community) {
        level = 6
        pid = param.community
      } else if (param.street) {
        level = 5
        pid = param.street
      } else if (param.area) {
        level = 4
        pid = param.area
      } else if (param.city) {
        level = 3
        pid = param.city
      } else if (param.province) {
        level = 2
        pid = param.province
      } else {
        level = 1
        pid = 0
      }

      return {
        level,
        pid
      }
    },
    /**
     * @description: 点击表头按钮
     * @param {*} val
     * @returns {*} void
     */
    handleClick (val) {
      console.log(val)
      if (val === 'addObject') {
        this.showDialog = true
        this.dialogTitle = '添加出租登记'
      }
    },
    /**
     * @description: 获取民族字典数据
     * @param {*} none
     * @returns {*} void
     */    
    getNationDic () {
      getNationDic({}).then(data => {
        this.nationArray = data.data
      })
    },
    /**
     * @description: 获取省级数据
     * @param {*} none
     * @returns {*} void
     */
    getProviceData () {
      const params = {
        level: 1,
        name: '',
        pid: 0
      }

      getAreaDim(params).then(data => {
        this.province.data = data.data
      }).catch(err => {
        console.log(err)
        this.province.data = []
      })
    },
    /**
     * @description: 查询房屋使用类型字典
     * @param {*}
     * @returns {*}
     */    
    getUseTypeList () {
      const params = {
        pid: 3
      }

      getDicList(params).then(data => {
        this.useTypeList = data.data.data
      })
    },
    /**
     * @description: 查询房屋类型字典
     * @param {*}
     * @returns {*}
     */    
    getHouseTypeList () {
      const params = {
        pid: 2
      }

      getDicList(params).then(data => {
        this.houseTypeList = data.data.data
      })
    },
    /**
     * @description: 上一步
     * @param {*} none
     * @returns {*} void
     */    
    prevStep () {
      this.stepActive--
    },
    /**
     * @description: 出租登记下一步
     * @param {*} none
     * @returns {*} void
     */    
    nextStep () {
      if (this.stepActive === 1) {
        if (!this.validHouseParam()) return
      } else if (this.stepActive === 2) {
        if (!this.validOwnerParam()) return
      }
      this.stepActive++
    },
    /**
     * @description: 验证房主参数
     * @param {*} none
     * @returns {Boolean} 验证是否通过
     */    
    validOwnerParam () {
      if (this.ownerObject.owners_type === 1) {
        if (!this.ownerObject.name) {
          this.showMessageBox('请填写房主姓名！', 'warning')
          return false
        } else if (!this.ownerObject.nation) {
          this.showMessageBox('请选择房主民族！', 'warning')
          return false
        } else if (!(this.ownerObject.sex + '')) {
          this.showMessageBox('请选择房主性别！', 'warning')
          return false
        } else if (!this.ownerObject.phone) {
          this.showMessageBox('请填写房主手机号！', 'warning')
          return false
        } else if (!verifyPhoneFormat(this.ownerObject.phone)) {
          this.showMessageBox('手机号格式错误！', 'warning')
          return false
        } else if (!this.ownerObject.idcard) {
          this.showMessageBox('请填写房主身份证！', 'warning')
          return false
        } else if (!this.ownerObject.address) {
          this.showMessageBox('请填写房主籍贯！', 'warning')
          return false
        } else {
          return true
        }
      } else {
        if (!this.ownerObject.name) {
          this.showMessageBox('请填写负责人姓名！', 'warning')
          return false
        } else if (!this.ownerObject.companyName) {
          this.showMessageBox('请填写公司名称！', 'warning')
          return false
        } else if (!this.ownerObject.businessLicense) {
          this.showMessageBox('请填写营业执照！', 'warning')
          return false
        } else if (!this.ownerObject.phone) {
          this.showMessageBox('请填写负责人手机号！', 'warning')
          return false
        } else if (!verifyPhoneFormat(this.ownerObject.phone)) {
          this.showMessageBox('手机号格式错误！', 'warning')
          return false
        } else if (!this.ownerObject.idcard) {
          this.showMessageBox('请填写负责人身份证！', 'warning')
          return false
        } else if (!this.ownerObject.address) {
          this.showMessageBox('请填写公司地址！', 'warning')
          return false
        } else {
          return true
        }
      }
    },
    /**
     * @description: 验证房屋参数
     * @param {*} none
     * @returns {Boolean} 验证是否通过
     */    
    validHouseParam () {
      if (!this.houseObject.houseType) {
        this.showMessageBox('请选择房屋类型！', 'warning')
        return false
      } else if (!this.houseObject.useType) {
        this.showMessageBox('请选择使用类型！', 'warning')
        return false
      } else if (!this.houseObject.houseArea) {
        this.showMessageBox('请填写房屋面积！', 'warning')
        return false
      } else if (!this.houseObject.premisesPermitNo) {
        this.showMessageBox('请填写房产证编号！', 'warning')
        return false
      } else if (!this.houseObject.province) {
        this.showMessageBox('请选择省！', 'warning')
        return false
      } else if (!this.houseObject.city) {
        this.showMessageBox('请选择市！', 'warning')
        return false
      } else if (!this.houseObject.area) {
        this.showMessageBox('请选择区/县！', 'warning')
        return false
      } else if (!this.houseObject.street) {
        this.showMessageBox('请选择街道！', 'warning')
        return false
      } else if (!this.houseObject.community) {
        this.showMessageBox('请选择社区！', 'warning')
        return false
      } else if (!this.houseObject.address) {
        this.showMessageBox('请填写详细地址！', 'warning')
        return false
      } else {
        return true
      }
    },
    /**
     * @description: 验证租户参数
     * @param {*} none
     * @returns {Boolean} 验证是否通过
     */ 
    validTenantParam () {
      const validParam = []
      this.tenantArray.map((item, index) => {
        if (!item.name) {
          this.showMessageBox(`请填写租户${index + 1}姓名`, 'warning')
          validParam.push(1)
          return false
        } else if (!item.nation) {
          this.showMessageBox(`请选择租户${index + 1}民族`, 'warning')
          validParam.push(1)
          return false
        } else if (!(item.sex + '')) {
          this.showMessageBox(`请选择租户${index + 1}性别`, 'warning')
          validParam.push(1)
          return false
        } else if (!item.phone) {
          this.showMessageBox(`请填写租户${index + 1}手机号`, 'warning')
          validParam.push(1)
          return false
        } else if (!verifyPhoneFormat(item.phone)) {
          this.showMessageBox(`租户${index + 1}手机号格式错误`, 'warning')
          validParam.push(1)
          return false
        } else if (!item.idcard) {
          this.showMessageBox(`请填写租户${index + 1}身份证号`, 'warning')
          validParam.push(1)
          return false
        } else if (!item.address) {
          this.showMessageBox(`请填写租户${index + 1}详细地址`, 'warning')
          validParam.push(1)
          return false
        } else if (!item.startTime) {
          this.showMessageBox(`请选择租户${index + 1}承租起始时间`, 'warning')
          validParam.push(1)
          return false
        } else if (!item.endTime) {
          this.showMessageBox(`请选择租户${index + 1}承租结束时间`, 'warning')
          validParam.push(1)
          return false
        }
      })
      if (validParam.includes(1)) {
        return false
      } else {
        return true
      }
    },
    /**
     * @description: 删除租户
     * @param {Number} idx 租户索引
     * @returns {*} void
     */    
    deleteTenant (idx) {
      this.tenantArray.splice(idx, 1)
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
     * @description: 提交出租登记信息
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
     * @description: 编辑出租登记信息
     * @param {object} item 要修改的出租登记信息
     * @return {*} void
     */    
    updateRegister (item) {
      const params = {
        id: item.id,
        type: 2
      }

      getRegisterDetail(params).then(data => {
        console.log(data)
        if (data.status === 200) {
          const res = data.data.homeowner
          this.ownerId = item.homeowner
          this.ownerObject.nation = res.nation
          this.ownerObject.sex = res.sex
          this.ownerObject.name = res.name
          this.ownerObject.idcard = res.idcard
          this.ownerObject.phone = res.phone
          this.ownerObject.address = res.address
          this.ownerObject.owners_type = res.owners_type
          this.ownerObject.businessLicense = res.businessLicense
          this.ownerObject.companyName = res.companyName

          this.houseId = item.id
          this.houseObject.houseType = res.houses[0].housingNature
          this.houseObject.useType = res.houses[0].planningPurposes
          this.houseObject.houseArea = res.houses[0].constructionArea
          this.houseObject.premisesPermitNo = res.houses[0].premisesPermitNo
          this.houseObject.province = res.houses[0].province
          this.houseObject.city = res.houses[0].city
          this.houseObject.area = res.houses[0].area
          this.houseObject.street = res.houses[0].street
          this.houseObject.community = res.houses[0].community
          this.houseObject.address = res.houses[0].address

          if (this.houseObject.province) {
            this.changeProvice(this.houseObject.province)
          }

          if (this.houseObject.city) {
            this.changeCity(this.houseObject.city)
          }

          if (this.houseObject.area) {
            this.changeCountry(this.houseObject.area)
          }

          if (this.houseObject.street) {
            this.changeStreet(this.houseObject.street)
          }

          res.houses[0].tenants.length && 
          (this.tenantArray = []) &&
          res.houses[0].tenants.map(item => {
            const object = {}
            object.id = item.id
            object.name = item.name
            object.sex = item.sex
            object.nation = item.nation
            object.phone = item.phone
            object.idcard = item.idcard
            object.address = item.address
            object.startTime = item.start_time ? item.start_time.split(' ')[0] : ''
            object.endTime = item.end_time ? item.end_time.split(' ')[0] : ''
            this.tenantArray.push(object)
          })

          this.isEdit = true
          this.showDialog = true
          this.dialogTitle = '修改出租登记'
        } else {
          this.isEdit = false
          this.showMessageBox(data.message, 'error')
        }
      }).catch(err => {
        this.isEdit = false
        this.showMessageBox(err.message, 'error')
      })
    },
    /**
     * @description: 租户批量补录
     * @param {Object} item 当前登记信息
     * @returns {*} void
     */    
    addTenants (item) {
      console.log(item)
      this.stepActive = 3
      this.isAdd = true
      this.showDialog = true
      this.dialogTitle = '租户补录'
      this.house_id = item.id
    },
    /**
     * @description: 查看出租登记详情
     * @param {Number} id 出租登记信息id
     * @returns {*} void
     */    
    goRegisterDetail (id) {
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
    showDialog (val) {
      if (!val) {
        this.stepActive = 1
        this.isEdit = false
        this.isAdd = false
        for (const k in this.houseObject) {
          this.houseObject[k] = ''
        }

        for (const k1 in this.ownerObject) {
          if (k1 === 'owners_type') {
            this.ownerObject[k1] = 1
          } else {
            this.ownerObject[k1] = ''
          }
        }

        this.tenantArray = []
        this.tenantArray.push(this.tempTenant)
      }
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
.register-container {
  /deep/.modal {
    .modal-box {
      .modal-body {
        max-height: 42rem !important;
        overflow: hidden;
        background: #efefef;
      }
    }
  }
}
.step-container {
  display: flex;
  flex-direction: column;
  .el-steps {
    width: 100%;
  }
  .form-main {
    flex: 0 0 32rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &.tenant-main {
      justify-content: unset;
      align-items: unset;
    }
    .el-form {
      width: 60%;
      margin: 0 auto;
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
}
</style>
