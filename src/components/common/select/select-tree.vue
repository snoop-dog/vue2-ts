

<!--树形select框组件-->
<template>
    <div class="sitebox form-sitebox" v-clickoutside="handleClose">
        <div class="Collection_site el-select" @click.stop="showTreeData">
            <div v-if="siteTreeNamesArray.length > 0 && !showTreeFlag" class="el-select__tags">
                    <span>
                        <span v-for = "(item,index) in siteTreeNamesArray" :key="index" class="el-tag el-tag--primary">
                            <span class="el-select__tags-text">{{item}}</span>
                            <i class="el-tag__close el-icon-close" @click.stop="deleteItem(item,index)"></i>
                        </span>
                    </span>
            </div>
            <input v-else style="min-width:20px;right:0px;" autocompelete=off :placeholder="placeholder"  class="el-select__input is-undefined"
                   debounce="0" v-model="filterText">
        </div>

        <div v-if="showTreeFlag" class="sitetree" @click.stop>
            <el-tree show-checkbox :node-key="defaultProps.id" :default-expanded-keys="expandedKeys ? expandedKeys : siteTreeCodes" :default-checked-keys="siteTreeCodes" class="filter-tree"
                     :data="siteTreeData" :props="defaultProps" :filter-node-method="filterNode" ref="tree2"
                     @check="handleCheckChange">
            </el-tree>
        </div>
    </div>
</template>

<script>
    import clickoutside from './clickoutside.js'
    export default {
        name: "select-tree",
        props: {
            parentid: Boolean,
            siteTreeData: Array,
            defaultProps: Object,
            placeholder: {
               type: String,
               default: '请输入关键字'
            },
            expandedKeys: Array,
            siteTreeCodes: [Array, String],
            isLeaf:{ //选中最高父级，只输出父级，否则输出子集。
                type: Boolean,
               default: false
            }
        },
        model: {
            prop: 'siteTreeCodes',
            event: 'input'
        },
        computed: {
            siteTreeNamesArray() {
                if (this.siteTreeData.length > 0  &&  typeof(this.siteTreeCodes) == 'object'  && this.siteTreeCodes.length > 0 && this.defaultProps) {
                    let ary = [];
                    this.siteTreeCodes.map((item, index) => {
                        getArray(this.siteTreeData, item, this.defaultProps.id, this.defaultProps.label, this.defaultProps.children)
                    })

                    function getArray(data, id, propsId, propsLabel, propsChildren) {
                        for (var i in data) {
                            if (data[i][propsId] == id) {
                                ary.push(data[i][propsLabel]);
                                break;
                            } else {
                                getArray(data[i][propsChildren], id, propsId, propsLabel, propsChildren);
                            }
                        }
                    }
                    return ary
                } else {
                    return []
                }
            }
        },
        data(){
            return {
                filterText: "",
                showTreeFlag: false,
                checkedArr:[]
            }
        },
        // directives: {
        //     clickoutside
        // },
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
                let ary = this.siteTreeCodes;
                ary.splice(index, 1);
                this.$emit("input", ary);
                this.$emit('change',ary)
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
             */
            handleCheckChange: function (data, indeterminate) {
                if(this.isLeaf){
                    var valueAry = [];
                    var parantAry = this.siteTreeData.map(item=>item[this.defaultProps.id])
                    var tt = indeterminate.checkedNodes;
                    tt.map(item=>{
                        valueAry.push(item[this.defaultProps.id])
                    })
                    var checkParant = []
                    valueAry.map((m,n)=>{
                        parantAry.map(k=>{
                            if(m == k ){
                                checkParant.push(m)
                            }
                        })
                    })
                    // 过滤已经选中省的子集
                    var isSpliceAry = []
                    checkParant.map(k=>{
                        valueAry.map((item,index)=>{
                            if(k != item && item.indexOf(k.substring(0,2)) !=-1){
                                isSpliceAry.push(item)
                            }
                        })
                    })
                    let new_arr = valueAry.filter((x) => !isSpliceAry.some((item) => x=== item));
                    this.$emit('change',new_arr)
                    this.$emit("input", new_arr)
                }else {
                    var tt = this.parentid ? this.$refs.tree2.getCheckedNodes() : this.$refs.tree2.getCheckedNodes(true);
                    var valueAry = [];
                    tt.map((item, index) => {
                        valueAry.push(item[this.defaultProps.id]);
                    });
                    this.$emit('change',valueAry)
                    this.$emit("input", valueAry)
                }
            },
            /**
             * @desc 点击采集地点输入框时
             */
            showTreeData: function () {
                this.showTreeFlag = true;
                if(this.siteTreeData.length==0){//用于布控告警设置页面
                    this.$emit("nodata")
                }
            },

        },
        watch: {
            /**
             * @desc 监听采集地点输入框的值的变化
             * @param {*} val
             */
            filterText(val) {
                if (this.$refs.tree2 == undefined) {

                } else {
                    this.$refs.tree2.filter(val);
                }
            },
            /**
             * @desc 监听选中的采集地点的变化
             * @param {*} val
             */
            siteTreeCodes(val,old) {
                // console.log(val,old)
                this.$emit('value',val)
                if (val.length == 0) {
                    this.filterText = "";
                }
            }
        },
        mounted(){
            // console.log(clickoutside)
        }
    }
</script>

<style scoped  lang="scss">

</style>