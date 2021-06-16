<!--
 * @Description: 出租登记详情
 * @Author: snoop-dog
 * @Date: 2021-05-26 01:20:32
 * @LastEditors: snoop-dog
 * @LastEditTime: 2021-06-15 23:25:36
 * @FilePath: \vue2-ts\src\views\rent\detail.vue
-->
<template>
  <el-container class="detail-container">
    <el-main class="detail-main">
      <el-container class="basic-info">
        <el-main class="basic-main">
          <el-header class="basic-title">房主信息</el-header>
          <el-main class="info-box">
            <table
              class="owner-table"
              cellpadding="0"
              cellspacing="0"
            >
              <tbody>
                <tr>
                  <th>
                    <span v-if="detailData.owners_type === 1">户主姓名：</span>
                    <span v-else>负责人姓名：</span>
                    <span>{{detailData.name}}</span>
                  </th>
                  <td>
                    <span>民族：</span>
                    <span>{{detailData.nationStr}}</span>
                  </td>
                  <td>
                    <span>户主类型：</span>
                    <span>{{detailData.owners_type_str}}</span>
                  </td>
                  <td>
                    <span>手机号：</span>
                    <span>{{detailData.phone}}</span>
                  </td>
                  <td>
                    <span>身份证：</span>
                    <span>{{detailData.idcard}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
            >
              <tbody>
                <tr class="second-line">
                  <td>
                    <span>性别：</span>
                    <span>{{detailData.sexStr}}</span>
                  </td>
                  <td>
                    <span>审核状态：</span>
                    <span>{{detailData.stateStr}}</span>
                  </td>
                  <td>
                    <span>公司名称：</span>
                    <span>{{detailData.companyName}}</span>
                  </td>
                  <td>
                    <span>营业执照：</span>
                    <span>{{detailData.businessLicense}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
            >
              <tbody>
                <tr class="third-line">
                  <td style="flex: 1">
                    <span>籍贯：</span>
                    <span v-if="detailData.owners_type === 1">{{detailData.address}}</span>
                  </td>
                  <td>
                    <span>详细地址：</span>
                    <span v-if="detailData.owners_type !== 1">{{detailData.address}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-main>
        </el-main>
      </el-container>

      <el-container class="basic-info" v-for="(item, index) in detailData.houses" :key="index">
        <el-main class="basic-main">
          <el-header class="basic-title">房屋信息</el-header>
          <el-main class="info-box">
            <table
              cellpadding="0"
              cellspacing="0"
            >
              <tbody>
                <tr>
                  <td>
                    <span>房屋类型：</span>
                    <span>{{item.housingNatureStr}}</span>
                  </td>
                  <td>
                    <span>使用类型：</span>
                    <span>{{item.planningPurposesStr}}</span>
                  </td>
                  <td>
                    <span>房屋面积：</span>
                    <span>{{item.constructionArea}}</span>
                  </td>
                  <td>
                    <span>审核状态：</span>
                    <span>{{item.stateStr}}</span>
                  </td>
                </tr>
                <tr class="second-line">
                  <td>
                    <span>省市区：</span>
                    <span>{{item.provinceStr}}{{item.cityStr}}{{item.areaStr}}</span>
                  </td>
                  <td>
                    <span>街道社区：</span>
                    <span>{{item.streetStr}}{{item.communityStr}}</span>
                  </td>
                </tr>
                <tr class="third-line">
                  <td>
                    <span>详细地址：</span>
                    <span>{{item.address}}</span>
                  </td>
                  <td>
                    <span>房产证编号：</span>
                    <span>{{item.premisesPermitNo}}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-main>
        </el-main>
      </el-container>

      <el-container class="tenant-list">
        <el-header class="tenant-title">
          租户信息
        </el-header>
        <el-table
          :data="detailData.houses[0].tenants"
          stripe
          empty-text="暂无数据"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="租户姓名"
            width="100">
          </el-table-column>
          <el-table-column
            prop="sexStr"
            label="性别"
            width="70">
          </el-table-column>
          <el-table-column
            prop="nationStr"
            label="民族"
            width="70">
          </el-table-column>
          <el-table-column
            prop="phone"
            show-overflow-tooltip
            label="手机号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="idcard"
            show-overflow-tooltip
            label="身份证"
            width="170">
          </el-table-column>
          <el-table-column
            prop="address"
            show-overflow-tooltip
            label="详细地址"
            width="100">
          </el-table-column>
          <el-table-column
            prop="stateStr"
            show-overflow-tooltip
            label="审核状态"
            width="100">
          </el-table-column>
          <el-table-column
            prop="start_time"
            show-overflow-tooltip
            label="承租起始时间"
            >
          </el-table-column>
          <el-table-column
            prop="end_time"
            show-overflow-tooltip
            label="承租结束时间"
            >
          </el-table-column>
        </el-table>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
// apis
import { getRegisterDetail, insertLog } from '@/apis/index'

export default {
  name: 'detail',
  data () {
    return {
      id: '', // 出租登记信息id
      type: '', // 查询类型
      detailData: null // 详情数据
    }
  },
  created () {
    console.log(this.$route)
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.getRegisterDetail()
  },
  activated () {
    console.log(this.$route)
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.getRegisterDetail()
  },
  methods: {
    /**
     * @description: 查询出租登记详情
     * @param {*} none
     * @returns {*} void
     */    
    getRegisterDetail () {
      const params = {
        id: this.id,
        type: this.type
      }

      getRegisterDetail(params).then(data => {
        console.log(data)
        this.detailData = data.data.homeowner

        insertLog({
          menu_name: '出租登记详情',
          operation_type: 'query',
          operation_condition: {
            ...params
          },
          sub_menu_name: '',
          operation_type_detail: '查询出租登记详情',
          source: 0
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}

.detail-container {
  width: 100%;
  height: 100%;
  background: #fff;
  .detail-main {
    flex: unset;
    width: 100%;
    height: auto;
    overflow-y: auto;
    margin: 1rem auto;
    padding: 4rem 15%;
    padding-top: 1rem;
    .basic-info {
      width: 100%;
      height: 30rem;
      background: url('../../assets/images/bg_basic_inf_blue.png') 0 0 no-repeat;
      background-size: 100% 100%;
      margin-bottom: 3rem;
      .basic-main {
        .basic-title {
          line-height: 60px;
          text-align: left;
          font-size: 1.4rem;
          color: #fa4;
        }
        .info-box {
          padding: 1rem 2rem;
          table {
            // border: 1px solid #ccc;
            width: 63rem;
            .second-line {
              display: flex;
              td {
                flex: 1;
                // width: calc(15.75rem - 1px);
              }
            }
            .third-line {
              display: flex;
              td {
                flex: 1;
                // width: calc(31.75rem - 4px);
              }
            }
            tr {
              display: flex;
              td {
                flex: 1;
              }
            }
            &.owner-table {
              tr {
                display: unset;
                th {
                  width: 31.5rem;
                  height: 8rem;
                  line-height: 8rem;
                  float: left;
                }
                td {
                  flex: unset;
                  width: calc(15.75rem - 1px);
                }
              }
            }
            th, td {
              border: 1px solid #ccc;
              // width: calc(15.75rem - 3px);
            }
            th {
              height: 6rem;
              line-height: 6rem;
              width: 31.5rem;
              font-size: 1.1rem;
            }
            td {
              height: 4rem;
              line-height: 4rem;
              float: left;
              font-size: 1rem;
              display: flex;
              padding: 0 0.5rem;
            }
          }
        }
      }
    }

    .tenant-list {
      width: 100%;
      .tenant-title {
        height: 2.66rem !important;
        line-height: 2.66rem;
        background: url('../../assets/images/bg_parts06.png') 0 0 no-repeat;
        color: #fff;
        background-size: contain;
        text-align: left;
        text-indent: 1em;
        font-size: 1.1rem;
      }
      .el-table {
        margin-top: 1rem;
        .cell {
          &.el-tooltip {
            width: auto !important;
          }
        }
      }
    }
  }
}
</style>
