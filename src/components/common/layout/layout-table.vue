<!--
 * @Description: 列表组件
 * @Author: snoop-dog
 * @Date: 2021-04-24 22:12:47
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-05-06 21:37:05
 * @FilePath: \vue2-ts\src\components\common\layout\layout-table.vue
-->
<template>
  <el-main class="tableContainer">
    <!-- 表格标题 -->
    <el-header v-if="hasTitle" class="tableTitle">
      <el-row class="titleContainer">
        <el-col :span="2" class="colorBlock">
          <el-row></el-row>
        </el-col>
        <el-col :span="4" class="titleName">
          <span class="titleText">{{tableTitle.name}}</span>
          <slot name="read-msg"></slot>
        </el-col>
        <el-col :span="6" class="titleBtn">
          <div class="recommend-tab" v-if="pushType ===0 ||pushType">
              <span
              v-for="(item, index) in tableTitle.button"
              :key="index"
              @click.stop="handleClickBtn(item)"
              :class="{ 'active': pushType === item.val}">{{item.label}}</span>
          </div>
          <el-button
            v-else
            class="btnPrimary"
            v-for="(item, index) in tableTitle.button"
            :key="index"
            :disabled="item.disabled"
            @click.stop="handleClickBtn(item)">
            <span :class="item.iconfont"></span>
            {{item.label}}
          </el-button>
          <slot name="customize-btn"></slot>
        </el-col>
      </el-row>
    </el-header>

    <!-- 表格正文 -->
    <el-main class="tableContent">
      <el-table
        :data="dataList"
        highlight-current-row
        stripe
        style="width: 100%"
        :show-summary='showSummary'
        :max-height="tableHeight"
        :border="border"
        @cell-mouse-enter="setCellStyle"
        @cell-mouse-leave="delCellStyle"
        @selection-change="handleSelectChange"
        @select="manualSelectChange"
        @select-all="manualSelectChange"
        @sort-change="listSort"
        @row-click="clickRow"
        @header-dragend="headerDragend"
        @cell-click="clickCell"
        v-loading="loading"
        ref="singleTable"
        element-loading-text="数据加载中，稍后呈现"
        element-loading-spinner="el-icon-loading">
        <div slot="empty">
          <template>
            <slot name="empty">暂无查询数据</slot>
          </template>
        </div>
        <el-table-column type="expand" v-if="hasExpand">
           <template slot-scope="scope">
             <slot name="expand" :value="scope.row"></slot>
           </template>
        </el-table-column>
        <el-table-column v-if="hasSelect" :fixed="fixed" class-name="tableSelect" :selectable="isCheck" width="35" type="selection"></el-table-column>
        <el-table-column v-if="hasIndex && tableHead.length" :fixed="fixed" class-name="tableIndex" label="序号" width="60" type="index">
        </el-table-column>
        <el-table-column
          v-for="item in tableHead"
          :min-width='tableHeadWidth(item)'
          :label="item.name"
          :key="item.name"
          :sortable="item.isSortable"
          :prop="item.prop"
          :fixed="fixed && item.fixed"
          :align='align'>
          <template slot-scope="scope">
            <slot v-if="item.showRow" :name="item.prop" :value="scope.row"></slot>
            <slot v-else-if="item.showscope" :name="item.prop" :value="scope"></slot>
            <slot
              v-else-if="item.value.split(',').length === 1"
              :name="item.prop"
              :value="scope.row[item.value]">
            </slot>
            <slot
              v-else
              :name="item.prop"
              :value="scope.row[item.value.split(',')[0]]+ '--' + scope.row[item.value.split(',')[1]]">
            </slot>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          v-if="oprate.isShow"
          :width="oprate.width / 15 * cellWidth"
          :label="oprate.name"
          :fixed="fixed && oprate.fixed"
          :key="oprate.name"
          :align='align'>
          <template slot-scope="scope">
            <slot v-if="!oprate.showscope" name="oprate" :value="scope.row"></slot>
            <slot v-if="oprate.showscope" name="oprate" :value="scope"></slot>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 表格分页 -->
    <transition name="fade">
      <el-footer class="tableFooter">
        <jump-pagination
          :short='short'
          :name='name'
          :is-show-size="isShowSize"
          :total="pagination.totalCount"
          :page-count="pagination.pageCount"
          :current-page="pagination.pageIndex"
          @change-size="handleChangePage"
          @change="handleChangePage">
        </jump-pagination>
      </el-footer>
    </transition>
  </el-main>
</template>

<script>
import jumpPagination from './layout-myPagination.vue'
import eventBus from '../../event-bus'
let that
export default {
  props: {
    dataList: {
      // 列表数据
      type: Array,
      default: () => []
    },
    tableHead: {
      // 表头数据
      type: Array,
      default: () => []
    },
    showBatchSelect: {
      type: Boolean,
      default: false
    }, // 是否支持翻页记忆
    batchSelect: {
      type: Object,
      default: null
    }, // 翻页记忆选中
    hasSelect: {
      // 是否有复选框
      type: Boolean,
      default: false
    },
    hasIndex: {
      // 是否有序号
      type: Boolean,
      default: true
    },
    hasTitle: {
      // 是否有表格标题
      type: Boolean,
      default: true
    },
    tableTitle: Object, // 列表标题
    // pagination: Object, // 分页参数
    endingLoad: {
      // 是否加载完成
      type: Boolean,
      default: false
    },
    rowClickable: {
      // 列表行是否可点击
      type: Boolean,
      default: true
    },
    cellClickable: {
      // 单元格是否可点击
      type: Boolean,
      default: true
    },
    cellEnterable: {
      // 单元格是否执行悬浮事件
      type: Boolean,
      default: false
    },
    pagination: {
      // 分页参数
      type: Object,
      default: () => {
        return {}
      }
    },
    clickFirstRow: {
      // 是否默认点击第一条数据
      type: Boolean,
      default: false
    },
    oprate: {
      // 操作列
      type: Object,
      default: () => {
        return {
          isShow: false, // 是否含有操作列
          name: '操作',
          width: 400
        }
      }
    },
    border: {
      // 是否有表格边框
      type: Boolean,
      default: true
    },
    isJump: {
      // 是否跳页,默认正常分页
      type: Boolean,
      default: true
    },
    showFooter: {
      // 是否显示分页
      type: Boolean,
      default: true
    },
    align: {
      // 对齐方式
      type: String,
      default: 'left'
    },
    pushType: {
      // 特殊页面 表格标题--按钮样式
      type: Number
    },
    showTishi: {
      type: Boolean,
      default: true
    },
    isCheck: { // 复选框是否可选
      type: Function,
      default: () => {
        return true
      }
    },
    fixed: { // 是否固定列
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: [String, Number],
      default: 'initial'
    },
    isDoChangePage: {
      type: Boolean,
      default: false
    },
    short: { // 是否为短分页
      type: Boolean,
      default: true
    },
    name: { // 组件名称
      type: String,
      default: ''
    },
    isShowSize: {
      type: Boolean,
      default: true
    }, // 是否显示 自选每页页数 下拉框
    hasExpand: {
      type: Boolean,
      default: false
    }, // 列表是否展开功能
    showSummary: {
      type: Boolean,
      default: false
    } // 是否显示合并
  },
  computed: {
    loginId () {
      // 登录用户id
      // return this.$store.user.id
      return 367
    },
    loading () {
      // 列表是否加载
      return this.endingLoad
    },
    indexWidth () { // 索引列宽度
      // return 60
      const addWidth = this.cellWidth === 12 ? (10 / 15) * 14 : (10 / 15) * this.cellWidth
      // let addWidth = 10 / 15 * this.cellWidth
      const minWidth = this.cellWidth === 12 ? (50 / 15) * 14 : (50 / 15) * this.cellWidth
      // let minWidth = 50 / 15 * this.cellWidth
      let maxIndex = ''
      if (this.showFooter) {
        if (this.isShowSize) {
          maxIndex = String(this.size * (this.pagination.pageIndex - 1) + this.dataList.length)
        } else {
          maxIndex = String(window.config.commonPageSize * (this.pagination.pageIndex - 1) + this.dataList.length)
        }
      } else {
        maxIndex = String(this.dataList.length)
      }
      return maxIndex.length <= 3 ? minWidth : (maxIndex.length - 3) * addWidth + minWidth
    }
  },
  components: {
    jumpPagination
  },
  data () {
    return {
      size: 10, // 自选每页的数量
      cellWidth: 12, // 单元格长度单位
      itemWidth: 65, // 默认最小列宽
      itemcheckarr: [], // 选中的条目
      itemcheckarrAll: []
    }
  },
  beforeCreate () {
    that = this
  },
  created () {
    this.cellWidth = this.$store.state.echartsUnit
    // this.getUserInfo().then(data => {
    //     this.$store.commit('set_user', data)
    // }) // 获取用户信息
  },
  mounted () {
    window.addEventListener('resize', () => {
      that.$nextTick(() => {
        that.refreshTable()
      })
    })
    eventBus.$on('clickQueryBtn' + this.$route.path + this.name, () => {
      if (this.showBatchSelect) {
        this.clearSelecAll()
      }
    })
  },
  methods: {
    /**
     * @desc 排序初始化
     * @param prop 
     * @param order 
     */
    sortTable (prop, order) {
      this.$refs.singleTable.sort(prop, order)
    },
    headerDragend () {
      this.refreshTable()
    },
    refreshTable () {
      this.$refs.singleTable && this.$refs.singleTable.doLayout()
    },
    setCellStyle (row, colum, cell, arg) {
      if (this.cellEnterable) {
        $(arg.srcElement.parentElement)[0].style.background = row.color
      }
    },
    delCellStyle (row, colum, cell, arg) {
      if (this.cellEnterable) {
        $(arg.srcElement.parentNode)[0].style.background = ''
      }
    },
    /**
     * @desc 设置选中的方法
     */
    setSelectRow () {
      if (!this.itemcheckarrAll || this.itemcheckarrAll.length <= 0) {
        return
      }
      // 标识当前行的唯一键的名称
      const idKey = this.batchSelect.idKey
      const selectAllIds = []
      this.itemcheckarrAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })

      this.$refs.singleTable.clearSelection()
      for (let i = 0; i < this.dataList.length; i++) {
        if (selectAllIds.indexOf(this.dataList[i][idKey]) >= 0) {
          this.$refs.singleTable.toggleRowSelection(this.dataList[i], true)
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData () {
      // 标识当前行的唯一键的名称
      const idKey = this.batchSelect.idKey
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.itemcheckarrAll.length <= 0) {
        this.itemcheckarrAll = this.itemcheckarr
        return
      }
      // 总选择里面的key集合
      const selectAllIds = []
      this.itemcheckarrAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      const selectIds = []
      // 获取当前页选中的id
      this.itemcheckarr.forEach(row => {
        selectIds.push(row[idKey])
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          this.itemcheckarrAll.push(row)
        }
      })
      const noSelectIds = []
      // 得到当前页没有选中的id
      this.dataList.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey])
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < this.itemcheckarrAll.length; i++) {
            if (this.itemcheckarrAll[i][idKey] === id) {
              // 如果总选择中有未被选中的，那么就删除这条
              this.itemcheckarrAll.splice(i, 1)
              break
            }
          }
        }
      })
    },
    /**
     * @desc 复选框change事件
     * @param {*选中的复选框} val
     * @author linjie
     */
    handleSelectChange (val) {
      this.itemcheckarr = [...val]
      this.$emit('selectionchange', val, this.$refs.singleTable)
    },
    manualSelectChange (val) {
      this.$emit('manualchange', val, this.$refs.singleTable)
    },
    /**
     * @desc 点击表格头部按钮
     * @param {*点击的条目} item
     * @author linjie
     */
    handleClickBtn (item) {
      if (this.hasSelect) {
        if (this.showBatchSelect) {
          this.changePageCoreRecordData()
          this.$emit('title-click', item.value, this.itemcheckarrAll)
        } else {
          this.$emit('title-click', item.value, this.itemcheckarr)
        }
      } else {
        this.$emit('title-click', item.value)
      }
    },
    /**
     * @desc 操作单条数据
     * @param {*点击的按钮} value
     * @param {*点击的按钮} item
     * @author linjie
     */
    oprateItem (value, item) {
      this.$emit('item-oprate', value, item)
    },
    /**
     * @desc 点击上下页
     * @param {*页码} val
     * @author linjie
     */
    handleChangePage (val, path, size) {
      // 判断是默认evenBus分页还是$emit回调分页
      this.size = size
      if (!this.isDoChangePage) {
        eventBus.$emit('clickPageBtn' + path, val, size)
      } else {
        this.$emit('clickPageBtn', val, size)
      }
      
      if (this.showBatchSelect) {
        this.changePageCoreRecordData()
      }
    },
    /**
     * @desc 点击列表行
     * @author linjie
     */
    clickRow (row) {
      if (!this.rowClickable) {
        this.hasSelect && this.$refs.singleTable.toggleRowSelection(row)
        return
      }
      this.$emit('row-click', row)
    },
    /**
     * @desc 清除复选框选中
     * @author linjie
     */
    clearSelecAll () {
      this.itemcheckarrAll = []
      this.itemcheckarr = []
      this.$emit('selectionchange', this.itemcheckarr, this.$refs.singleTable)
      this.$refs.singleTable && this.$refs.singleTable.clearSelection()
    },
    toggleSelection (val) {
      this.$refs.singleTable.toggleRowSelection(val, true)
    },
    /**
     * @desc 点击单元格
     * @author linjie
     */
    clickCell (row, column, cell) {
      if (!this.cellClickable) return
      this.$emit('cell-click', row, column, cell)
    },
    /**
     * @desc 排序
     * @param {*排序参数} org
     * @author linjie
     */
    listSort (arg) {
      // console.log(arg)
      this.$emit('list-sort', arg)
    },
    tableHeadWidth (item) {
      const product = this.cellWidth === 12 ? 14 : this.cellWidth
      return this.tableHead.length > 13 ? 140 / 15 * product : item.width ? item.width / 15 * product : this.itemWidth / 15 * product
    }
  },
  filters: {
    textfilt (val) {
      return $.trim(val) || '--'
    }
  },
  watch: {
    dataList: {
      handler (val) {
        if (this.showBatchSelect) {
          setTimeout(() => {
            this.setSelectRow()
          }, 300)
        }
        if (!val.length && this.showTishi) this.showMessageBox('暂无查询数据！')
        if (this.clickFirstRow && val.length) {
          this.$refs.singleTable.setCurrentRow(this.dataList[0])
          this.$emit('row-click', this.dataList[0])
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
 .tableContainer {
  width: 100%;
  // height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  background: #fff;

  .tableTitle {
    flex: 0 0 3.6rem;
    line-height: 3.6rem;
    padding: 0;
    .titleContainer {
      display: flex;
    }
    .titleText {
      line-height: 3.6rem;
      font-size: 1rem;
      color: #151515;
      font-weight: bold;
      // width: 5rem;
      // font-size: 12px;
    }

    .titleBtn {
      width: auto;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      float: right;
      margin-right: 1.3rem;
      font-size: 0.9rem;

      .recommend-tab {
        padding: 5px 0;
        display: flex;
        align-items: center;
        width: 200px;
        margin-top:15px;
        span {
            flex: 1;
            height: 20px;
            line-height: 20px;
            text-align: center;
            color: #333;
            background: #fff;
            position: relative;
            cursor: pointer;
            border: 1px solid #ccc;

            &::after {
                content: '';
                display: block;
                position: absolute;
                bottom: -12px;
                left: 43px;
                width: 0;
                height: 0;
                border: 6px solid transparent;
            }

            &.active {
                color: #fff;
                background: #78e;
                border-color: transparent;

                &::after {
                    border-top-color: #78e;
                }
            }
        }
      }
    }
    .titleName {
      margin-left: 0.6rem;
      height: 100%;
      // text-align: center;
      position: relative;
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .colorBlock {
      height: 100%;
      width: 4px;
      margin-top: 1.3rem;

      .el-row {
        width: 100%;
        height: 1rem;
        background: #78e;
      }
    }
  }

  .tableContent {
    flex: 1;
    padding: 0 1rem;
    display: flex;
    .el-table {
      flex: 1;
      // height: 100%;
      border: none;

      /deep/.caret-wrapper {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 34px;
        width: 24px;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;

        .sort-caret {
          width: 0;
          height: 0;
          border: 6px solid transparent;
          position: absolute;
          left: 7px;

          &.ascending {
            border-bottom-color: #ccc;
            top: 3px;
          }

          &.descending {
            border-top-color: #ccc;
            top: 17px;
          }
        }
      }

      /deep/.descending {
        .caret-wrapper {
          .sort-caret {
            &.descending {
              border-top-color: #78e
            }
          }
        }
      }

      /deep/.ascending {
        .caret-wrapper {
          .sort-caret {
            &.ascending {
              border-bottom-color: #78e
            }
          }
        }
      }
    }
  }

  > .tableFooter {
    flex: 0 0 3.6rem;
    line-height: 3.6rem;
    padding: 0;

    .datapagerbox {
      background: #fff;

      .number {
        color: #ffbf00;
      }
    }

    /deep/.el-pagination {
      display: flex;
      span:not([class*="suffix"]) {
        color: #333;
      }
    }
  }
}
.btnPrimary {
  padding: 0 1rem;
  height: 2rem;
  line-height: 2rem;
  background: #78e;
  color: #fff;
  border-radius: 0.23rem;
  border: none;
  font-size: 1rem;

  &:hover {
    background: #9aa7f7;
  }
  &.is-disabled {
    background: #999;
    :hover {
      background: #999;
    }
  }
}
table {
  border-collapse: collapse !important;
}
</style>
