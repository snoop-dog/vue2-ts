
<!--树形select框组件 - 父级菜单可选-->
<template>
    <div class="sitebox" v-clickoutside="handleClose">
        <div class="Collection_site el-select" @click.stop="showTreeData">
            <div v-if="siteTreeNamesArray.length > 0 && !showTreeFlag" class="el-select__tags">
                    <span>
                        <span v-for = "(item,index) in siteTreeNamesArray" :key="index" class="el-tag el-tag--primary">
                            <span class="el-select__tags-text">{{item}}</span>
                            <i class="el-tag__close el-icon-close" @click.stop="deleteItem(item,index)"></i>
                        </span>
                    </span>
            </div>
            <input v-else style="min-width:20px;right:0px;" autocompelete=off :placeholder="'输入关键字'"  class="el-select__input is-undefined"
                   debounce="0" v-model="filterText">
        </div>

        <div v-if="showTreeFlag" class="sitetree" @click.stop>
            <el-tree show-checkbox :node-key="defaultProps.id" check-strictly class="filter-tree"  :default-expanded-keys="siteTreeCodes" :default-checked-keys="siteTreeCodes"
                     :data="siteTreeData" :props="defaultProps" :filter-node-method="filterNode" :ref="refId"
                     @check="handleCheckChange">
            </el-tree>
        </div>
    </div>
</template>

<script>
    import clickoutside from './clickoutside.js'
    function getArray (data, id, propsId, propsLabel, propsChildren) {
        for (const i in data) {
            if (data[i][propsId] === id) {
                ary.push(data[i][propsLabel])
                break
            } else {
                getArray(data[i][propsChildren], id, propsId, propsLabel, propsChildren)
            }
        }
    }
    let _self
    export default {
        name: 'select-tree-prev',
        props: {
            siteTreeData: Array,
            defaultProps: Object,
            siteTreeCodes: [Array, String],
            refId: {
                type: String,
                default: 'tree2'
            }
        },
        model: {
            prop: 'siteTreeCodes',
            event: 'input'
        },
        computed: {
            siteTreeNamesArray () {
                if (this.siteTreeData.length > 0 && this.siteTreeCodes.length > 0 && this.defaultProps) {
                    const ary = []
                    this.siteTreeCodes.map((item, index) => {
                        getArray(this.siteTreeData, item, this.defaultProps.id, this.defaultProps.label, this.defaultProps.children)
                    })
                    return ary
                } else {
                    return []
                }
            }
        },
        data () {
            return {
                filterText: '',
                showTreeFlag: false
            }
        },
        beforeCreate () {
            _self = this
        },
        directives: {
            clickoutside
        },
        methods: {
            /**
             * @desc 隐藏下拉框
             */
            handleClose () {
                this.showTreeFlag = false
                this.filterText = ''
            },
            /**
             * @desc 删除某一项
             * @param {*} item
             * @param {*} index
             */
            deleteItem (item, index) {
                const ary = this.siteTreeCodes
                ary.splice(index, 1)
                this.$emit('input', ary)
            },
            /**
             * @desc 节点树控件的节点过滤方法
             */
            filterNode: function (value, data, node) {
                if (!value) return true
                const parent = node.parent
                if (node.level !== 1 && parent && parent.visible) {
                    return true
                }
                return data[this.defaultProps.label].indexOf(value) !== -1
            },
            /**
             * @desc 节点树控件的change事件
             */
            handleCheckChange: function (data, checked, indeterminate) {
               this.$nextTick(() => {
                    const tt = this.$refs[this.refId].getCheckedNodes()
                    this.siteTreeCodes.splice(0, this.siteTreeCodes.length)
                    tt.map((item, index) => {
                        if (!this.siteTreeCodes.includes(item[this.defaultProps.id])) {
                            this.siteTreeCodes.push(item[this.defaultProps.id])
                            this.$refs[this.refId].setCheckedKeys(this.siteTreeCodes)
                            this.setCheckedKeys(this.siteTreeCodes)
                        } else {
                            this.siteTreeCodes.splice(index, 1)
                        }
                    })
                this.$emit('input', this.siteTreeCodes)
               })
            },
            /**
             * @desc 设置选中区域
             * @param {*} val
             */
            setCheckedKeys (val) {
                this.$emit('input', val.join(','))
            },
            /**
             * @desc 点击采集地点输入框时
             */
            showTreeData: function () {
                this.showTreeFlag = true
            },
            /**
             * @desc 清空输入框的值
             */
            clearFilterText () {
                this.filterText = ''
            }
        },
        watch: {
            /**
             * @desc 监听采集地点输入框的值的变化
             * @param {*} val
             */
            filterText (val) {
                if (this.$refs[this.refId] === undefined) {

                } else {
                    this.$refs[this.refId].filter(val)
                }
            },
            /**
             * @desc 监听选中的采集地点的变化
             * @param {*} val
             */
            siteTreeCodes (val) {
                if (val.length === 0) {
                    this.filterText = ''
                }
            }
        }
    }
</script>

<style scoped>

</style>
