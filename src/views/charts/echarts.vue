<template>
  <el-container class="chart-container">
    <el-main class="chart-main">
      <el-row id="bar-charts" class="bar-chart"></el-row>
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

  // computed
  private get echartsUnit () {
    console.log(this.$store.state.echartsUnit)
    return this.$store.state.echartsUnit
  }

  private initOptions (): echartsOption {
    const option = {
      timeline: {
        data: [],
        show: false,
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
          type: 'dashed'
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
            left: '1%',
            right: '1%',
            bottom: '20%',
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
              type: 'shadow',
              shadowStyle: {
                shadowOffsetX: 0
              }
            }
          },
          xAxis: [
            {
              type: 'category',
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
              data: []
            }
          ],
          dataZoom: [
            {
              type: 'inside'
            }
          ],
          yAxis: [
            {
              type: 'value',
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
                show: false
              },
              axisTick: {
                show: false
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
              type: 'bar',
              barMinHeight: this.echartsUnit * 0.45,
              barMaxWidth: this.echartsUnit * 8,
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
              data: []
            }
          ]
        }
      ]
    }
    return option
  }

  created () {
    this.barChart = echarts.init(document.querySelector('#bar-chart'))
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
    .bar-chart {
      flex: 1;
    }
  }
}
</style>
