<template>
  <div id="cesiumContainer"></div>

  <ToolBar v-if="mounted" ref="ToolBar1"></ToolBar>
</template>

<script>
import ToolBar from './ToolBar'
import { ref,reactive, getCurrentInstance,onMounted } from 'vue';
import {useStore} from 'vuex'
import coreLib from '@/common/core'

export default {
  name: 'CesiumMap',
  components: {
    ToolBar
  },
  setup () {

    let mounted=ref(false)
    window.viewer=null
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMWJlMDk2My0xN2Y1LTQ5NTAtODg4OS01MDc1OTQ4NTQyNjIiLCJpZCI6ODY1OSwic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIl0sImFzc2V0cyI6WzFdLCJpYXQiOjE1NTI0NjIyMjl9.QPT92mutlw-Pjr-FTGhVq4svbkRzXvkKkk8u-Ev1BfE";
    Cesium.Ion.defaultAccessToken = token;
    const terrain = new Cesium.CesiumTerrainProvider({
      url:'http://localhost:809/terrain/'
    })
    let options = {
      baseLayerPicker: false,
      geocoder: false,
      imageryProvider: false,
      homeButton: false,
      navigationHelpButton: false,
      infoBox: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      //terrainProvider: new Cesium.EllipsoidTerrainProvider({}), // no terrain
      terrainProvider:terrain ,
      //terrainExaggeration: 1,
      skyBox: false,    // remove star, sun, moon
      //skyAtmosphere: false, // turn off atmosphere
      automaticallyTrackDataSourceClocks: false, // not track clock in czml
      sceneModePicker: false,
      scene3DOnly: true,

      //requestRenderMode : true
    }
    let group= []
    let locationString=ref('')
    function regMouseEvent() {
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (event) {
        if (event) {
          let pick = viewer.scene.pickPosition(event.endPosition);
          if (Cesium.defined(pick)) {
            let x = pick.x,
                y = pick.y,
                z = pick.z;
            let ellipsoid = viewer.scene.globe.ellipsoid;
            let cartesian3 = new Cesium.Cartesian3(x, y, z);
            let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
             locationString.value =
                "位置:" +
                lng.toFixed(6) +
                "," +
                lat.toFixed(6) +
                "," +
                cartographic.height.toFixed(1) +
                "";
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction(function () {
        let height = Math.ceil(viewer.camera.positionCartographic.height);
         coreLib.Theme.publishTheme(
             coreLib.themeType.MapHeightViewChanged,
            height
        );
        window.mapHeight = height;
      }, Cesium.ScreenSpaceEventType.WHEEL);
      handler.setInputAction(function (event) {
        let pick = viewer.scene.pickPosition(event.position);
        console.log('left',Cesium.defined(pick));
        if (Cesium.defined(pick)) {
          let x = pick.x,
              y = pick.y,
              z = pick.z;
          let ellipsoid = viewer.scene.globe.ellipsoid;
          let cartesian3 = new Cesium.Cartesian3(x, y, z);
          let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          let msg = lng + " " + lat + ",";
          console.log(msg);
           group.push([lng, lat]);
           coreLib.Theme.publishTheme( coreLib.themeType.MapClick, [
            lng,
            lat,
            cartographic.height,
            event.position,
            {
              direction: viewer.camera.direction,
              position: viewer.camera.position,
              right: viewer.camera.right,
              up: viewer.camera.up
            }
          ]);
          let obj = viewer.scene.pick(event.position);
          if (obj) {
            let entity = obj.id;
            if (entity) {
               coreLib.Theme.publishTheme(
                  coreLib.themeType.FeatureClick,
                  [entity, [lng, lat, cartographic.height], event.position]
              );
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.setInputAction(function (event) {
        let pick = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(pick)) {
          let x = pick.x,
              y = pick.y,
              z = pick.z;
          let ellipsoid = viewer.scene.globe.ellipsoid;
          let cartesian3 = new Cesium.Cartesian3(x, y, z);
          let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          console.log(
              "[" + lng + "," + lat + "," + cartographic.height + "]",
              "[" + cartesian3.x + "," + cartesian3.y + "]"
          );
          coreLib.Theme.publishTheme( coreLib.themeType.MapRightClicked, [
            lng,
            lat,
            cartographic.height,
            event.position,
            {
              direction: viewer.camera.direction,
              position: viewer.camera.position,
              right: viewer.camera.right,
              up: viewer.camera.up
            }
          ]);
          let obj = viewer.scene.pick(event.position);
          if (obj) {
            let entity = obj.id;
            if (entity) {
               coreLib.Theme.publishTheme(
                  coreLib.themeType.FeatureClick,
                  [entity, [lng, lat, cartographic.height], event.position]
              );
            }
          }
        }
        let p = 'POLYGON((';
        if(group.length){
          group.forEach(g => {
            p += g[0] + " " + g[1] + ","
          });

          p +=  group[0][0] + " " +  group[0][1] + " ))";
          console.log(p);
          group.length = 0;
        }

      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    onMounted (() => {
      window.viewer = new Cesium.Viewer('cesiumContainer', options)
      viewer._cesiumWidget._creditContainer.style.display = "none"
       viewer.scene.light = new Cesium.DirectionalLight({
        direction: new Cesium.Cartesian3(0.354925916, -0.8909182691839, -0.283358839)
      })
      viewer.scene.debugShowFramesPerSecond = false;
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1;
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 59000000;
      viewer.scene.fog.enabled = false;
      viewer.scene.fxaa = true;
      viewer.scene.requestRender();
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 140;
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 59000000;
      viewer.resolutionScale = 1;
      viewer.scene.postProcessStages.fxaa.enabled = false;
      viewer.scene.globe.depthTestAgainstTerrain = true; //影响军标绘制  倾斜摄影模型加载
      viewer.automaticallyTrackDataSourceClocks = false; //如果设置为true，将自动跟踪新添加数据源的时钟设置，如果数据源的时钟变更，则更新。如需单独设置时钟，请将此项设置为false。
      viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0.5);
      viewer._cesiumWidget._creditContainer.style.display = "none"; //取消版权信息

      mounted.value=true
      regMouseEvent()

    })

    return {
      mounted
    }
  },
  methods:{

  },
  mounted(){
  },
}
</script>

 <style scoped lang="scss">
#cesiumContainer {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  height: 100%;
  width: 100%;
}





</style>
