
<template>
  <div class="pagination-box datapagerbox" v-show="isShow">
    <div class="pagination-text">
      <div class="pagination-size" v-if="isShowSize">
        <el-select v-model="size" @change="changeSize" :disabled="total === 0" placeholder="请选择" size="mini">
          <el-option
            v-for="item in sizeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span class="search_more_text">
        <span v-if="isShowCurrentPageDesc">
          当前显示第
          <i class="number">{{internalCurrentPage}}</i>页，
        </span>
        共
        <i class="number">{{internalPageCount}}</i>页 , 共计
        <i class="number">{{total}}</i>条数据
      </span>
    </div>
    <div class="pagination-btns-box">
      <span :class="['btn-prev',{'disabled': internalCurrentPage === 1}]" @click="prev">
        上一页
      </span>
      <el-input
       :disabled="internalCurrentPage >= internalPageCount && internalCurrentPage === 1"
       v-model="inputCurrentPage"
       class="input-num"
       @keyup.enter.native="handleCurrentChange">
      </el-input>
      <span
        :class="['btn-next',{'disabled': internalCurrentPage >= internalPageCount}]"
        @click="next">
        下一页
      </span>
    </div>
  </div>
</template>
<script>
import eventBus from '../../event-bus'

export default {
  props: {
    isShow: {
      // isShow
      type: Boolean,
      default: true
    },
    short: {
      // 是否显示 '当前显示第*页'文字描述
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    },
    sizeNum: {
      type: Number,
      default: 20
    },
    isShowSize: {
      type: Boolean,
      default: true
    }, // 是否显示 自选每页页数 下拉框
    total: [Number, String], // 总数
    pageSize: [Number, String], // 每页显示个数
    pageCount: [Number, String], // 页数
    currentPage: [Number, String]
  },

  data () {
    return {
      inputCurrentPage: 1,
      internalCurrentPage: 1, // 当前页数
      isShowCurrentPageDesc: this.short, // 是否显示 '当前显示第*页'文字描述
      DURATION: 1000, // 按钮科点击时间间隔
      canClick: true, // 允许按钮点击
      size: '',
      sizeList: [
        {
          value: 10,
          label: '10条/页'
        },
        {
          value: 20,
          label: '20条/页'
        },
        {
          value: 50,
          label: '50条/页'
        },
        {
          value: 100,
          label: '100条/页'
        }
      ]
    }
  },
  computed: {
    // 计算属性 - 页数
    internalPageCount () {
      if (
        typeof this.pageCount === 'number' ||
        typeof this.pageCount === 'string'
      ) {
        return parseFloat(this.pageCount)
      } else {
        return Math.ceil(parseFloat(this.total) / parseFloat(this.pageSize))
      }
    }
  },
  created () {
    this.size = this.sizeNum
    eventBus.$on('reset-size' + this.$route.path + this.name, () => {
      this.size = 10
    })
  },
  methods: {
    changeSize () {
      this.$emit('change-size', 1, this.$route.path + this.name, this.size)
    },
    handleCurrentChange () {
      const reg = /^([1-9][0-9]*)$/
      if (this.inputCurrentPage > this.internalPageCount) {
        this.inputCurrentPage = this.internalPageCount
      } else if (this.inputCurrentPage < 1) {
        this.inputCurrentPage = 1
      } else if (!reg.test(this.inputCurrentPage)) {
        this.showMessageBox('请输入正整数！', 'warning')
        return
      }
      this.internalCurrentPage = this.getValidCurrentPage(this.inputCurrentPage)
    },
    // 上一页
    prev () {
      if (this.canClick) {
        const newVal = this.internalCurrentPage - 1
        this.internalCurrentPage = this.getValidCurrentPage(newVal)
        this.setCanClick()
      }
    },
    // 下一页
    next () {
      if (this.canClick) {
        const newVal = this.internalCurrentPage + 1
        this.internalCurrentPage = this.getValidCurrentPage(newVal)
        this.setCanClick()
      }
    },
    // 设置按钮切换
    setCanClick () {
      this.canClick = false
      setTimeout(() => {
        this.canClick = true
      }, this.DURATION)
    },
    // 处理页数值
    getValidCurrentPage (value) {
      value = parseInt(value, 10)

      const havePageCount = typeof this.internalPageCount === 'number'

      let resetValue
      if (!havePageCount) {
        if (isNaN(value) || value < 1) resetValue = 1
      } else {
        if (value < 1) {
          resetValue = 1
        } else if (value > this.internalPageCount) {
          resetValue = this.internalPageCount
        }
      }

      if (resetValue === undefined && isNaN(value)) {
        resetValue = 1
      } else if (resetValue === 0) {
        resetValue = 1
      }
      this.inputCurrentPage = resetValue === undefined ? value : resetValue
      return resetValue === undefined ? value : resetValue
    }
  },

  watch: {
    sizeNum (val) {
      this.size = val
    },
    currentPage: {
      immediate: true,
      handler (val) {
        if (typeof val === 'undefined') {

        } else {
          this.internalCurrentPage = val === 0 ? parseFloat(val) + 1 : parseFloat(val)
        }
      }
    },

    internalCurrentPage (newVal, oldVal) {
      newVal = parseInt(newVal, 10)

      /* istanbul ignore if */
      if (isNaN(newVal)) {
        newVal = oldVal || 1
      } else {
        newVal = this.getValidCurrentPage(newVal)
      }

      if (newVal !== undefined) {
        this.$nextTick(() => {
          this.internalCurrentPage = newVal
          if (oldVal !== newVal) {
            this.$emit('update:currentPage', newVal)
            if (this.isShowSize) {
              this.$emit('change', this.internalCurrentPage, this.$route.path + this.name, this.size)
            } else {
              this.$emit('change', this.internalCurrentPage, this.$route.path + this.name)
            }
            this.$emit('reciveparam')
          }
        })
      } else {
        this.$emit('update:currentPage', newVal)
        if (this.isShowSize) {
          this.$emit('change', this.internalCurrentPage, this.$route.path + this.name, this.size)
        } else {
          this.$emit('change', this.internalCurrentPage, this.$route.path + this.name)
        }
      }
    }
  }
}
</script>
