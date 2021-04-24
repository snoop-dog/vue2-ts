<template>
  <transition name='el-zoom-in-bottom'>
    <div class="modal" :class="{'dragable': dragable}" v-if="modal && visible">
      <div class="modal-box" :class="[size, {'is-form':form}]" ref="modal">
        <div :class="['modal-header', { 'hasRightBox': hasRightBox }]">
          <slot name="header">
            <span class="title">{{title}}</span>
          </slot>
          <i class="el-icon-close" @click.stop="handlerClickCancel"></i>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div :class="['modal-footer', { 'hasRightBox': hasRightBox }]" v-if="showBtns">
          <slot name="footer">
            <span class="btn_search" @click.stop="handlerClickSubmit">确定</span>
            <span class="btn_reset" @click.stop="handlerClickCancel">取消</span>
          </slot>
        </div>
      </div>
      <slot name="appList"></slot>
    </div>

    <div v-if="!modal && visible" class="modal-box" :class="[size, {'is-form':form}]" ref="modal">
      <div class="modal-header">
        <slot name="header">
          <span class="title">{{title}}</span>
        </slot>
        <i class="el-icon-close" @click.stop="handlerClickCancel"></i>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer" v-if="showBtns">
        <slot name="footer">
          <span class="btn_search" @click.stop="handlerClickSubmit">确定</span>
          <span class="btn_reset" @click.stop="handlerClickCancel">取消</span>
        </slot>

      </div>
    </div>
  </transition>
</template>

<script>
import '../../../assets/js/jquery-ui-drag.min'
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    modal: {
      type: Boolean,
      default: false
    },
    size: String, // smalll
    form: {
      type: Boolean,
      default: false
    },
    dragable: {
      type: Boolean,
      default: false
    },
    showBtns: { // 是否显示默认按钮
      type: Boolean,
      default: true
    },
    hasRightBox: { // 是否含有右侧弹框
      type: Boolean,
      default: false
    },
    isHideBox: {
      type: Boolean,
      default: false
    } // 通过cancel事件取消弹框
  },
  data () {
    return {}
  },
  mounted () {
    // 基于 jquery-ui 的拖放插件，需提前引入
    if (!this.modal && this.dragable) {
      $('.modal-box').draggable({
        cursor: 'move',
        handle: '.modal-header',
        containment: $('body')
      })
    }
  },
  methods: {
    // 确定
    handlerClickSubmit () {
      this.$emit('submit')
    },
    // 关闭
    handlerClickCancel () {
      if (!this.isHideBox) {
        this.$emit('update:visible', false)
      }
      this.$emit('cancel')
    }
  }
}
</script>
