<!--
 * @Description: 地区管理
 * @Author: snoop-dog
 * @Date: 2021-04-24 15:03:47
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-03 10:10:53
 * @FilePath: \vue2-ts\src\views\system\region.vue
-->

<template>
  <el-container class="region-conatiner table-container">
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
        <div slot="shortname" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="longitude" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="latitude" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="level" slot-scope="props">
          <my-tooltip width="100%" :value="levelFilter(props.value)"></my-tooltip>
        </div>
        <div slot="oprate" slot-scope="props">
          <el-button @click.stop="updateRegion(props.value)" class="btnPrimary">修改</el-button>
          <el-button @click.stop="deleteRegion(props.value)" class="btnPrimary">删除</el-button>
        </div>
      </layout-table>
    </el-row>

    <my-dialog
      size="extra-small"
      modal
      :visible.sync="showDialog"
      title="新增区划"
      @submit="confirmUpdate"
    >
      <el-form label-width="8rem" label-position="left" class="alarm-form required-form">
        <transition name="el-zoom-in-center">
          <template v-if="!isEdit">
            <el-form-item label="省：">
              <el-select
                clearable
                :multiple="false"
                v-model="provice.value"
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
          <template v-if="!isEdit">
            <el-form-item label="市：">
              <el-select
                clearable
                :disabled="!provice.value"
                :multiple="false"
                v-model="city.value"
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
          <template v-if="!isEdit">
            <el-form-item label="区/县：">
              <el-select
                clearable
                :disabled="!city.value"
                :multiple="false"
                v-model="country.value"
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
          <template v-if="!isEdit">
            <el-form-item label="街道：">
              <el-select
                clearable
                :disabled="!country.value"
                :multiple="false"
                v-model="street.value"
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
          <template v-if="!isEdit">
            <el-form-item label="区划编码：" class="required">
              <el-input 
                clearable 
                v-model.trim="ruleForm.id" 
                placeholder="请输入区划编码"
                @input="ruleForm.id=ruleForm.id.replace(/[^\d]/g,'')"
                @blur="ruleForm.id=ruleForm.id.replace(/[^\d]/g,'')"
              >
              </el-input>
            </el-form-item>
          </template>
        </transition>
        <el-form-item label="区划名称：" class="required">
          <el-input 
            clearable 
            v-model.trim="ruleForm.name" 
            placeholder="请输入区划名称"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="区划简称：">
          <el-input clearable v-model.trim="ruleForm.shortname" placeholder="请输入区划简称"></el-input>
        </el-form-item>
        <el-form-item label="经度：">
          <el-input
            clearable
            v-model.trim="ruleForm.longitude"
            placeholder="请输入经度">
          </el-input>
        </el-form-item>
        <el-form-item label="纬度：">
          <el-input 
            clearable
            v-model.trim="ruleForm.latitude"
            placeholder="请输入纬度">
          >
          </el-input>
        </el-form-item>
        <el-form-item label="排序：">
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
  </el-container>
</template>

<script>
// apis
import {
  addArea,
  deleteArea,
  getAreaDim,
  getAreaList,
  updateArea
} from '@/apis/index'

// components
import layoutSearch from '@/components/common/layout/layout-search.vue'
import layoutTable from '@/components/common/layout/layout-table.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'
import myDialog from '@/components/common/layout/layout-dialog.vue'
export default {
  name: 'region',
  data () {
    return {
      dataList: [],
      queryLoading: false, // 查询loading
      searchParam: [ // 查询参数
        {
          label: '省：',
          type: 'select',
          data: [],
          property: 'provice',
          provice: '',
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
          property: 'country',
          country: '',
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
          name: '名称',
          prop: 'name',
          value: 'name'
        },
        {
          name: '简称',
          prop: 'shortname',
          value: 'shortname'
        },
        {
          name: '级别',
          prop: 'level',
          value: 'level'
        },
        {
          name: '经度',
          prop: 'longitude',
          value: 'longitude'
        },
        {
          name: '纬度',
          prop: 'latitude',
          value: 'latitude'
        }
      ],
      oprate: { // 数据操作列
        isShow: true, // 是否含有操作列
        name: '操作',
        fixed: 'right',
        // width: 350
        width: 300
      },
      tableTitle: { // 表格title
        name: '地区管理',
        button: [
          {
            label: '新增',
            value: 'addRole'
          }
        ]
      },
      levelArray: [
        {
          name: '省',
          value: 1
        },
        {
          name: '市',
          value: 2
        },
        {
          name: '区/县',
          value: 3
        },
        {
          name: '街道',
          value: 4
        },
        {
          name: '社区',
          value: 5
        }
      ],
      propsParams: { // 初始参数
        provice: '',
        city: '',
        country: '',
        street: ''
      },
      size: 20, // 分页条数
      ruleForm: { // 新增编辑表单参数
        id: '',
        pid: '',
        name: '',
        shortname: '',
        longitude: '',
        latitude: '',
        level: '',
        sort: ''
      },
      showDialog: false, // 是否展示弹框
      isEdit: false, // 是否为编辑状态
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
      }
    }
  },
  components: {
    layoutSearch,
    layoutTable,
    myTooltip,
    myDialog
  },
  created () {
    this.getRegionSimple() // 默认查询省级字典
  },
  methods: {
    /**
     * @description: 查询地区列表
     * @param {Object} param 查询参数
     * @param {Number} val 页码
     * @param {Number} size 每页条数
     * @returns {*} void
     */
    searchList (param, val, size) {
      this.propsParams = _.cloneDeep(param)
      this.size = size
      const params = {
        pid: this.getLevelAndPid(param).pid,
        level: this.getLevelAndPid(param).level,
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true
      getAreaList(params).then(data => {
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
     * @description: 改变查询参数
     * @param {Object} param 改变后查询参数
     * @returns {*}
     */
    changeParam (param) {
      if (this.propsParams.provice !== param.provice) {
        this.$set(this.searchParam[1], 'city', '')
        this.$set(this.searchParam[2], 'country', '')
        this.$set(this.searchParam[3], 'street', '')
      } else if (this.propsParams.city !== param.city) {
        this.$set(this.searchParam[2], 'country', '')
        this.$set(this.searchParam[3], 'street', '')
      } else if (this.propsParams.country !== param.country) {
        this.$set(this.searchParam[3], 'street', '')
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
            this.$set(this.searchParam[0], 'data', res)
          } else if (this.getLevelAndPid(this.propsParams).level === 2) {
            this.$set(this.searchParam[1], 'data', res)
          } else if (this.getLevelAndPid(this.propsParams).level === 3) {
            this.$set(this.searchParam[2], 'data', res)
          } else if (this.getLevelAndPid(this.propsParams).level === 4) {
            this.$set(this.searchParam[3], 'data', res)
          }

          if (this.propsParams.provice) {
            this.$set(this.searchParam[1], 'disabled', false)
          } else {
            this.$set(this.searchParam[1], 'disabled', true)
            this.$set(this.searchParam[1], 'city', '')
          }
          if (this.propsParams.city) {
            this.$set(this.searchParam[2], 'disabled', false)
          } else {
            this.$set(this.searchParam[2], 'disabled', true)
            this.$set(this.searchParam[2], 'country', '')
          }
          if (this.propsParams.country) {
            this.$set(this.searchParam[3], 'disabled', false)
          } else {
            this.$set(this.searchParam[3], 'disabled', true)
            this.$set(this.searchParam[3], 'street', '')
          }
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
        this.city.value = ''
        this.country.data = []
        this.country.value = ''
        this.street.data = []
        this.street.value = ''
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
        this.country.value = ''
        this.street.data = []
        this.street.value = ''
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
        this.street.value = ''
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
     * @description: 获取级别和pid
     * @param {Object} param 参数
     * @returns {Object} 级别和pid
     */
    getLevelAndPid (param) {
      let level, pid
      if (param.street) {
        level = 5
        pid = param.street
      } else if (param.country) {
        level = 4
        pid = param.country
      } else if (param.city) {
        level = 3
        pid = param.city
      } else if (param.provice) {
        level = 2
        pid = param.provice
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
     * @description: 点击列表头部按钮
     * @param {*} none
     * @returns {*} void
     */
    handleClick () {
      this.showDialog = true
      this.isEdit = false
      this.getProviceData()
    },
    /**
     * @description: 提交新增区划表单
     * @param {*}
     * @returns {*}
     */
    confirmUpdate () {
      if (!this.isEdit) {
        if (!this.ruleForm.id) {
          return this.showMessaheBox('区划编码不能为空！', 'warning')
        } else if (!this.ruleForm.name) {
          return this.showMessaheBox('区划名称不能为空！', 'warning')
        } else {
          let level, pid
          if (this.street.value) {
            pid = this.street.value
            level = 5
          } else if (this.country.value) {
            pid = this.country.value
            level = 4
          } else if (this.city.value) {
            pid = this.city.value
            level = 3
          } else if (this.provice.value) {
            pid = this.provice.value
            level = 2
          } else {
            level = 1
            pid = 0
          }

          const params = {
            id: Number(this.ruleForm.id),
            pid: pid,
            name: this.ruleForm.name,
            shortname: this.ruleForm.shortname,
            longitude: this.ruleForm.longitude,
            latitude: this.ruleForm.latitude,
            level: level,
            sort: this.ruleForm.sort
          }

          addArea(params).then(data => {
            this.showDialog = false
            this.showMessageBox(data.message, 'success')
            this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
          }).catch(err => {
            this.showMessageBox(err.message, 'error')
          })
        }
      } else {
        if (!this.ruleForm.name) {
          return this.showMessageBox('区划名称不能为空！', 'warning')
        } else {
          const params = {
            id: this.ruleForm.id,
            pid: this.ruleForm.pid,
            name: this.ruleForm.name,
            shortname: this.ruleForm.shortname,
            longitude: this.ruleForm.longitude,
            latitude: this.ruleForm.latitude,
            level: this.ruleForm.level,
            sort: this.ruleForm.sort
          }

          updateArea(params).then(data => {
            this.showDialog = false
            this.showMessageBox(data.message, 'success')
            this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
          }).catch(err => {
            this.showMessageBox(err.message, 'error')
          })
        }
      }
    },
    /**
     * @description: 过滤地区级别
     * @param {*} none
     * @returns {*} void
     */
    levelFilter (val) {
      return this.levelArray.filter(x => x.value === val)[0].name
    },
    /**
     * @description: 修改地区
     * @param {Object} item 地区
     * @returns {*} void
     */
    updateRegion (item) {
      console.log(item)
      this.isEdit = true
      for (const key in this.ruleForm) {
        this.$set(this.ruleForm, key, item[key])
      }

      this.showDialog = true
    },
    /**
     * @description: 删除地区
     * @param {Object} item 地区
     * @returns {*} void
     */
    deleteRegion (item) {
      this.$confirm('是否删除当前区划信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.confirmDelete(item.id, item.level)
      }).catch(err => {
        console.log(err)
        this.showMessageBox('已取消！')
      })
    },
    /**
     * @description: 确认删除区划信息
     * @param {String} id id
     * @returns {*} void
     */
    confirmDelete (id, level) {
      const params = {
        ids: id,
        level: level
      }

      deleteArea(params).then(data => {
        this.showMessageBox(data.message, 'success')
        this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
      }).catch(err => {
        this.showMessageBox(err.message, 'error')
      })
    }
  },
  filters: {
    nullTextFilter (val) {
      return val || '--'
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
