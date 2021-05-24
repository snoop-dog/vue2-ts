<!--
 * @Description: 单位管理
 * @Author: snoop-dog
 * @Date: 2021-05-03 10:13:47
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-24 23:16:09
 * @FilePath: \vue2-ts\src\views\system\unit.vue
-->
<template>
  <el-container class="unit-container">
    <el-main class="unit-main">
      <!-- <el-container class="tree-container">
        <tree-single
          ref="treeSingle"
          :siteTreeData="unitTree"
          :defaultProps="defaultProps"
        >
        </tree-single>
      </el-container> -->
      <el-container class="table-container">
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
            <div slot="name" slot-scope="props">
              <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
            </div>
            <div slot="roleStr" slot-scope="props">
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
            <div slot="address" slot-scope="props">
              <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
            </div>
            <div slot="describe" slot-scope="props">
              <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
            </div>
            <div slot="oprate" slot-scope="props">
              <el-button class="btnPrimary" @click.stop="updateUnit(props.value)">修改</el-button>
              <el-button class="btnPrimary" @click.stop="deleteUnit(props.value.id)">删除</el-button>
            </div>
          </layout-table>
        </el-row>
      </el-container>
    </el-main>
    <my-dialog
      size="small"
      modal
      :visible.sync="showDialog"
      title="新增单位"
      @submit="confirmUpdate"
    >
      <el-form label-width="8rem" label-position="left" class="alarm-form required-form">
        <el-form-item label="上级单位：" class="required">
          <tree-single
            ref="treeSingle"
            :siteTreeData="unitTree"
            :defaultProps="defaultProps"
          >
          </tree-single>
        </el-form-item>
        <el-form-item label="单位名称：" class="required">
          <el-input 
            clearable 
            v-model.trim="ruleForm.name" 
            placeholder="请输入用户姓名"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="角色名称：" class="required">
          <el-select
            clearable
            :multiple="false"
            placeholder="请选择角色"
            v-model="ruleForm.role_id"
          >
            <el-option
              v-for="item in roleList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <transition name="el-zoom-in-center">
          <template>
            <el-form-item label="省：">
              <el-select
                clearable
                :multiple="false"
                v-model="ruleForm.province"
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
            <el-form-item label="市：">
              <el-select
                clearable
                :disabled="!ruleForm.province"
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
        <el-form-item label="详细地址：">
          <el-input
            clearable
            v-model.trim="ruleForm.address"
            placeholder="请输入详细地址">
          </el-input>
        </el-form-item>
        <el-form-item label="单位描述：">
          <el-input 
            v-model.trim="ruleForm.describe" 
            type="textarea" 
            resize='none' 
            :rows="4" 
            placeholder="请输入单位描述"
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
  addDepartment,
  deleteDepartment,
  getUnitTree,
  updateUnit,
  getAreaDim,
  getRoleSimple,
  getJobUnitList
} from '@/apis/index'

// conponents
import treeSingle from '@/components/common/select/select-tree-single'
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'
import myDialog from '@/components/common/layout/layout-dialog.vue'

export default {
  name: 'unit',
  data () {
    return {
      unitTree: [], // 单位树
      defaultProps: {
        id: 'id',
        label: 'name',
        children: 'children'
      },
      dataList: [],
      queryLoading: false, // 查询loading
      searchParam: [ // 查询参数
        {
          label: '关键字：',
          type: 'input',
          property: 'name',
          name: '',
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
          name: '单位名称',
          prop: 'name',
          value: 'name',
          width: 100
        },
        {
          name: '角色名称',
          prop: 'roleStr',
          value: 'roleStr',
          width: 100
        },
        {
          name: '省',
          prop: 'provinceStr',
          value: 'provinceStr',
          width: 60
        },
        {
          name: '市',
          prop: 'cityStr',
          value: 'cityStr',
          width: 60
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
          width: 100
        },
        {
          name: '描述',
          prop: 'describe',
          value: 'describe',
          width: 100
        }
      ],
      oprate: { // 数据操作列
        isShow: true, // 是否含有操作列
        name: '操作',
        fixed: 'right',
        width: 220
      },
      tableTitle: { // 表格title
        name: '单位列表',
        button: [
          {
            label: '新增',
            value: 'addUnit'
          }
        ]
      },
      propsParams: {}, // 初始参数
      ruleForm: { // 新增编辑表单参数
        pid: '',
        name: '',
        province: '',
        city: '',
        area: '',
        street: '',
        community: '',
        role_id: '',
        address: ''
      },
      showDialog: false, // 是否显示修改新增弹框
      size: 20, // 每页条数
      isEdit: false, // 是否是编辑标识
      roleList: [], // 角色列表
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
      }
    }
  },
  components: {
    treeSingle,
    layoutSearch,
    layoutTable,
    myTooltip,
    myDialog
  },
  created () {
    this.getUnitTree() // 获取单位树
    this.getRoleListSimple() // 获取用户角色
    this.getProviceData() // 获取省级数据
  },
  mounted () {
    // this.$refs.treeSingle.showTreeData()
    // this.$refs.treeSingle.showTreeFlag = true
    console.log(this.$refs.treeSingle)
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
        name: param.name,
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true

      getJobUnitList(params).then(data => {
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
     * @description: 获取角色列表
     * @param {*} none
     * @returns {*} void
     */
    getRoleListSimple () {
      const params = {}

      getRoleSimple(params).then(data => {
        this.roleList = data.data || []
      })
    },
    /**
     * @description: 获取单位树
     * @param {*} none
     * @returns {*} void
     */
    getUnitTree () {
      getUnitTree().then(data => {
        console.log(data)
        this.unitTree = data.data
      }).catch(err => {
        console.log(err)
        this.unitTree = []
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
     * @description: 改变省级数据
     * @param {Number} val 改变后数据
     * @returns {*} void
     */
    changeProvice (val) {
      if (!val) {
        this.city.data = []
        this.ruleForm.city = ''
        this.area.data = []
        this.ruleForm.area = ''
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
        this.area.data = []
        this.ruleForm.area = ''
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
        this.area.data = data.data
      }).catch(err => {
        console.log(err)
        this.area.data = []
      })
    },
    /**
     * @description: 修改单位
     * @param {Object} item 单位
     * @returns {*} void
     */
    updateUnit (item) {
      this.isEdit = true
      this.showDialog = true
      for (const key in this.ruleForm) {
        this.$set(this.ruleForm, key, item[key])
      }
      if (this.ruleForm.province) {
        this.changeProvice(this.ruleForm.province)
      }

      if (this.ruleForm.city) {
        this.changeCity(this.ruleForm.city)
      }

      if (this.ruleForm.area) {
        this.changeCountry(this.ruleForm.area)
      }

      if (this.ruleForm.street) {
        this.changeStreet(this.ruleForm.street)
      }
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
    handleClick (val) {
      console.log(val)
    },
    /**
     * @description: 删除单位
     * @param {String} id 单位id
     * @returns {*} void
     */    
    deleteUnit (id) {
      const params = {
        ids: id
      }

      this.$confirm('是否删除当前单位?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        deleteDepartment(params).then(data => {
          console.log(data)
          this.showMessageBox('删除成功！', 'success')
          this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
        })
      }).catch(err => {
        console.log(err)
        this.showMessageBox('已取消！')
      })
    },
    /**
     * @description: 确认提交单位新增修改表单
     * @param {*} none
     * @returns {*} void
     */    
    confirmUpdate () {
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

<style lang="scss" scoped>
.unit-container {
  width: 100%;
  height: 100%;
  .unit-main {
    width: 100%;
    height: 100%;
    padding: 0;
    display: flex;
    /deep/.tree-container {
      flex: 0 0 20rem;
      background: #fff;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-right: 1rem;
      .sitebox {
        width: 100%;
        height: 100%;
        .Collection_site {
          width: 100%;
          .el-select__input {
            width: 100%;
            border: 1px solid #ccc;
            padding-left: 1rem;
            margin-left: 0;
            height: 2.5rem;
            line-height: 2.5;
          }
        }
        .sitetree {
          margin-top: 0.5rem;
        }
      }
    }
    .table-container {
      flex: 1;
    }
  }
}
</style>
