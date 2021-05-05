<!--
 * @Description: 用户管理
 * @Author: snoop-dog
 * @Date: 2021-04-24 15:05:30
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-05 22:37:48
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
        <div slot="is_enabled" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | enableFilter"></my-tooltip>
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
          <el-button class="btnPrimary" v-if="props.value.is_enabled" @click.native="updateUserStatus(props.value.id, 0)">启用</el-button>
          <el-button class="btnPrimary" v-else @click.native="updateUserStatus(props.value.id, 1)">关闭</el-button>
        </div>
      </layout-table>
    </el-row>

    <my-dialog
      size="extra-small"
      modal
      :visible.sync="showDialog"
      title="新增用户"
      @submit="confirmUpdate"
    >
      <el-form label-width="8rem" label-position="left" class="alarm-form required-form">
        <el-form-item label="用户名：" class="required">
          <el-input 
            clearable 
            v-model.trim="ruleForm.username" 
            placeholder="请输入用户名"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="用户姓名：" class="required">
          <el-input 
            clearable 
            v-model.trim="ruleForm.name" 
            placeholder="请输入用户姓名"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="角色：" class="required">
          <el-input 
            clearable 
            type="password"
            v-model.trim="ruleForm.role_id" 
            placeholder="请输入角色"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码：" class="required">
          <el-input 
            clearable 
            type="password"
            v-model.trim="ruleForm.password" 
            placeholder="请输入密码"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input
            clearable
            v-model.trim="ruleForm.phonenumber"
            @input="ruleForm.phonenumber=ruleForm.phonenumber.replace(/[^\d]/g,'')"
            @blur="ruleForm.phonenumber=ruleForm.phonenumber.replace(/[^\d]/g,'')"
            placeholder="请输入数字">
          </el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input
            clearable
            v-model.trim="ruleForm.idcard"
            @input="ruleForm.idcard=ruleForm.idcard.replace(/[^\d]/g,'')"
            @blur="ruleForm.idcard=ruleForm.idcard.replace(/[^\d]/g,'')"
            placeholder="请输入数字">
          </el-input>
        </el-form-item>
        <transition name="el-zoom-in-center">
          <template>
            <el-form-item label="省：">
              <el-select
                clearable
                :multiple="false"
                v-model="ruleForm.provice"
                @change="changeProvice"
              >
                <el-option
                  v-for="item in provice.data"
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
            <el-form-item label="市：">
              <el-select
                clearable
                :disabled="!ruleForm.provice"
                :multiple="false"
                v-model="ruleForm.city"
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
            <el-form-item label="区/县：">
              <el-select
                clearable
                :disabled="!ruleForm.city"
                :multiple="false"
                v-model="ruleForm.area"
                @change="changeCountry"
              >
                <el-option
                  v-for="item in country.data"
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
            <el-form-item label="街道：">
              <el-select
                clearable
                :disabled="!ruleForm.area"
                :multiple="false"
                @change="changeStreet"
                v-model="ruleForm.street"
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
            <el-form-item label="社区：">
              <el-select
                clearable
                :disabled="!ruleForm.street"
                :multiple="false"
                v-model="ruleForm.community"
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
        <transition name="el-zoom-in-center">
          <template>
            <el-form-item label="小区：" class="required">
              <el-input 
                clearable 
                v-model.trim="ruleForm.plot" 
                placeholder="请输入小区"
              >
              </el-input>
            </el-form-item>
          </template>
        </transition>
        <el-form-item label="区划简称：">
          <el-input clearable v-model.trim="ruleForm.building" placeholder="请输入楼栋"></el-input>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input
            clearable
            v-model.trim="ruleForm.address"
            placeholder="请输入详细地址">
          </el-input>
        </el-form-item>
        <el-form-item label="职位：">
          <el-input 
            clearable
            v-model.trim="ruleForm.position_id"
            placeholder="请输入职位">
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
  updateUserInfo,
  updatePassword,
  getUserDetail,
  getUserList,
  updateUserStatus,
  deleteUser,
  addUser,
  getAreaDim
} from '../../apis/index'

// components
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myDialog from '@/components/common/layout/layout-dialog.vue'
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
          width: 100
        },
        {
          name: '用户姓名',
          prop: 'name',
          value: 'name',
          fixed: true,
          width: 100
        },
        {
          name: '手机号',
          prop: 'phonenumber',
          value: 'phonenumber',
          fixed: true,
          width: 140
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
          name: '是否启用',
          prop: 'is_enabled',
          value: 'is_enabled',
          width: 100
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
      ruleForm: { // 新增编辑表单参数
        username: '',
        name: '',
        role_id: '',
        password: '',
        phonenumber: '',
        idcard: '',
        province: '',
        city: '',
        area: '',
        street: '',
        community: '',
        plot: '',
        building: '',
        address: '',
        position_id: ''
      },
      showDialog: false, // 是否显示修改新增弹框
      size: 20, // 每页条数
      isEdit: false, // 是否是编辑标识
      street: { // 弹框街道数据
        data: [],
        value: ''
      },
      country: { // 弹框区县数据
        data: [],
        value: ''
      },
      city: { // 弹框城市数据
        data: [],
        value: ''
      },
      provice: { // 弹框省数据
        data: [],
        value: ''
      },
      community: {
        data: [],
        value: ''
      }
    }
  },
  components: {
    myDialog,
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
        this.provice.data = data.data
      }).catch(err => {
        console.log(err)
        this.provice.data = []
      })
    },
    /**
     * @description: 改变省级数据
     * @param {Number} val 改变后数据
     * @returns {*} void
     */
    changeProvice (val) {
      if (!val) {
        this.city.data = []
        this.ruleForm.city = ''
        this.country.data = []
        this.ruleForm.country = ''
        this.street.data = []
        this.ruleForm.street = ''
        this.community.data = []
        this.ruleForm.community = ''
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
        this.country.data = []
        this.ruleForm.country = ''
        this.street.data = []
        this.ruleForm.street = ''
        this.community.data = []
        this.ruleForm.community = ''
        return
      }
      const params = {
        level: 3,
        pid: val
      }

      getAreaDim(params).then(data => {
        this.country.data = data.data
      }).catch(err => {
        console.log(err)
        this.country.data = []
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
        this.ruleForm.street = ''
        this.community.data = []
        this.ruleForm.community = ''
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
        this.ruleForm.community = ''
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
     * @description: 修改新增用户
     * @param {*} none
     * @returns {*} void
     */
    confirmUpdate () {
      console.log(1)
    },
    /**
     * @description: 修改角色状态
     * @param {String} id 角色id
     * @param {Number} status 角色状态
     * @returns {*}
     */
    updateUserStatus (id, status) {
      const params = {
        id: id,
        isEnabled: status
      }

      updateUserStatus(params).then(data => {
        console.log(data)
        this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
        this.showMessageBox('操作成功!', 'success')
      })
    },
    /**
     * @description: 删除用户
     * @param {String} id 用户id
     * @returns {*} void
     */
    deleteRole (id) {
      const params = {
        ids: id
      }

      this.$confirm('是否删除当前用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        // deleteUser(params).then(data => {
        //   console.log(data)
        //   this.showMessageBox('删除成功！', 'success')
        //   this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
        // })
      }).catch(err => {
        console.log(err)
        this.showMessageBox('已取消！')
      })
    },
    /**
     * @description: 修改用户状态
     * @param {*} none
     * @returns {*} 
     */
    handleClick () {
      this.showDialog = true
      this.getProviceData()
    }
  },
  filters: {
    nullTextFilter (val) {
      return val || '--'
    },
    enableFilter (val) {
      return !val ? '启用' : '关闭'
    }
  },
  watch: {
    showDialog (val) {
      if (!val) {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = ''
        }

        this.provice.data =
        this.city.data =
        this.country.data =
        this.street.data = []

        this.provice.value =
        this.city.value =
        this.country.value =
        this.street.value = ''
      }
    }
  }
}
</script>

<style>

</style>
