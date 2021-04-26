<template>
  <div :style="{'width':width, 'max-height': '10rem'}">
    <div
      class="kt-tooltip-input__hidden"
      style="position: fixed; left: -19800px; width: auto; overflow: hidden; display: none"
      v-html="defaultValue">
    </div>
    <div
      v-if="flag"
      @mouseenter="visibilityChange($event)"
      style="cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;-webkit-box-orient:vertical;"
      :style="{'-webkit-line-clamp':rows,'color':color}"
      v-html="defaultValue">
    </div>
    <el-tooltip :placement="placement" v-else>
      <div slot="content" class="custom-class">
        <div v-html="splitValue"></div>
      </div>
      <div
        class="custom-img-class"
        style="cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;-webkit-box-orient:vertical;"
        :style="{'-webkit-line-clamp':rows}"
        v-html="defaultValue">
      </div>
    </el-tooltip>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  data () {
    return {
      flag: true,
      splitValue: '',
      defaultValue: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.isSplit) {
        this.defaultValue = this.value
        this.splitValue = String(this.value).replace(/,/g, '<br/>')
      } else {
        this.defaultValue = this.value
        this.splitValue = this.value
      }
    })
  },
  methods: {
    checkChinese (val) {
      const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (reg.test(val)) {
        return true
      } else if (String(val).length < 9) {
        return true
      } else {
        return false
      }
    },
    visibilityChange (event) {
      const ev = event.target
      const thisWidth = ev.offsetWidth // 元素的宽度
      const wordWidth = $(ev)
        .prev('.kt-tooltip-input__hidden')
        .width() // 文本内容的宽度
      if (wordWidth / thisWidth > this.rows) {
        this.flag = false
      }
    }
  },
  watch: {
    value (val) {
      if (this.isSplit) {
        this.defaultValue = this.value
        this.splitValue = String(this.value).replace(/,/g, '<br/>')
      } else {
        this.defaultValue = this.value
        this.splitValue = this.value
      }
      this.flag = true
    }
  },
  computed: {},
  props: {
    value: {
      type: null,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    rows: {
      type: Number,
      default: 1
    },
    color: {
      type: String,
      required: false
    },
    placement: {
      type: String,
      default: 'top'
    },
    typeStr: {
      type: String,
      default: ''
    },
    isSplit: {
      type: Boolean,
      default: false
    }
  }
}
</script>
