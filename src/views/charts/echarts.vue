<template>
  <el-container class="chart-container">
    <el-main class="chart-main">
      <el-container class="top-chart">
        <el-row id="bar-charts" ref="barChart" class="bar-chart"></el-row>
        <el-row id="pie-charts" ref="pieChart" class="pie-chart"></el-row>
      </el-container>
      <el-container class="bottom-chart">
        <el-row id="line-charts" ref="lineChart" class="line-chart"></el-row>
        <el-row id="ring-charts" ref="ringChart" class="ring-chart"></el-row>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { echartsOption } from '../../utils/interface'
import echarts from 'echarts'

@Component
export default class Chart extends Vue {
  private barChart = null
  private pieChart = null
  private lineChart = null
  private ringChart = null

  // computed
  private get echartsUnit () {
    return this.$store.state.echartsUnit
  }

  private initOptions (): echartsOption {
    const option = {
      timeline: {
        data: [0, 1, 2, 3],
        show: true,
        symbolSize: this.echartsUnit,
        currentIndex: 0,
        label: {
          formatter: (s) => {
            return `第${s + 1}页`
          },
          fontSize: this.echartsUnit,
          color: '#666'
        },
        symbol: 'diamond',
        lineStyle: {
          color: '#ccc',
          type: ('dashed' as 'dashed')
        },
        autoPlay: true,
        playInterval: 4000,
        tooltip: {
          formatter: (s) => {
            return `第${s.value + 1}页`
          }
        },
        emphasis: {
          itemStyle: {
            color: '#78e'
          }
        },
        itemStyle: {
          color: '#9aa7f7'
        },
        controlStyle: {
          itemSize: this.echartsUnit * 1.5,
          color: '#9aa7f7'
        },
        checkpointStyle: {
          color: '#78e',
          symbolSize: this.echartsUnit,
          borderColor: 'rgba(120, 135, 240, 0.5)'
        }
      },
      options: [
        {
          grid: {
            top: '8%',
            left: '3%',
            right: '3%',
            bottom: '15%',
            containLabel: true
          },
          tooltip: {
            backgroundColor: 'rgba(18, 28, 68, 0.8)',
            trigger: 'axis',
            textStyle: {
              color: '#abd'
            },
            extraCssText: '#203060',
            axisPointer: {
              type: ('shadow' as 'shadow'),
              shadowStyle: {
                shadowOffsetX: 0
              }
            }
          },
          xAxis: [
            {
              type: ('category' as 'category'),
              axisLine: {
                // 坐标轴轴线相关设置。数学上的x轴
                show: true,
                lineStyle: {
                  color: '#cccccc'
                }
              },
              axisLabel: {
                // 坐标轴刻度标签的相关设置
                rotate: 0,
                textStyle: {
                  color: '',
                  // margin: 15,
                  fontSize: this.echartsUnit
                },
                interval: 0
              },
              axisTick: {
                show: false
              },
              data: ['湖北', '湖南', '广东', '广西', '北京', '云南', '四川', '重庆']
            }
          ],
          dataZoom: [
            {
              type: ('inside' as 'inside')
            }
          ],
          yAxis: [
            {
              type: ('value' as 'value'),
              min: 0,
              // max: 140,
              splitNumber: 7,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#cccccc'
                }
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#cccccc'
                }
              },
              axisTick: {
                show: true
              },
              axisLabel: {
                margin: this.echartsUnit * 1.6,
                textStyle: {
                  color: '#666'
                }
              }
            }
          ],
          series: [
            {
              name: '',
              type: ('bar' as 'bar'),
              barMinHeight: this.echartsUnit * 0.45,
              barMaxWidth: this.echartsUnit * 3,
              // barCategoryGap: '4%',
              label: {
                normal: {
                  show: true,
                  fontSize: this.echartsUnit * 1.1,
                  // fontWeight: 'bold',
                  color: '#666',
                  position: 'top'
                }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(154,167,247,1)' },
                    { offset: 0.2, color: 'rgba(119,136,238,0.8)' },
                    { offset: 1, color: 'rgba(119,136,238,1)' }
                  ])
                }
              },
              data: [23, 354, 678, 443, 205, 122, 330, 79]
            }
          ]
        }
      ]
    }
    return option
  }

  created () {
    window.addEventListener('resize', () => {
      this.barChart.resize()
      this.pieChart.resize()
      this.lineChart.resize()
      this.ringChart.resize()
    })
  }

  mounted () {
    this.$nextTick(() => {
      this.barChart = echarts.init(document.querySelector('#bar-charts'))
      this.pieChart = echarts.init(document.querySelector('#pie-charts'))
      this.lineChart = echarts.init(document.querySelector('#line-charts'))
      this.ringChart = echarts.init(document.querySelector('#ring-charts'))
      this.barChart.setOption(this.initOptions())
      this.pieChart.setOption(this.initOptions())
      this.lineChart.setOption(this.initOptions())
      this.ringChart.setOption(this.initOptions())
      setTimeout(() => {
        this.barChart.resize()
        this.pieChart.resize()
        this.lineChart.resize()
        this.ringChart.resize()
      }, 500)
    })
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .chart-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: stretch;
    overflow-y: hidden;
    .el-container {
      display: flex;
      width: 100%;
      height: 50%;
      .el-row {
        flex: 1;
        // padding: 1rem;
      }
    }
  }
}
</style>
