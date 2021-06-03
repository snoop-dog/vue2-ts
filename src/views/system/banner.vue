<!--
 * @Description: banner图管理
 * @Author: snoop-dog
 * @Date: 2021-05-13 23:14:23
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-06-04 01:40:55
 * @FilePath: \vue2-ts\src\views\system\banner.vue
-->
<template>
  <el-container class="banner-container table-container">
    <el-row class="searchModel">
      <layout-search 
        v-show="false" 
        :search-param="searchParam" 
        :query-loading='queryLoading' 
        @query="searchList" 
      >
      </layout-search>

      <el-container class="searchModule">
        <el-main class="operate-btn">
          <el-upload
            class="upload-demo"
            action="#"
            :show-file-list="false"
            :http-request="uploadFile"
          >
            <el-button plain :loading="uploadLoading"><i class="el-icon-upload"></i>上传文件</el-button>
          </el-upload>
          <el-button plain @click.stop="createFolder"><i class="el-icon-folder-add"></i>新建文件夹</el-button>
          <el-button plain @click.stop="updateFoldname">重命名</el-button>
          <el-button type="danger" @click.stop="deleteFile"><i class="el-icon-delete"></i>删除</el-button>
        </el-main>
      </el-container>
    </el-row>

    <el-row class="tableModel">
      <layout-table
        hasSelect
        :hasIndex="false"
        :pagination="pagination"
        :ending-load="endingLoad"
        :data-list="dataList"
        :table-head="tableHead"
        :table-title="tableTitle"
        @selectionchange="selectChange"
        ref="multipleTable"
      >
        <div slot="name" slot-scope="props">
          <!-- <my-tooltip width="100%" :value="props.value"></my-tooltip> -->
          <el-col :span="2" class="img-box">
            <el-row :class="['img-container', { 'img' : props.value.type === 1 }]"></el-row>
          </el-col>
          <el-col @click.stop="enterFolder(props.value)" v-if="folderId !== props.value.id" :span="12">{{props.value.fileName}}</el-col>
          <el-col v-else :span="12" class="update-item">
            <el-input
              clearable
              v-model.trim="editFoldname"
            >
            </el-input>
            <em @click.stop="confirmUpdate" class="el-icon-check"></em>
            <em @click.stop="closeUpdate" class="el-icon-close"></em>
          </el-col>
        </div>
        <div slot="size" slot-scope="props">
          <my-tooltip width="100%" :value="props.value | nullTextFilter"></my-tooltip>
        </div>
        <div slot="create_time" slot-scope="props">
          <my-tooltip width="100%" :value="props.value  | nullTextFilter"></my-tooltip>
        </div>
      </layout-table>
    </el-row>
  </el-container>
</template>

<script>
// apis
import { 
  deleteBanner, 
  getBannerPage, 
  updateFolderName, 
  createFolderAndFile 
} from '@/apis/index'

// components
import layoutSearch from '../../components/common/layout/layout-search.vue'
import layoutTable from '../../components/common/layout/layout-table.vue'
import myTooltip from '@/components/common/layout/layout-tooltip.vue'

export default {
  name: 'banner',
  data () {
    return {
      dataList: [],
      queryLoading: false, // 查询loading
      searchParam: [ // 查询参数
        {
          label: '关键字：',
          type: 'input',
          property: 'keyword',
          keyword: '',
          placeholder: '请输入关键字'
        }
      ],
      endingLoad: true,
      pagination: { // 分页参数
        totalCount: 0,
        pageCount: 1,
        pageIndex: 1
      },
      tableHead: [ // 表头
        {
          name: '文件（夹）名',
          prop: 'name',
          value: 'name',
          showRow: true,
          width: 150
        },
        {
          name: '文件大小',
          prop: 'size',
          value: 'size'
        },
        {
          name: '创建时间',
          prop: 'create_time',
          value: 'create_time'
        }
      ],
      tableTitle: { // 表格title
        name: '全部文件'
      },
      propsParams: {}, // 初始参数
      size: 20, // 每页条数
      pid: 0, // 上级文件夹id
      uploadLoading: false, // 上传文件loading
      checkArray: [], // 选中文件夹和文件
      folderId: '', // 修改文件或文件夹id
      editFoldname: '' // 当前文件名
    }
  },
  components: {
    myTooltip,
    layoutSearch,
    layoutTable
  },
  methods: {
    /**
     * @description: 查询角色列表
     * @param {Object} param 查询参数
     * @param {Number} val 页码
     * @param {Number} size 每页条数
     * @returns {*} void
     */
    searchList (param, val, size) {
      this.propsParams = _.cloneDeep(param)
      this.size = size
      const params = {
        pid: this.pid,
        pageIndex: val,
        pageSize: size
      }

      this.queryLoading = true
      this.endingLoad = true

      getBannerPage(params).then(data => {
        const res = data.data
        this.dataList = _.cloneDeep(res.data)
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = data.data.totalPage
        this.pagination.totalCount = data.data.totalCount
        this.pagination.pageIndex = data.data.pageIndex
      }).catch(error => {
        console.log(error)
        this.dataList = []
        this.queryLoading = false
        this.endingLoad = false
        this.pagination.pageCount = 1
        this.pagination.totalCount = 0
        this.pagination.pageIndex = 1
      })
    },
    /**
     * @description: 新建文件夹
     * @param {*} none
     * @returns {*} void
     */    
    createFolder () {
      const object = {
        fileName: "'",
        id: '',
        type: 2
      }

      this.dataList.unshift(object)
    },
    /**
     * @description: 进入下级文件夹
     * @param {object} item 点击文件
     * @returns {*} void
     */    
    enterFolder (item) {
      if (item.type === 1) return
      this.pid = item.id
      this.searchList(this.propsParams, 1, this.size)
    },
    /**
     * @description: 上传文件
     * @param {object} param 文件参数
     * @returns {*} void
     */    
    uploadFile (param) {
      console.log(param)
      const formData = new FormData()
      formData.append('type', 1)
      formData.append('pid', this.pid)
      formData.append('fileName', param.file.name)
      formData.append('files', param.file)
      this.uploadLoading = true
      
      createFolderAndFile(formData).then(data => {
        console.log(data)
        this.uploadLoading = false
        this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
      })
    },
    /**
     * @description: 确认新建文件夹
     * @param {*} none
     * @returns {*} void
     */    
    confirmUpdate () {
      if (!this.editFoldname) {
        return this.showMessageBox('请输入文件夹名称！', 'warning')
      }

      const formData = new FormData()
      formData.append('type', 2)
      formData.append('pid', this.pid)
      formData.append('fileName', this.editFoldname)
      formData.append('files', '')

      createFolderAndFile(formData).then(data => {
        console.log(data)
        this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
      })
    },
    /**
     * @description: 关闭创建文件夹修改文件夹编辑项
     * @param {*} none
     * @returns {*} void
     */    
    closeUpdate () {
      this.dataList.splice(0, 1)
    },
    /**
     * @description: 列表选中回传事件
     * @param {array} val 选中数据
     * @returns {*} void
     */    
    selectChange (val) {
      this.checkArray = [...val]
    },
    /**
     * @description: 修改文件夹或文件名
     * @param {*} none
     * @returns {*} void
     */    
    updateFoldname () {
      if (!this.checkArray.length) {
        return this.showMessageBox('请选择1个文件夹或文件！', 'warning')
      } else if (this.checkArray.length > 1) {
        return this.showMessageBox('请选择1个文件夹或文件！', 'warning')
      }

      this.folderId = this.checkArray[0].id
      this.editFoldname = this.checkArray[0].fileName
    },
    /**
     * @description: 删除文件夹或文件
     * @param {*} none
     * @returns {*} void
     */    
    deleteFile () {
      if (!this.checkArray.length) {
        return this.showMessageBox('请至少选择1个文件夹或文件！', 'warning')
      }
      console.log(this.checkArray)
      const imgIds = this.checkArray.reduce((prev, cur) => {
        if (cur.type === 1) {
          prev.push(cur.id)
        }
        return prev
      }, [])

      const folderIds = this.checkArray.reduce((prev, cur) => {
        if (cur.type !== 1) {
          prev.push(cur.id)
        }
        return prev
      }, [])
      // deleteBanner
      const params = {
        folderIds: folderIds.join(','),
        imgIds: imgIds.join('.')
      }

      this.$confirm('是否删除选中文件夹或文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        deleteBanner(params).then(data => {
          if (data.status === 200) {
            this.showMessageBox(data.message, 'success')
            this.searchList(this.propsParams, this.pagination.pageIndex, this.size)
          } else {
            this.showMessageBox(data.message, 'error')
          }
        })
      }).catch(err => {
        console.log(err)
        this.showMessageBox('已取消！')
      })
    }
  },
  filters: {
    nullTextFilter (val) {
      return val || '--'
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-container {
  .searchModel {
    .searchModule {
      height: 4rem;
      width: 100%;
      background: #fff;
      border-radius: 0.7rem 0.7rem 0 0;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      .operate-btn {
        display: flex;
        padding: 0 2rem;
        align-items: flex-end;
        .upload-demo {
          margin-right: 0.7rem;
        }
        .el-button {
          // height: 2.66rem !important;
          // line-height: 2.66rem !important;
        }
      }
    }
  }
  /deep/.tableModel {
    margin-top: 0;
    border-radius: 0 0 0.7rem 0.7rem;
    .el-table {
      .cell {
        // line-height: 4rem;
      }
      td {
        padding: 0.75rem 0;
        height: 2rem;
        .img-box {
          width: 3rem;
          .img-container {
            height: 2rem;
            width: 2rem;
            background: url('../../assets/images/pan_folder.png') 0 0 no-repeat;
            background-size: contain;
            background-position: center;
            &.img {
              background: url('../../assets/images/pan_image.png') 0 0 no-repeat;
            }
          }
        }
        .el-col {
          .el-input__inner {
            height: 100%;
          }
          &.update-item {
            display: flex;
            align-items: center;
            em {
              width: 2rem;
              height: 2rem;
              font-size: 1.6rem;
              border: 2px solid #37e;
              color: #37e;
              border-radius: 0.2rem;
              line-height: 2rem;
              margin: 0 0.5rem;
            }
          }
        }
      }
    }
  }
}
</style>
