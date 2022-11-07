<template>
  <div v-if=" showPage" class="equipmentBox">
    <div class="title" @click="getList">
      设备管理
    </div>
    <div class="optionBox">
      <el-button @click="addEdit(null)" type="primary" size="small">添加设备</el-button>
    </div>
    <div class="tableBox">
      <!--                input元素是 copy功能需要的-->
      <input type="text" ref="input__copy" style="width: 1px;height:1px;position:absolute;background: transparent;border:none;" >
      <my-table :data="getTableData" :table-config="tableConfig">
        <template v-slot:position>
          <el-table-column label="位置"  width="55"   align="center">
            <template #default="{row,$index}">
              <div class="option">
                <icon-svg @click="toPosition(row)" title="定位" icon-class="position"></icon-svg>
                <icon-svg @click="copy(row)" title="复制坐标" icon-class="copy"></icon-svg>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:status>
          <el-table-column label="设备状态"   align="center">
            <template #default="{row,$index}">
              <div class="cell_status_equi">
                <span :style="{background:getStatusColor(row.status)}"></span>
                {{getStatusVal(row.status)}}
              </div>

            </template>
          </el-table-column>
        </template>
        <template v-slot:equipmentManage>
          <el-table-column label="设备管理"   align="center">
            <template #default="{row,$index}">
              <div class="option">
                <icon-svg @click="online(row)" title="上线" icon-class="online"></icon-svg>
                <icon-svg @click="offline(row)" title="下线" icon-class="offline"></icon-svg>
                <icon-svg @click="restart(row)" title="重启" icon-class="restart"></icon-svg>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:option>
          <el-table-column label="操作" width="70" fixed="right" align="center">
            <template #default="{row,$index}">
            <div class="option">
              <icon-svg @click="addEdit(row)" title="编辑" icon-class="edit"></icon-svg>
              <icon-svg @click="deleteRow(row)" title="删除" icon-class="remove"></icon-svg>
            </div>
            </template>
          </el-table-column>
        </template>

      </my-table>
    </div>
    <Add__equipment ref="Add__equipment"></Add__equipment>
<!--    <FrequencySpectrum ref="FrequencySpectrum"></FrequencySpectrum>-->
  </div>

</template>

<script>
import Request from '@/lib/axios'
import {equipmentConfig} from "../tableConfig"
import FrequencySpectrum from '@/components/FrequencySpectrum'
import Add__equipment from'./add';
import coreLib from '@/common/core'
export default {
  name: "equipmentList",
  components:{
    FrequencySpectrum,Add__equipment
  },
  data() {
    return {
      tableConfig: equipmentConfig(),
      showPage: true,
    }
  },
  computed: {
    getTableData(){
      return this.$store.state.globalData.equipmentList
    },
    getStatusVal(){
      return (status)=>{
        let statusMap={
          0:'离线',
          1:'故障',
          2:'在线',
        }
        return statusMap[status]
      }
    },
    getStatusColor(){
      return (status)=>{
        let colorMap={
          0:'#f82206',
          1:'#f18d1b',
          2:'#0889e5',
        }
        return colorMap[status]
      }
    }
  },
  methods: {
    addEdit(row){
      this.$refs.Add__equipment.open(row)
    },
    deleteRow({id,status}){
      if(status==2){
        this.$message.warning('此设备为在线状态，请下线后再删除')
        return
      }
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.getData.post('/apioet/equipment/deleteEquipment?id='+id).then((data) => {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    online({code}){
      this.$sendMessage('worker__sengMessage',[{code}])
    },
    offline(row){

    },
    restart(row){

    },
    toPosition({lat,lon}){
      // this.$refs.FrequencySpectrum.open(null,row.code)
      if(lat&&lon){
         coreLib?.flyTo(lon,lat,3000)
      }
    },
    copy({lat,lon}){

      let input=this.$refs.input__copy
      input.value=lon+','+lat;
      let range = document.createRange();
      range.selectNode(input);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      input.value=''
      // window.getSelection().removeAllRanges();
     },
    open() {
      this.showPage = !this.showPage

    },
    getList() {

    },

  },
  created() {

  },
  mounted() {
    this.getList()
    window.dispatchEvent(new CustomEvent('myWorker__',{
      detail:{
        type:'worker__initEquipmentsSocket',
        aaa:1
      }
    }))

  }

}
</script>

<style lang="scss" scoped>

.equipmentBox {
  width: 50%;
  height: 400px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  z-index: 1;
  background-color: rgba(30, 38, 44, 0.83);
  border-radius: 5px;
  overflow: hidden;
  .title {
      text-align: center;
    font-size: 14px ;
    color: #fff;
    padding: 9px 0;
    background: rgba(30, 38, 44, 1);
  }

  .optionBox {
    text-align: right;
    padding: 5px 10px 0 0;
  }

  .tableBox {
    padding: 7px 10px;

    height: calc(100% - 78px);
  }
}
.cell_status_equi{
  span{
    $whPX:10px;
    display: inline-block;
    width: $whPX;
    height: $whPX;
    border-radius: 50%;
  }
}
</style>