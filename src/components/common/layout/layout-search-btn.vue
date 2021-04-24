<template>
  <div class="searchBtnBox" ref="searchBtnBox">
    <el-col class="searchBtn">
      <el-col class="query primaryBtn" @click.native='clickQueryBtn'>
        <el-button :loading="queryLoading" >{{btnStr}}</el-button>
      </el-col>
      <el-col class="reset primaryBtn" @click.native="clickResetBtn">
        <el-button :loading="queryLoading">重置</el-button>
      </el-col>
    </el-col>
  </div>
</template>

<script>
export default {
  // name: 'search-btn',
  props: {
    buriedPoint: { // 埋点参数
      type: Object,
      default: () => {
        return {}
      }
    },
    queryLoading: {
      // 查询loading
      type: Boolean,
      default: false
    },
    redtypeArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    menuId: {
      type: String,
      default: ''
    }, // 埋点菜单id
    operationId: {
      type: String,
      default: '100'
    }, // 埋点操作id
    btnStr: {
      type: String,
      default: '查询'
    }
  },
  data () {
    return {
      
    }
  },
  computed: {
    buriedPointParam () {
      return this.buriedPoint || {}
    }
  },
  methods: {
    /**
     * 埋点参数处理
     */
    buriedPointClick () {
      if (JSON.stringify(this.buriedPointParam) === '{}') return
      const params = {
        menu_id: this.menuId ? this.menuId : this.$store.state.tagsView.menuId,
        user_id: this.$store.state.user.user.id,
        click_source: 0,
        operation_id: this.operationId, 
        operation_condition: JSON.stringify(this.buriedPointParam)
      }
      return params
    },
    /**
     * @description 点击查询时
     */
    clickQueryBtn () {
      // console.log(123)
      if (this.queryLoading) return
      this.$emit('querybtn')
    },
    /**
     * @description 点击重置时
     */
    clickResetBtn () {
      if (this.queryLoading) return
      this.$emit('resetbtn')
    }
  }
}
</script>

<style lang="scss" scoped>
.searchBtnBox {
  max-width: 13.33rem;
  height: 2.66rem;
  display: flex;
  margin-left: 1rem;
  flex-direction: column;
  justify-content: center;
  .searchBtn {
    .primaryBtn {
      height: 2rem;
      width: 6rem;
      line-height: 2rem;
      cursor: pointer;
      background: #78e;
      border-radius: 0.2rem;
      line-height: 2rem;
      text-align: center;
      margin-right: 0.4rem;
      font-size: 1rem;

      &:hover {
        background: #9aa7f7;
      }

      .el-button {
        border: none;
        height: 100%;
        width: 100%;
        background: #78e;
        font-size: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;

        &:hover {
          background: #9aa7f7;
          border: none;
        }
      }
    }
  }
}
</style>
