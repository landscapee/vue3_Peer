<template>
  <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="false"
      :append-to-body="true"
      title="频谱"
      :center="true"
      :before-close="close"
      v-model="showDia">
    <div id="chart__Freq"
         v-loading="loading"
         element-loading-text="数据加载中。。。"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)"></div>
    <template v-if="configshow">
      <div class="formContent">
        <div class="item">
          中心频率:
          <el-input size="small" v-model="formSend.centerFreq">
            <template #suffix>
              MHz
            </template>
          </el-input>
        </div>
        <div class="item">
          门限:
          <el-input size="small" v-model="formSend.refLevel">
            <template #suffix>
              dBμV
            </template>
          </el-input>
        </div>
        <div class="item">
          带宽:
          <el-input size="small" v-model="formSend.rbw">
            <template #suffix>
              MHz
            </template>
          </el-input>
        </div>
        <div class="item">
          跨距:
          <el-input size="small" v-model="formSend.span">
            <template #suffix>
              MHz
            </template>
          </el-input>
        </div>
        <div class="item">
          <el-button @click="startFreq" type="primary" size="small">开始</el-button>
          <el-button :disabled="!playStatus" @click="stopFreq" type="primary" size="small">暂停</el-button>
        </div>
      </div>

      <div class="formContent">
        <div class="item"> 点击图表获取</div>
        <div class="item">
          频率:
          <el-input size="small" v-model="form.pl">
            <template #suffix>
              MHz
            </template>
          </el-input>

        </div>

        <div class="item">
          带宽:
          <el-input size="small" v-model="form.dk">
            <template #suffix>
              MHz
            </template>
          </el-input>
        </div>
        <div class="item">
          电平:
          <el-input size="small" v-model="form.dp">
            <template #suffix>
              dBμV
            </template>
          </el-input>
        </div>
      </div>
    </template>


  </el-dialog>
</template>

<script>
import {map} from 'lodash'
import {ElMessage} from "element-plus";

export default {
  name: "frequencySpectrum",

  data() {
    return {
      playStatus: false,
      code: null,
      loading: false,
      configshow: true,
      chart: undefined,
      formSend: {
        centerFreq: 84.45,
        refLevel: -30,
        rbw: 0.01,
        span: 40
      },
      form: {
        pl: 0,
        dk: 0,
        dp: 0
      },
      showDia: true
    };
  },
  methods: {
    close() {
      window.addEventListener('UI__EquipmentMessage'+this.code, this.getData)

      this.code=null
      this.loading = false;
      this.playStatus = false
      this.showDia = false
      this.stopFreq()
      this.chart&&this.chart.destroy()
      this.form = {
        pl: 0,
        dk: 0,
        dp: 0
      };
      this.formSend={
        centerFreq: 84.45,
            refLevel: -30,
            rbw: 0.01,
            span: 40
      }

    },
    stopFreq() {
      this.loading=false;
      this.playStatus=false
      this.$sendMessage('worker__sengMessage',{
        code:this.code,
        data:{
        requestType: "stop",
        param: {}
      }})
    },
    startFreq() {
      this.playStatus = true
      this.loading = true
      let obj = {}
      let blo
      map(this.formSend, (val, key) => {
        if (Number(val) != val) {
          blo = true
        }
        obj[key] = Number(val) * Math.pow(10, 6)
        if (key == 'refLevel') {
          obj[key] = Number(val)
        }
      })
      if (blo) {
        ElMessage({
          message: '请输入正确的参数',
          type: 'warning',
          duration: 3 * 1000,
        })
        return
      }
      let {centerFreq, refLevel, rbw, span} = obj
      this.$sendMessage('worker__sengMessage', {
        code:this.code ||'A',
        data:{
          requestType: "start",
          param: {
            centerFreq, refLevel, rbw, span
          }
        }
      })

    },
    open({code}) {
      this.code = code
      this.showDia = true
      window.removeEventListener('UI__EquipmentMessage'+code,  this.getData)
    },
    showData(data) {
      if (undefined == this.chart) {
        this.initGraphic(data);
      } else {
        this.chart.series[0].update({
          data: data.datas
        });
      }
    },
    onclickmy(x, y) {
      console.log(2, x, y);
      this.form = {
        pl: x.toFixed(3),
        dk: this.formSend.rbw,
        dp: y.toFixed(3)
      }
    },
    async initGraphic(data) {
      if (!document.getElementById('chart__Freq')) {
        return
      }
      let {freqs: [start, end], datas, step} = data
      this.form.start = start
      this.form.end = end
      let start1 = (start / 1000000).toFixed(3);
      let end1 = (end / 1000000).toFixed(3);
      let step1 = (step / 1000000).toFixed(3);
      this.chart = Highcharts.chart('chart__Freq', {
        chart: {
          zoomType: "x",
          backgroundColor: "rgba(0,0,0,1)"
        },
        exporting: {enabled: false},
        boost: {
          useGPUTranslations: true
        },
        title: {
          text: `起始频率:${start1}MHz,终止频率:${end1}MHz`,
          style: {color: "rgb(255,255,255)"}
        },
        subtitle: {
          text: "",
          style: {color: "rgb(255,255,255)"}
        },
        xAxis: {
          title: {
            text: "频率",
            style: {color: "rgb(255,255,255)"}
          },
          labels: {
            style: {
              color: '#ffffff',
            },
          },
        },
        yAxis: {
          // min:-200,
          // max:200,
          title: {
            text: "电平值",
            style: {color: "rgb(255,255,255)"}
          },
          labels: {
            style: {
              color: '#ffffff',
            },
          },
        },
        legend: {
          enabled: false
        },

        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            color: "rgb(255,255,0)",
            pointStart: +start1,
            pointInterval: +step1
          }
        },
        tooltip: {
          valueDecimals: 2,

          backgroundColor: "rgba(247,247,247,1)", //将提示框的透明度拿掉，默认是0.85
          crosshairs: [
            {
              width: 1,
              color: "green"
            }
          ],
          shared: true,
          formatter: function () {
            var s = `<b style="font-size: 12px;font-weight: bold">频率:</b>
                ${(this.x / 1000000).toFixed(3)}MHz</br>
                 <b style="font-size: 12px;font-weight: bold">电平值:</b>${this.y}`
            return s;
          }
        },
        series: [
          {
            data: datas,
            lineWidth: 0.5,
            events: {
              click: (event) => {
                let index = event.point.category;
                this.onclickmy(event.point.x, event.point.y);
              }
            }
          }
        ]
      });
    },
    getData({detail}) {
      if (detail) {
        this.loading = false
        this.showData(detail)
      }
    }
  },


};
</script>

<style scoped lang="scss">
.el-dialog {
  width: 80%;
  box-sizing: border-box;

  #chart__Freq {
    background: #2a2a2b;
    height: 400px;
    width: calc(100% - 0px);
  }

  .formContent {
    padding-bottom: 10px;
    margin-top: 8px;
    height: 12px;
    display: flex;
    justify-content: center;

    .item {
      float: left;
      margin-right: 15px;
      margin-left: 4px;
      height: 30px;
      line-height: 30px;
      color: #fff;

      /deep/ .el-input {
        width: 100px;
        margin-left: 4px;
      }
    }
  }
}


</style>
