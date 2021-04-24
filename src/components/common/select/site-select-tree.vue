<template>
  <div class="site-select-tree" v-clickoutside="handleClose">
    <div class="el-select__tags" :class="{'is-focus': inputFocus}" @click="showTree">
      <div class="tags" ref="tags" v-show="!treeBoxVisible && checkSitesInput.length !== 0">
        <el-tag
          v-for="(tag,index) in checkSitesInput"
          :key="index"
          closable
          @close="deleteItem(tag,index)"
        >{{tag[props.label]}}</el-tag>
      </div>
      <el-input
        v-show="treeBoxVisible || checkSitesInput.length === 0"
        ref="refInput"
        v-model="keyword"
        :placeholder="placeholder"
        autocompelete=off>
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          :class="{ disable: treeLoading}"
          @click="handleFilterNode"
        ></i>
      </el-input>
    </div>

    <div
      v-show="treeBoxVisible"
      class="site-tree-dropdown"
      v-loading="treeLoading"
      element-loading-text="数据加载中，稍后呈现"
      element-loading-spinner="el-icon-loading">
      <el-tree
        show-checkbox
        node-key="id"
        render-after-expand
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="value"
        class="filter-tree"
        :props="props"
        :data="siteTree"
        ref="tree"
        @node-click="handleNodeClick"
        @node-expand="handleNodeClick"
        @check="handleCheck">
        <span
          class="node-text-box"
          :class="{btn_more: data.type === 'more'}"
          slot-scope="{node, data}">
          <span>{{node.label}}</span>
          <span v-if="data.type === 'area' && !noSite">（{{data.childnum}} 条）</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import clickoutside from "./clickoutside"; 
// import {siteTreePageSize} from '../../../../config/index' // 页数
import { getSiteTreePage, getSiteListPage } from "@/apis/common-api/index"; // 获取场所
export default {
  name: "SiteSelectTree",
  props: {
    value: {
      type: Array
    },
    deviceTypes: [String, Number], // 设备类型
    siteTypes: [String, Number], // 场所类型
    noSite: Boolean, // 仅显示区，不显示场所
    mapFlag: {
      // 标识符(1:地图查询:过滤掉经纬度为空的数据,2:页面查询)
      type: [String, Number],
      default: 2
    },
    single: Boolean, // 单选时父级不可选 仅供单选场所时使用
    leaf: Boolean, // 只返回叶子节点的数据，不再对区级下全选时过滤
    // data: Array,
    props: {
      type: Object,
      default() {
        return {
          label: "name",
          isLeaf: "leaf"
        };
      }
    },
    placeholder: {
      type: String,
      default: "请输入场所名称"
    },
    sites: {
      type: Array,
      default() {
        return [];
      }
    },
    authTempType: {
      // 临时权限标识符(1:包含临时权限,2:不包含临时权限)
      type: [String, Number],
      default: "1"
    }
  },
  computed: {
    // 默认树展开以便加载
    defaultExpandedKeys() {
      let arr = [];
      this.siteTree.forEach(item => {
        arr.push(item.id);
        item.children.forEach(itemChild => {
          arr.push(itemChild.id);
        });
      });
      return arr;
    }
  },
  data() {
    return {
      siteTree: [],
      siteTreeAreaCode: [], // 区县级编号，用于增加叶子标识符
      keyword: "", // 树过滤
      cacheKeyword: "", // 树过滤缓存用，查询更多时应该用缓存key
      treeBoxVisible: false,
      inputFocus: false,
      pageSize: config.siteTreePageSize,
      checkedNodes: [], // 树组件中选中的节点，全部
      checkSitesInput: [], // 输入框中展示的节点 区下全部选择时展示区级名称，否则仅有场所名称
      treeLoading: true, // 下拉树加载
      loadResolve: null
    };
  },
  directives: {
    clickoutside
  },
  mounted() {
    this.checkSitesInput = this.sites.map(item => {
      !item.name && (item.name = item.sitename);
      !item.id && (item.id = item.sitecode);
      return item;
    });
    this.getSiteTree().then(data => {
      this.$nextTick(() => {
        // this.getCheckSitesInput()
      });
    });
  },
  methods: {
    /**
     * 获取案发地点关联场所列表
     */
    getSiteTree() {
      return new Promise(resolve => {
        this.treeLoading = true;
        this.siteTreeAreaCode = [];
        var params = {
          keyword: this.keyword,
          flag: this.mapFlag ,
          deviceTypes: this.deviceTypes || "",
          sitetypes: this.siteTypes || "",
          authTempType: this.authTempType 
        };
        var logParams = {
          operatecode: "006",
          url: "/basicservice/getSiteTreePage",
          menucode: "查询场所设置树",
          paramstr: JSON.stringify(params)
        };
        getSiteTreePage(params,logParams, res => {
          let data = res.data;
          this.treeLoading = false;
          if(data && data.length > 0) {
            this.siteTree = this.handleTreeData(data);
            let refTree = this.$refs.tree;
            this.$nextTick(() => {
              this.siteTreeAreaCode.map(item => {
                refTree.getNode(item).isLeaf = this.noSite;
              });
            });
            resolve(data);
            addLogData(logParams);
          }
        },fail=>{
          resolve([]);
          addLogData(logParams);
        })
      });
    },
    /**
     * 处理树数据，叶子节点无 children 字段处理
     * @param {*} data
     */
    handleTreeData(data) {
      data.map(item => {
        item.disabled = this.single; // 单选时父级不可选
         if (this.noSite && this.single) {
          item.disabled = false
        }
        if (item.children) {
          this.handleTreeData(item.children);
        } else {
          item.children = [];
          this.siteTreeAreaCode.push(item.id);
        }
      });
      return data;
    },
    /**
     * 获取案发地点关联场所列表
     * @param {*} pageIndex
     * @param {*} city_code
     */
    getSiteList(pageIndex, city_code) {
      return new Promise((resolve, reject) => {
        var params = {
          keyword: this.cacheKeyword,
          pageIndex,
          pageSize: this.pageSize,
          flag: this.mapFlag,
          city_code,
          deviceTypes: this.deviceTypes || "",
          sitetypes: this.siteTypes || "",
          authTempType: this.authTempType
        };
        var logParams = {
          operatecode: "006",
          url: "/basicservice/getSiteListPage",
          menucode: "查询场所设置树",
          paramstr: JSON.stringify(params)
        };
        getSiteListPage(params, logParams,res=>{
           resolve(res.data.data);
        },fail=>{

        })
      });
    },
    /**
     * 加载子树数据的方法 (废弃，不再用懒加载，采用动态添加的方法)
     * @param {*} item
     * @param {*} index
     */
    loadChildren(node, resolve) {
      if (node.level === 0) {
        this.loadResolve = resolve;
        this.getSiteTree().then(data => {
          return resolve(data);
        });

        // } else if (node.data.children && node.data.children instanceof Array) {
      } else if (node.data.type === "province" || node.data.type === "city") {
        // 省市级
        return resolve(node.data.children);
      } else if (node.data.type === "area") {
        // 区县级
        console.log(node);
        node.data.children = [];

        let pageCount = Math.ceil(node.data.childnum / this.pageSize);
        node.data.pageCount = pageCount;
        let pageIndex = 1;
        let city_code = node.data.id;

        let showMoreNode = {
          name: "更多...",
          id: city_code + "more",
          leaf: true,
          type: "more",
          pageIndex: pageIndex,
          pageCount: pageCount,
          parentid: city_code
        };
        this.getSiteList(pageIndex, city_code).then(data => {
          data.map(item => {
            item.name = item.sitename;
            item.id = item.sitecode;
            item.leaf = true;
            item.type = "site";
            item.parentid = city_code;
            return item;
          });
          data.push(showMoreNode);
          node.data.children = data;
          resolve(node.data.children);
          // return resolve([...node.data.list, showMoreNode]);
        });
      } else {
        return resolve([]);
      }
    },
    /**
     * 点击节点的回调方法
     * @param {*} data
     * @param {*} node
     * @param {*} VueComponent
     */
    handleNodeClick(data, node, VueComponent) {
      if (this.noSite) {
        return false;
      }
      console.log(data, node);
      if (data.type === "area" && !data.isFirstExpanded) {
        node.loading = true;
        data.isFirstExpanded = true; // 点击一次后
        let pageCount = Math.ceil(data.childnum / this.pageSize);
        data.pageCount = pageCount;
        data.hasMore = pageCount > 1; // 是否有更多按钮
        let pageIndex = 1;
        let city_code = data.id;

        // 更多按钮节点
        let showMoreNode = {
          name: "更多...",
          id: city_code + "more",
          leaf: true,
          disabled: true,
          type: "more",
          pageIndex: pageIndex,
          pageCount: pageCount,
          parentid: city_code
        };
        this.getSiteList(pageIndex, city_code).then(res => {
          res.map(item => {
            item.name = item.sitename;
            item.id = item.sitecode;
            item.leaf = true;
            item.type = "site";
            item.parentid = city_code;
            return item;
          });

          data.children = pageCount > 1 ? [...res, showMoreNode] : [...res];
          // return resolve([...node.data.list, showMoreNode]);
          node.expanded = true;
          node.loading = false;
          this.$nextTick(() => {
            if (node.checked) {
              // 如果父节点是选中状态则所有子节点也为选中状态
              this.$refs.tree.setChecked(data, true, true);
              pageCount > 1 &&
                this.$refs.tree.setChecked(data.id + "more", true, true);
            } else {
              this.$refs.tree.setCheckedKeys(this.value);
            }
          });
        });
      } else if (data.type === "more") {
        node.loading = true;
        data.name = "加载中";
        let pageIndex = data.pageIndex + 1;
        let city_code = data.parentid;
        this.getSiteList(pageIndex, city_code).then(res => {
          res.map(item => {
            item.name = item.sitename;
            item.id = item.sitecode;
            item.leaf = true;
            item.type = "site";
            item.parentid = city_code;
            // node.parent.data.children.push(item);
            this.$refs.tree.insertBefore(item, node);
            return item;
          });
          if (pageIndex >= data.pageCount) {
            // 全部加载完，删除更多
            this.$refs.tree.remove(node);
            node.parent.data.hasMore = false;
          } else {
            // 更新pageIndex
            data.pageIndex = pageIndex;
            node.loading = false;
            data.name = "更多...";
          }
          this.$nextTick(() => {
            if (node.parent.checked) {
              this.$refs.tree.setChecked(node.parent.data, true, true);
            } else {
              this.$refs.tree.setCheckedKeys(this.value);
            }
          });
        });
      }
    },
    /**
     * 手动更新树节点数据
     * @param {*} data
     */
    updateCheckedNodes(data) {
      this.checkSitesInput = data.map(item => {
        !item.name && (item.name = item.sitename);
        !item.id && (item.id = item.sitecode);
        return item;
      });
    },
    /**
     * @desc 删除某一项
     * @param {*} item
     * @param {*} index
     */
    deleteItem(item, index) {
      this.checkSitesInput.splice(index, 1);
      this.$refs.tree.setChecked(item.id, false, true);
      this.$refs.tree.setChecked(item.id + "more", false);
      // this.$refs.tree.setCheckedKeys(this.value);
    },
    /**
     * @desc 节点树控件的change事件
     * 当点击的是分页时自动展开当前页
     */
    handleCheck(data, indeterminate) {
      let node = this.$refs.tree.getNode(data);
      if (this.single) {
        this.getCheckSitesInputSingle(data, node);
      } else if (this.leaf || this.cacheKeyword) {
        // 单选模式下或有输入过滤条件时
        this.handleBtnMoreCheck(node); // 非单选模式下需处理更多按钮的选中状态
        this.getCheckSitesInputLeaf(); // 获取 checkSitesInput 过滤子节点
      } else {
        this.handleBtnMoreCheck(node); // 非单选模式下需处理更多按钮的选中状态
        this.getCheckSitesInput(); // 获取 checkSitesInput 过滤子节点
      }
    },
    /**
     * 处理点击节点下的更多按钮的选中状态
     * @param {*} node
     */
    handleBtnMoreCheck(node) {
      if (!node.isLeaf) {
        if (node.data.type !== "area") {
          node.childNodes.map(node => {
            this.handleBtnMoreCheck(node);
          });
        } else if (node.data.hasMore) {
          // 判断子节点是否全选
          let flag = !node.childNodes.some(childNode => {
            return !childNode.checked && childNode.data.type === "site";
          });
          this.$refs.tree.setChecked(node.data.id + "more", flag);
        }
      } else if (node.data.type === "site" && node.parent.data.hasMore) {
        // 点击场所节点，判断更多节点是否选中
        // 判断子节点是否全选
        let flag = !node.parent.childNodes.some(childNode => {
          return !childNode.checked && childNode.data.type === "site";
        });
        this.$refs.tree.setChecked(node.parent.data.id + "more", flag);
      }
    },
    /**
     * 输入框中展示的节点 区下全部选择时展示区级名称，否则仅有场所名称
     */
    getCheckSitesInput() {
      let nodes = (this.checkedNodes = this.$refs.tree.getCheckedNodes());
      console.log(nodes);

      let areaArr = [];
      let checkedFilter = nodes.filter(item => {
        if (item.type === "area") {
          areaArr.push(item);
          return true;
        } else if (
          item.type === "site" &&
          !areaArr.map(itemArea => itemArea.id).includes(item.parentid)
        ) {
          return true;
        }
        return false;
      });
      this.checkSitesInput = checkedFilter;
    },
    /**
     * 输入框中展示的节点 区下全部选择时仅展示场所 不选中 区级及以上
     */
    getCheckSitesInputLeaf() {
      let nodes = (this.checkedNodes = this.$refs.tree.getCheckedNodes());

      let checkedFilter = nodes.filter(item => item.type === "site");
      this.checkSitesInput = checkedFilter;
    },
    /**
     * 单选模式下需只选中一个节点
     * @param {*} data 节点数据
     * @param {*} node 节点node对象
     */
    getCheckSitesInputSingle(data, node) {
      this.$refs.tree.setCheckedNodes([node]);
      this.checkSitesInput = [data];
    },
    /**
     * @desc 节点树控件的节点过滤方法
     */
    handleFilterNode() {
      if (this.treeLoading) {
        return false;
      }
      this.cacheKeyword = this.keyword;
      this.siteTree = [];
      this.checkSitesInput = [];
      this.getSiteTree();
    },
    /**
     * @desc 点击采集地点输入框时
     */
    showTree() {
      this.treeBoxVisible = true;
      this.inputFocus = true;
      this.$nextTick(() => {
        this.$refs.refInput.focus();
      });
    },
    /**
     * @desc 重置
     */
    reset() {
      this.treeBoxVisible = false;
      this.inputFocus = false;
      this.keyword = "";
      this.siteTree = [];
      this.checkSitesInput = [];
      this.cacheKeyword = "";
      this.getSiteTree();
    },
    /**
     * @desc 隐藏下拉框
     */
    handleClose() {
      this.treeBoxVisible = false;
      // this.keyword = '';
      this.inputFocus = false;
    }
  },
  watch: {
    /***
     * 监听选中值的变化，触发 input 事件
     */
    checkSitesInput: {
      handler(val, oldValue) {
        if (val.length === 0 && this.value.length === 0) {
          return false;
        }

        let value = val.map(item => item["id"]);
        this.$emit("input", value);
        this.$emit("change", val);
      },
      deep: true
    },
    /**
     * 监听 value 变化
     */
    value(val, oldValue) {
      if (val.length === 0) {
        // 重置时
        if (oldValue.length > 0) {
          this.checkSitesInput = [];
          this.$refs.tree.setCheckedKeys([]);
        } else {
          // 避免死循环
          return false;
        }
      } else {
        val.map(item => {
          this.$refs.tree.setChecked(item, true, true);
        });

        // this.$refs.tree.setCheckedKeys(val);
      }
    },
    // 监听设备类型变化
    deviceTypes(val) {
      this.getSiteTree();
    },
    // 监听场所类型变化
    siteTypes(val) {
      this.getSiteTree();
    }
  }
};
</script>