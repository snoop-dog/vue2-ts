/*
 * @Author: Qi Linjie
 * @Date: 2019-05-31 11:37:57
 * @Last Modified by: zhouxuan
 * @Last Modified time: 2021-02-02 13:42:40
 */
<template>
  <el-container class="searchModule" id="searchModule" ref="searchModule">
    <el-row class="mainBox" id="mainBox">
      <el-col class="searchBox" :id="domId">
        <el-form :class="showMoreInput ? 'showInput' : 'hideInput'" @submit.native.prevent>
          <el-form-item
            ref='inputItem'
            class="input-item"
            v-if="!item.isHide"
            :class="[item.type, { 'with-detail': item.withDetail }]"
            v-for="(item, index) in showSearchParam"
            :label="item.label"
            :key="index">
            <template slot-scope="scope">
              <!-- 判断显示何种类型input框 -->
              <el-input
                clearable
                v-if="item.type === 'input'"
                :class="item.className"
                @keyup.enter.native="clickQueryBtn"
                ref="qlj"
                :placeholder="item.placeholder"
                :data-input-memory='item.showInputMemory || "notMemory"'
                :data-type="item.property"
                v-model.trim="formModel[item.property]"
                @input="inputChange">
              </el-input>
              <div class="inputNumber" v-else-if="item.type === 'inputnumber'">
                <el-input-number 
                  v-model="formModel[item.property]" 
                  :placeholder="item.placeholder"
                  @keyup.enter.native="clickQueryBtn"
                  :min="1" 
                  :max="item.max ? item.max : Infinity"
                  :controls="false" 
                  :precision="0">
                </el-input-number>
                <span v-if="!item.isNoText">(分钟)</span>
              </div>

              <el-radio-group v-model="formModel[item.property]" v-else-if="item.type === 'radio'">
                <el-radio :label="it.value" v-for="it in item.data" :disabled="it.disabled" :key="it.value">
                  {{it.label}}
                </el-radio>
              </el-radio-group>

              <el-select
                v-else-if="item.type === 'select' && !item.loadMore"
                v-model="formModel[item.property]"
                :placeholder="item.placeholder"
                :multiple="item.multiple"
                :collapse-tags="item.collapseTags"
                :disabled="item.disabled"
                :filterable="item.filterable"
                clearable
                size="small"
                :value="item.value">
                <el-option-group
                v-if="item.plateGsd"
                v-for="(itemlist, index) in item.data"
                :key="index"
                :label="itemlist.label">
                  <el-option
                  v-for="list in itemlist.options"
                  :key="list.code || list[item.propvaule]"
                  :label="list.value || list[item.proplabel]"
                  :value="list.code || list[item.propvalue]"
                  >
                  </el-option>
                </el-option-group>
                <el-option
                  v-if="!item.plateGsd"
                  v-for="(itemlist, index) in item.data"
                  :key="index"
                  :label="itemlist.label || itemlist[item.proplabel]"
                  :value="itemlist.value || itemlist[item.propvalue]">
                  <slot :value="itemlist"></slot>
                </el-option>
              </el-select>
              <select-tree
                v-else-if="item.type === 'tree'"
                class="form-sitebox"
                :site-tree-data="item.data"
                v-model="formModel[item.property]"
                :default-props="item.props"
                :placeholder='item.placeholder'
                :parentid='item.parentid'
                ref="selectTree">
              </select-tree>

              <select-tree-prev
                v-else-if="item.type === 'treePrev'"
                class="form-sitebox"
                :site-tree-data="item.data"
                v-model="formModel[item.property]"
                :default-props="item.props"
                :placeholder='item.placeholder'
                ref="selectTree">
              </select-tree-prev>

              <select-tree-single
                v-else-if="item.type === 'treeSingle'"
                class="form-sitebox"
                :site-tree-data="item.data"
                v-model="formModel[item.property]"
                :default-props="item.props"
                :placeholder='item.placeholder'
                ref="selectTree">
              </select-tree-single>

              <el-row v-else-if="item.type === 'time'" class="timeBox">
                <date-picker
                  v-model="formModel[item.property][0]"
                  :options="item.disableddate"
                  :type="item.dateType ? item.dateType : 'datetime'"
                  placeholder="开始时间"
                  format="yyyy-MM-dd"
                  :clearable="!item.clearable"
                  style="margin-right: 10px">
                </date-picker>
                <date-picker
                  v-model="formModel[item.property][1]"
                  :options="item.disableddate"
                  format="yyyy-MM-dd"
                  :clearable="!item.clearable"
                  :type="item.dateType ? item.dateType : 'datetime'"
                  placeholder="结束时间">
                </date-picker>
              </el-row>
              <el-tooltip v-if="item.withDetail" :content="item.message" placement="top" effect="light">
                <i @click.stop="handleClickDetail" :class="item.icon"></i>
              </el-tooltip>
            </template>
          </el-form-item>
          <slot name="showmore"></slot>
        </el-form>
      </el-col>
      <search-btn ref="btn" :query-loading='queryLoading' :operation-id="operationId" :menu-id="menuId" :redtype-arr='redtypeArr' @querybtn='clickQueryBtn' @resetbtn='clickResetBtn' :buried-point='formModelStr'></search-btn>
      <el-col class="custom-class">
        <slot name="custom-box">
          <div v-if="showCustomBox">
            <el-checkbox v-model="checkbox">查看历史数据</el-checkbox>
          </div>
        </slot>
      </el-col>
      <transition name="fade">
        <el-col class="moreCondition" ref="moreCondition" v-if="showMore">
          <el-col class="moreText">更多筛选</el-col>
          <el-col class="moreIcon" @click.native="pickUpInput">
            <i :class="showMoreInput ? 'el-icon-arrow-up' : 'el-icon-arrow-right'"></i>
          </el-col>
        </el-col>
      </transition>
    </el-row>
  </el-container>
</template>

<script>
/* eslint-disable */
import Vue from "vue";
import selectTree from "../select/select-tree";
import selectTreePrev from "../select/select-tree-prev";
import selectTreeSingle from "../select/select-tree-single";
import searchBtn from "./layout-search-btn";
import elementResizeEvent from "element-resize-event";
import eventBus from "../../event-bus";
import _ from "lodash";
import $ from 'jquery'

import { flattenTree } from '../../../utils/index'
// utils
import { doDateTimeShift } from '../../../utils/date'

export default {
  props: {
    searchParam: {
      // 查询参数
      type: Array,
      default: () => []
    },
    redtypeArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    showCurrentTime: {
      type: Boolean,
      default: false
    }, // 重置时是否显示当天0时到当天当前时间
    currentTimeDay: {
      type: String,
      default: ''
    }, // 重置时根据这个参数来计算回到哪一天的0时
    queryLoading: {
      // 查询loading
      type: Boolean,
      default: false
    },
    menuId: {
      type: String,
      default: ''
    }, // 菜单id
    operationId: {
      type: String,
      default: '100'
    }, // 埋点操作id
    domId: {
      type: String,
      default: 'searchBox'
    },
    name: {
      type: String,
      default: ''
    },
    tableSize: {
      type: [String, Number],
      default: ''
    },
    resetFlag: {
      type: Boolean,
      default: false
    },
    showCustomBox: {
      type: Boolean,
      default: false
    }, // 头部筛选自定义复选框
    isFirstRequset: {
      type: Boolean,
      default: true
    } // 初始化页面时自动请求第一次
  },
  data() {
    return {
      showMore: null,
      showMoreInput: false, // 是否显示更多条件
      formModel: {}, // 查询参数值
      formModelStr: {}, // 查询参数值翻译
      initParam: {}, // 初始参数
      showSearchParam: [],
      checkbox: false,
      index: 0,
      initWidth: 0,
      size: '', // 自选每页的数量
      domRefsArray: []
    };
  },
  computed: {
    // 过滤隐藏的input
    showInput() {
      return this.searchParam.filter((item, index, arr) => {
        return !item.isHide;
      });
    },
    // 显示需要放入更多筛选中的第一个输入框的索引（不足页面宽度。）
    showMoreIndex(){
      return this.searchParam.length > 1 ? this.searchParam.findIndex(item => item.isMore) : -1
    },
    // 显示的input输入框宽度统计
    showInputWidthArr() {
      let widthArr = [];
      [].map.call(this.domRefsArray, (item, index) => {
        if (index < this.showInput.length) {
          widthArr.push(item.offsetWidth)
        }
      })
      // this.domRefsArray.map((item, index) => {
       
      // })
      return widthArr;
    },
    // 显示的input输入框宽度总和
    showInputWidth() {
      let sum = 0;
      return this.showInputWidthArr.map(x => (sum += x));
    },
    renovate () {
      return this.$store.state.renovate
    },
  },
  components: {
    selectTree,
    selectTreePrev,
    selectTreeSingle,
    searchBtn,
  },
  mounted() {
    this.showSearchParam = [...this.showInput]
    // 初始屏幕宽度
    this.initWidth = this.$refs.searchModule.$el.offsetWidth
    // 初始化查询参数
    let promise = new Promise((resolve, reject) => {
      this.searchParam.forEach(item => {
        Vue.set(this.formModel, item.property, item[item.property]);
        if (!item.isHide) {
          if (item.label.split('：')[0].indexOf('时间')!== -1 && typeof item[item.property] === 'object' && item[item.property].length) {
            if (item[item.property][0] || item[item.property][1]) {
              Vue.set(this.formModelStr, item.label.split('：')[0], item[item.property].map(item => doDateTimeShift(item)));
            } else {
              delete this.formModelStr[item.label.split('：')[0]]
            }
          } else {
            Vue.set(this.formModelStr, item.label.split('：')[0], item[item.property]);
          }
        }
      })
      resolve(this.formModel)
    }).then(data => {
      this.initParam = _.cloneDeep(data)
      this.isFirstRequset && this.clickQueryBtn()
    })
    this.$nextTick(() => {
      this.domRefsArray = document.querySelectorAll('.input-item') || []
      // console.log(this.domRefsArray)
      let staticWidth = this.$refs.btn.$el.offsetWidth + 90
      let customWidth = document.getElementsByClassName('custom-class')[0].offsetWidth
      if (this.showInputWidth[this.showInputWidth.length - 1] > this.$refs.searchModule.$el.offsetWidth - staticWidth - customWidth) {
        this.showMore = true;
        this.showInput.map((item, index) => {
          if (this.showInputWidth[index] < this.$refs.searchModule.$el.offsetWidth - staticWidth - customWidth &&
            this.showInputWidth[index + 1] > this.$refs.searchModule.$el.offsetWidth - staticWidth - customWidth) {
            this.index = index
            $(`#${this.domId}`).width(this.showInputWidth[index] ? this.showInputWidth[index] : 'auto')
            this.showSearchParam = this.showInput.slice(0, this.index + 1);
          }
        });
      } else {
        if(this.showMoreIndex > -1){
          this.showMore = true;
          this.index = this.showMoreIndex -1
          let widthC = this.showInputWidth[this.showMoreIndex] - this.showInputWidth[this.index]
          if(widthC > this.showInputWidth[this.index]){
            $(`#${this.domId}`).width(widthC ? widthC : 'auto')
          }else {
            $(`#${this.domId}`).width(this.showInputWidth[this.index] ? this.showInputWidth[this.index] : 'auto')
          }
          this.showSearchParam = this.showInput.slice(0, this.index + 1);
        } else {
          this.showMore = false
          this.showSearchParam = [...this.showInput];
          $(`#${this.domId}`).width(
            this.showInputWidth[this.showInputWidth.length - 1] ? this.showInputWidth[this.showInputWidth.length - 1] : 'auto'
          )
        }
      }
    })

    // 监听查询模块的宽度
    var element = document.getElementById("searchModule");
    if (element) {
      elementResizeEvent(element, e => {
        if (e.target.innerWidth === this.initWidth) return
          this.initWidth = e.target.innerWidth
          this.showMoreInput = false
          let staticWidth = this.$refs.btn.$el.offsetWidth + 90
          let customWidth = document.getElementsByClassName('custom-class')[0].offsetWidth
          if ( this.showInputWidth[this.showInputWidth.length - 1] > this.$refs.searchModule.$el.offsetWidth - staticWidth - customWidth) {
            this.showInput.map((item, index) => {
              if (this.showInputWidth[index] < this.$refs.searchModule.$el.offsetWidth - staticWidth - customWidth &&
                this.showInputWidth[index + 1] > this.$refs.searchModule.$el.offsetWidth - staticWidth - customWidth) {
                this.index = index
                $(`#${this.domId}`).width(this.showInputWidth[index])
                this.showSearchParam = this.showInput.slice(0, this.index + 1)
                // this.$nextTick(() => {
                //   this.domRefsArray = document.querySelectorAll('.input-item') || []
                //   $("#searchBox").width(this.showInputWidth[this.showInputWidth.length - 1] ? this.showInputWidth[this.showInputWidth.length - 1] : 'auto')
                // })
              }
            });
            this.showMore = true
          } else {
            this.showMore = false
            this.showSearchParam = [...this.showInput]
            this.$nextTick(() => {
              $(`#${this.domId}`).width('auto')
              this.domRefsArray = document.querySelectorAll('.input-item') || []
              $(`#${this.domId}`).width(this.showInputWidth[this.showInputWidth.length - 1] ? this.showInputWidth[this.showInputWidth.length - 1] : 'auto')
            })
          }
      })
    }
   
    this.pageIndexListener()
  },
  methods: {
    /**
     * @desc 收起，展开条件
     * @author linjie
     */
    pickUpInput() {
      this.showMoreInput = !this.showMoreInput;
      this.$store.dispatch('setRenovate',  this.showMoreInput)
      if (this.showMoreInput) {
        this.showSearchParam = [...this.showInput];
      } else {
        if(this.showMoreIndex > -1) {
          this.index = this.showMoreIndex -1
          let widthC = this.showInputWidth[this.showMoreIndex] - this.showInputWidth[this.index]
          if(widthC > this.showInputWidth[this.index]){
            $(`#${this.domId}`).width(widthC ? widthC : 'auto')
          }else {
            $(`#${this.domId}`).width(this.showInputWidth[this.index] ? this.showInputWidth[this.index] : 'auto')
          }
        }
        this.showSearchParam = this.showInput.slice(0, this.index + 1)
      }
      this.$emit("solt-show",this.showMoreInput)
    },
    /**
     * @desc 点击查询按钮
     * @param {Boolean} resetFlag 重置标示
     * @author linjie
     */
    clickQueryBtn(resetFlag) {
      // if (this.queryLoading) return;
      if (this.resetFlag) {
        this.$emit("query", this.formModel, 1, this.size ? this.size : 10, resetFlag === true ? resetFlag : false)
        eventBus.$emit("clickQueryBtn" + this.$route.path + this.name, true, resetFlag === true ? resetFlag : false)
      } else {
        this.$emit("query", this.formModel, 1, this.size ? this.size : 10)
        eventBus.$emit("clickQueryBtn" + this.$route.path + this.name, true)
      }
    },
    /**
     * @desc 点击重置按钮
     * @author linjie
     */
    clickResetBtn() {
      // if (this.queryLoading) return;
      const _self = this
      let propArray = Object.keys(_self.initParam)
      let timeArray = propArray.filter(item => item.indexOf('time') !== -1)
      if (timeArray.length) {
        timeArray.map(item => {
          _self.initParam[item].map(it => {
            if (!_self.initParam[item][1] && !_self.initParam[item][0]) return
            let currentStamp = new Date().getTime()
            let timeDiff = new Date(_self.initParam[item][1]).getTime() - new Date(_self.initParam[item][0]).getTime()
            if (_self.showCurrentTime) {
              _self.initParam[item][0] = _self.currentTimeDay ? new Date(new Date(new Date().toLocaleDateString()).getTime() - 24 *60 *60 * _self.currentTimeDay * 1000) :new Date(new Date(new Date().toLocaleDateString()).getTime())
              _self.initParam[item][1] = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 *60 *60 *1000)
            } else {
              _self.initParam[item][0] = new Date(new Date().getTime() - timeDiff)
              _self.initParam[item][1] = new Date()
            }
            
          })
        })
      }
      _self.formModel = _.cloneDeep(_self.initParam)
      _self.clickQueryBtn(true);
    },
    /**
     * @desc 修改结束时间
     * @author linjie
     */
    changeEndTime(value, dateString) {
      this.formModel.time[1] = dateString;
    },
    /**
     * @desc 修改开始时间
     * @author linjie
     */
    changeStartTime(value, dateString) {
      this.formModel.time[0] = dateString;
    },
    /**
     * @desc 列表组件分页
     * @author linjie
     */
    pageIndexListener() {
      eventBus.$on("clickPageBtn" + this.$route.path + this.name, (val, size) => {
        this.size = size
        this.$emit("query", this.formModel, val, size);
        // eventBus.$emit("clickQueryBtn", false);
      });
    },
    /**
     * @desc select 下拉加载
     */
    loadMoreFun(){
        this.$emit('selectloadmore')  
    },
    // input事件
    inputChange(val){
      this.$emit('input',val)
    },
    /**
     * @desc 修改formModel
     */
    changeformModel () {
      this.searchParam.forEach(item => {
        Vue.set(this.formModel, item.property, item[item.property]);
        if (!item.isHide) {
          if (item.label.split('：')[0].indexOf('时间')!== -1 && typeof item[item.property] === 'object' && item[item.property].length) {
            if (item[item.property][0] || item[item.property][1]) {
              Vue.set(this.formModelStr, item.label.split('：')[0], item[item.property].map(item => doDateTimeShift(item)));
            } else {
              delete this.formModelStr[item.label.split('：')[0]]
            }
          } else {
            Vue.set(this.formModelStr, item.label.split('：')[0], item[item.property]);
          }
        }
      })
    },
    /**
     * @desc 埋点翻译参数公共方法
     */
    savePointCommon(item){
      if(item.type == 'select' && !item.isHide){
            if(item.data.length){
              if(!Array.isArray(item[item.property])){
                if (!item[item.property]) return  Vue.set(this.formModelStr, item.label.split('：')[0], '');
                if(item.data[0].label){
                  Vue.set(this.formModelStr, item.label.split('：')[0],item.data.filter(m=>m.value== item[item.property]).length ? item.data.filter(m=>m.value== item[item.property])[0].label : '' )
                }else if(item.data[0].id) {
                  Vue.set(this.formModelStr, item.label.split('：')[0],item.data.filter(m=>m.id == item[item.property])[0].username);
                }else {
                   Vue.set(this.formModelStr, item.label.split('：')[0], item[item.property]);
                }
              } else {
                if (!item[item.property].length) return  Vue.set(this.formModelStr, item.label.split('：')[0], '');
                var str = ''
                item[item.property].map(n => {
                  item.data.map(m=>{
                    if(n == m.username){
                        str += m.username + ','
                    }
                  })
                })
               Vue.set(this.formModelStr, item.label.split('：')[0], str.substr(0,str.length-1));
              }
            }else {
               Vue.set(this.formModelStr, item.label.split('：')[0], '');
            }
          } else if((item.type == 'treePrev' || item.type == "tree" || item.type == 'treeSingle' ) && !item.isHide){
            if(item[item.property].length){
              var str = ''
              let arr = flattenTree(item.data)
              item[item.property].map(n => {
                arr.map(m=>{
                  if(n == m.id){
                      str += m.name + ','
                  }
                })
              })
               Vue.set(this.formModelStr, item.label.split('：')[0], str.substr(0,str.length-1));
            }else {
              Vue.set(this.formModelStr, item.label.split('：')[0], '');
            }
            
          } else if (!item.isHide) {
            if (item.label.split('：')[0].indexOf('时间')!== -1 && typeof item[item.property] === 'object' && item[item.property].length) {
              if (item[item.property][0] || item[item.property][1]) {
                Vue.set(this.formModelStr, item.label.split('：')[0], item[item.property].map(item => doDateTimeShift(item)));
              } else {
                delete this.formModelStr[item.label.split('：')[0]]
              }
            } else {
              Vue.set(this.formModelStr, item.label.split('：')[0], item[item.property]);
            }
            
          }
    },
    /**
     * @description: 点击详细信息图标
     * @param {*} none
     * @returns: void
     */
    handleClickDetail () {
      this.$emit('click-detail')
    }
  },
  watch: {
    // 监听参数的变化
    formModel: {
      handler(val) {
        this.formModel = val
        this.showSearchParam = [...this.showInput];
        this.showMoreInput = this.renovate
        if(!this.renovate){
          this.$nextTick(() => {
            $(`#${this.domId}`).width('auto')
            this.domRefsArray = document.querySelectorAll('.input-item') || []
            let staticWidth = this.$refs.btn.$el.offsetWidth + 90
            if (this.showInputWidth[this.showInputWidth.length - 1] >this.$refs.searchModule.$el.offsetWidth - staticWidth) {
              this.showMore = true;
              this.showInput.map((item, index) => {
                if (this.showInputWidth[index] < this.$refs.searchModule.$el.offsetWidth - staticWidth &&
                  this.showInputWidth[index + 1] > this.$refs.searchModule.$el.offsetWidth - staticWidth) {
                  this.index = index
                  $(`#${this.domId}`).width(this.showInputWidth[index] ? this.showInputWidth[index] : 'auto')
                  this.showSearchParam = this.showInput.slice(0, this.index + 1);
                }
              });
            } else {
                if(this.showMoreIndex > -1){
                 this.showMore = true;
                 this.index = this.showMoreIndex -1
                 let widthC = this.showInputWidth[this.showMoreIndex] - this.showInputWidth[this.index]
                 if(widthC > this.showInputWidth[this.index]){
                   $(`#${this.domId}`).width(widthC ? widthC : 'auto')
                 }else {
                   $(`#${this.domId}`).width(this.showInputWidth[this.index] ? this.showInputWidth[this.index] : 'auto')
                 }
                 this.showSearchParam = this.showInput.slice(0, this.index + 1);
              }else {
                this.showMore = false
                this.showSearchParam = [...this.showInput];
                $(`#${this.domId}`).width(
                  this.showInputWidth[this.showInputWidth.length - 1] ? this.showInputWidth[this.showInputWidth.length - 1] : 'auto'
                )
              }
            }
          })
        }
        for (let k in val) {
          this.searchParam.map(item => {
            if (k === item.property) {
              this.$set(item, k, val[k])
            }
          })
        }
        // this.formModel = obj;
        this.$emit("change", val);
      },
      deep: true
    },
    searchParam: {
      handler (val) {
        this.formModelStr = {}
        val.forEach(item => {
          Vue.set(this.formModel, item.property, item[item.property]);
          this.savePointCommon(item)
        })
        this.showSearchParam = [...this.showInput]
        this.showMoreInput = this.renovate
        if(!this.renovate){
          this.$nextTick(() => {
            $(`#${this.domId}`).width('auto')
            this.domRefsArray = document.querySelectorAll('.input-item') || []
            let staticWidth = this.$refs.btn.$el.offsetWidth + 90
            if (this.showInputWidth[this.showInputWidth.length - 1] >this.$refs.searchModule.$el.offsetWidth - staticWidth) {
              this.showMore = true;
              this.showInput.map((item, index) => {
                if (this.showInputWidth[index] < this.$refs.searchModule.$el.offsetWidth - staticWidth &&
                  this.showInputWidth[index + 1] > this.$refs.searchModule.$el.offsetWidth - staticWidth) {
                  this.index = index
                  $(`#${this.domId}`).width(this.showInputWidth[index] ? this.showInputWidth[index] : 'auto')
                  this.showSearchParam = this.showInput.slice(0, this.index + 1);
                }
              });
            } else {
              if(this.showMoreIndex > -1){
                this.showMore = true;
                this.index = this.showMoreIndex -1
                let widthC = this.showInputWidth[this.showMoreIndex] - this.showInputWidth[this.index]
                if(widthC > this.showInputWidth[this.index]){
                  $(`#${this.domId}`).width(widthC ? widthC : 'auto')
                }else {
                  $(`#${this.domId}`).width(this.showInputWidth[this.index] ? this.showInputWidth[this.index] : 'auto')
                }
                this.showSearchParam = this.showInput.slice(0, this.index + 1);
              }else {
                this.showMore = false
                this.showSearchParam = [...this.showInput];
                $(`#${this.domId}`).width(
                  this.showInputWidth[this.showInputWidth.length - 1] ? this.showInputWidth[this.showInputWidth.length - 1] : 'auto'
                )
              }
            }
          })
        }
      },
      deep: true
    },
    checkbox (val) {
      this.$emit('check-box', val)
    },
    tableSize (val) {
      this.size = val
    }
  },
  filters: {}
};
</script>

<style lang="scss" scoped>
.searchModule {
    padding: 1rem 0;
    background: #fff;
    border-radius: 0.7rem;

    .mainBox {
      display: flex;
      width: 100%;
      align-items: center;
      padding-left: 2rem;

      .showInput {
        height: auto;
        overflow: initial;
        transition: height 1s ease 0s;
      }

      .hideInput {
        height: 40px;
        // overflow: hidden;
        transition: height 1s ease 0s;
      }
      .moreCondition {
        min-width: 6rem;
        height: 2.6rem;
        line-height: 2.6rem;
        display: flex;
        position: fixed;
        right: 1.4rem;

        .moreText {
          flex: 1;
          color: #666;
        }

        .moreIcon {
          flex: 0 0 16px;
          height: 1.6rem;
          line-height: 1.6rem;
          margin-top: 0.5rem;
          color: #fff;
          font-size: 16px;
          background: #78e;
          border-radius: 0.2rem;
          cursor: pointer;

          &:hover {
            background: #9aa7f7;
          }
        }
      }

      .el-form {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        height: auto;

        .time {
          width: 33.33rem;

          .timeBox {
            margin-top: 0.25rem;
          }
        }
      }

      /deep/.input-item {
        display: flex;
        min-width: 19.33rem;
        float: left;
        position: relative;
        margin-bottom: 0;

        &.custom-time {
          width: auto;

          .el-form-item__label {
            min-width: 6rem;
          }

          .el-form-item__content {
            width: 100%;

            .el-radio-group {
              margin: 13px 0;

              .el-radio {
                margin: 0 10px;
              }
            }
          }
        }
        .el-form-item__content {
          height: 2.66rem;
          .el-input__inner {
            height: 2.66rem;
            padding-right: 2rem;
          }
          .inputNumber {
            .el-input-number {
              width: 10rem;
              line-height: 2.66rem;
            }
          }
        }
        
      }

      .el-col-24 {
        width: auto;
        // /deep/ .sitebox {
        //   padding-top: 5px;
        // }
      }
    }
  }

</style>
