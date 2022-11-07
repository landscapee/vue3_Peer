<template>
  <div class="v-card">
    <div>
      <button @click='goModel' class='v-icon'>
        <icon-svg iconClass="expand-arrows-alt" size="2px"/>
        <span class='tooltip'>近景</span>
      </button>
      <button @click='goHome' class='v-icon'>
        <icon-svg iconClass="compress-arrows-alt"/>
        <span class='tooltip'>远景</span>
      </button>
    </div>
    <div>
      <button id='layerS' class='v-icon'>
        <icon-svg iconClass="layer-group"/>
        <div class="layerList  ">
          <label v-for="(layer,idx) in providerNames" :key='idx' class="layerClass">
            <input type="radio" value="idx" name='basemap' @click='changeBasemap(layer)'
                   :checked='idx==0'>
            <span>{{ layer }}</span>
          </label>
        </div>
      </button>
      <button @click='start_cast' class='v-icon'>
        <icon-svg iconClass="tv"/>
        <span class='tooltip'>共享界面</span>
      </button>
      <button @click='show_database' class='v-icon'>
        <icon-svg iconClass="database"/>
        <span class='tooltip'>数据库</span>
      </button>
      <button @click='iShowPinSet' class='v-icon'>
        <icon-svg iconClass="map-marker"/>
        <span class='tooltip'>加标注</span>
      </button>
    </div>
    <div>
      <button @click='iShowForm = !iShowForm' class='v-icon'>
        <icon-svg iconClass="cog"/>
        <span class='tooltip'>控制面板</span>
      </button>
      <button @click='openEquipment' class='v-icon'>
        <icon-svg iconClass="clipboard"/>
        <span class='tooltip'>设备状态</span>
      </button>

    </div>
  </div>
  <DataBse ref="DataBse"></DataBse>
  <EquipmentList ref="EquipmentList"></EquipmentList>
</template>

<script>
import {ref, computed, onMounted, getCurrentInstance} from 'vue';
import {useStore} from 'vuex'
import { cgcs2wgs,wgs2cgcs } from '@/common/cesium/cgcs2wgs'
import Peer from "simple-peer";
import DataBse from './dataBase';
import EquipmentList from './equipmentList/equipmentList';

export default {
    name: 'ToolBar',
    data(){
        return {
            tableConfig:[
                {label: '设备', prop: 'Monitor',width:"30px"},
                {label: 'IP地址', prop: 'Monitor',width:"100px"},
                {label: '状态', prop: 'Monitor',width:"30px"},
                {label: '显示', prop: 'Monitor',width:"30px"},
            ],
        }
    },
  components:{
    DataBse,EquipmentList
  },
    setup(props, {emit}) {
      const providerNames = [
        'World Imagery',
        'OpenStreetMap',
      ]
      const _vue_instance__  =getCurrentInstance()
      const o_xy = [623820, 4531273];
      const o_lonlat = cgcs2wgs(o_xy);
      const goModel = () => {

        let o_lonlat=[103.87678531322403,30.659231957350197]
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(o_lonlat[0] , o_lonlat[1] , 2350),
          duration: 1,
          orientation: {
            heading : Cesium.Math.toRadians(-0.0), // 方向
            pitch : Cesium.Math.toRadians(-90.0),// 倾斜角度
            roll : 0
          }
        })
      };
      const goHome = () => {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(o_lonlat[0], o_lonlat[1], 10000000),
          duration: 1,
          orientation: {
            heading : Cesium.Math.toRadians(0.0), // 方向
            pitch : Cesium.Math.toRadians(-88.8),// 倾斜角度
            roll : 0
          }
        })
      };
      const changeBasemap = (providerName) => {
        console.log(providerName);
        const imageryProviders = {
          'World Imagery': new Cesium.UrlTemplateImageryProvider({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maximumLevel: 19,
            credit: '©Esri'
          }),
          'OpenStreetMap': new Cesium.UrlTemplateImageryProvider({
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            maximumLevel: 19,
            credit: '©OpenStreetMap'
          }),
        }
        viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
        let layer =viewer.imageryLayers.addImageryProvider(imageryProviders[providerName]);
        viewer.imageryLayers.lowerToBottom(layer); //Basemap always at bottom
      };
      // 屏幕共享
      let socket
      const start_cast = async () => {
        socket&&socket.close()
        let Peer = require('simple-peer')
          socket= new WebSocket('ws://192.168.0.85:3000?qq=wwww')
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: true
          })
          let peer = new Peer({initiator: true, stream: stream})
          peer.on('signal', function (data) {
            socket.send(JSON.stringify(data))
          });
          socket.addEventListener('message', (event) => {
            let data = JSON.parse(event.data)
            if( data.type &&data.type!='answer'){
              peer.signal(JSON.parse(data));
            }
          });
        } catch (e) {
          console.log(e)
        }

      };
      //添加标注
      const iShowPinSet=()=>{

      };
      const openEquipment = ()=>{
        _vue_instance__.refs.EquipmentList.open()
      }
      // 数据库
      function show_database(){
        _vue_instance__.refs.DataBse.open()
      }


      onMounted(()=>{

          changeBasemap('World Imagery')
          goModel()

      })
      return {
        providerNames,
        changeBasemap,
        goHome,
        goModel,
        start_cast,
        show_database,
        iShowPinSet,
        openEquipment,
      }

    },

}
</script>

 <style scoped lang="scss">
.v-card {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  background-color: rgb(245, 245, 245);
  height: 38px;
  width: auto;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  box-sizing: border-box;
  padding: 2px 5px;
  .layerClass {
    display: block;
    font-family: sans-serif;
    font-size: 15px;
    font-weight: 400;
    padding: 3px 3px;
  }
  .v-icon:hover  {
    .tooltip{
      visibility: visible;
    }
  }
  .v-icon {
    margin: 1px 3px;
    cursor: pointer;
    color: rgb(25, 145, 139);
    box-shadow: 0 1px 2px rgba(41, 21, 131, 0.8);
    border-radius: 3px;
    background-color: rgb(214, 214, 214);
    padding: 0px 1px;
    position: relative;
    .tooltip {
      visibility: hidden;
      color:#fff;
      background-color: rgba(30, 38, 44, 0.7);
      text-align: center;
      border-radius: 6px;
      font-size: 16px;
      width: 20px;
      position: absolute;
      z-index: 1;
      top: 100%;
      left: 50%;
      margin-left: -10px;
    }
  }
  button {
    margin: 1px 3px;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(41, 21, 131, .8);
    border-radius: 3px;
    background-color: #d6d6d6;
    padding: 0 1px;
    svg {
      fill: #19918b;
      vertical-align: top;
    }
  }
  .layerList {
    display: none;
    background-color: rgba(250, 250, 250, 0.8);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    position: absolute;
    width: 150px;
    text-align: left;
  }

  #layerS:hover .layerList {
    display: block;
  }
}

</style>
