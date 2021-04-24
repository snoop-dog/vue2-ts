<!--树形select框组件 - 单选-->
<template>
    <div class="sitebox selectTreeSingle form-sitebox" v-clickoutside="handleClose">
            <div class="Collection_site el-select" @click.stop="showTreeData">
                <div v-if="siteTreeName " class="el-select__tags">
                    <span class="el-tag el-tag--primary">
                        <span>{{siteTreeName}}</span>
                        <i class="el-tag__close el-icon-close" @click.stop="deleteItem"></i>
                    </span>
                </div>
                <input v-else style="min-width:20px;right:0px;" autocomplete="off" :placeholder="'输入关键字'"  class="el-select__input is-undefined"
                    debounce="0" v-model="filterText">
            </div>

            <div v-if="showTreeFlag" class="sitetree" @click.stop>
                <el-tree show-checkbox :node-key="defaultProps.id" 
                    check-strictly 
                    class="filter-tree"  
                    :default-expanded-keys="siteTreeCodeCheckDefault" 
                    :default-checked-keys="siteTreeCodeCheckDefault"
                    :data="siteTreeData"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    ref="tree3"
                    @check="handleCheckChange">
                </el-tree>
            </div>
        </div>
</template>

<script>
    import clickoutside from './clickoutside.js'
    export default {
        name: "select-tree-single",
        props: {
            siteTreeData: Array,
            defaultProps: Object,
            siteTreeCodes: [String, Number],
            siteName: String
        },
        model: {
            prop: 'siteTreeCodes',
            event: 'input'
        },
        computed: {
            siteTreeName() {
                if (this.siteTreeData.length > 0 && this.siteTreeCodes && this.defaultProps) {
                    let strName = '';
                    getArray(this.siteTreeData, this.siteTreeCodes, this.defaultProps.id, this.defaultProps.label, this.defaultProps.children);

                    function getArray(data, id, propsId, propsLabel, propsChildren) {
                        for (var i in data) {
                            if (data[i][propsId] == id) {
                                strName = data[i][propsLabel];
                                break;
                            } else {
                                getArray(data[i][propsChildren], id, propsId, propsLabel, propsChildren);
                            }
                        }
                    }

                    return strName ? strName : this.siteName;
                } else {
                    return '';
                }
            },
            siteTreeCodeCheckDefault() {
                return this.siteTreeCodes || this.siteTreeCodes === 0 ? [this.siteTreeCodes] : [];
            }
        },
        data() {
            return {
                filterText: '',
                showTreeFlag: false
            };
        },
        directives: {
            clickoutside
        },
        methods: {
            /**
             * @desc 隐藏下拉框
             */
            handleClose() {
                this.showTreeFlag = false;
                this.filterText = '';
            },
            /**
             * @desc 删除某一项
             * @param {*} item
             * @param {*} index
             */
            deleteItem(item, index) {
                this.$emit('input', '');
                this.$emit('change', '');
            },
            /**
             * @desc 节点树控件的节点过滤方法
             */
            filterNode: function (value, data, node) {
                if (!value) return true;
                var parent = node.parent;
                if (node.level !== 1 && parent && parent.visible) {
                    return true;
                }
                return data[this.defaultProps.label].indexOf(value) !== -1;
            },
            /**
             * @desc 节点树控件的change事件
             * @param {obj} node
             * @param {obj} checkStatus 树目前的选中状态对象
             */
            handleCheckChange(node, checkStatus) {
                var tt = checkStatus.checkedNodes; //this.$refs.tree3.getCheckedNodes();
                let id = node[this.defaultProps.id];
                if (tt.length == 1) {
                    this.$emit('input', id);
                    this.$emit('change', id, node);
                } else if (tt.length > 1) {
                    this.$emit('change', id, node);
                    this.$emit('input', id, node);
                    this.$refs.tree3.setCheckedKeys([id]);
                } else if (tt.length == 0) {
                    this.$emit('change', '');
                    this.$emit('input', '');
                }
            },
            /**
             * @desc 设置选中区域
             * @param {*} val
             */
            setCheckedKeys(val) {
                this.$refs.tree3.setCheckedKeys(val);
                this.$emit('input', val.join(','));
            },
            /**
             * @desc 点击采集地点输入框时
             */
            showTreeData: function () {
                this.showTreeFlag = true;
            },
            /**
             * @desc 清空输入框的值
             */
            clearFilterText() {
                this.filterText = '';
            }
        },
        mounted: function () {
        },
        watch: {
            /**
             * @desc 监听采集地点输入框的值的变化
             * @param {*} val
             */
            filterText(val) {
                if (this.$refs.tree3 == undefined) {
                } else {
                    this.$refs.tree3.filter(val);
                }
            },
            /**
             * @desc 监听选中的采集地点的变化
             * @param {*} val
             */
            siteTreeCodes(val) {
                if (!val) {
                    this.filterText = '';
                }
            }
        }
    }
</script>

<style scoped>

</style>