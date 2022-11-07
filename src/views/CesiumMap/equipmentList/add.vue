<template>
  <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="false"
      :title="title"
      :center="true"
      :before-close="close"
      v-model="showDia">

    <el-form ref="ruleFormRef" :model="form" :rules="rules"
             label-width="80px" class="demo-ruleForm" size="small" status-icon>
      <div class="divItem">
        <el-form-item label="设备名称：" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="设别编号：" prop="code">
          <el-input v-model="form.code"/>
        </el-form-item>
      </div>
      <div class="divItem">
        <el-form-item label="经度：" prop="lon">
          <el-input v-model="form.lon"/>
          <el-button @click="selectPosition" type="primary">定位</el-button>
        </el-form-item>
        <el-form-item label="纬度：" prop="lat">
          <el-input v-model="form.lat"/>
        </el-form-item>
      </div>
      <div class="divItem">
        <el-form-item label="设备类型：" prop="type">
          <el-input v-model="form.type"/>
        </el-form-item>

      </div>


      <div class="footer">
        <el-button @click="close">取消</el-button>

        <el-button type="primary" @click="submitForm('ruleFormRef')">确认</el-button>
      </div>
    </el-form>

  </el-dialog>
</template>

<script>
import coreLib from '@/common/core'
import {map}from 'lodash'
export default {
  name: "add",
  data() {
    return {
      showDia: true,
      title: '设备新增',
      form: {},
      rules: {
        name:[{ required: true, message: '请输入', trigger: 'blur' }]
      },
      isAdd: true,
      currentPosition:{},
    }
  },

  methods: {
    async submitForm(form) {
     await this.$refs[form].validate((isValid) => {
        if (isValid) {
          let data = {...this.form}
          let url = '/apioet/equipment/updateEquipment';
          if (this.isAdd) {
            url = '/apioet/equipment/addEquipment'
          }
          this.$axios.post(url, data).then((d) => {
            this.$message.success('操作成功！')
          })
        }
      })
    },
    selectPosition(){
      console.log('ddd');
      this.displayAllDialog('none')
      let {lon, lat, mapView} = this.form
      if (lat && lon) {
        this.addPointIcon(lon,lat)
        if (mapView) {
          coreLib.flyToByView(JSON.parse(mapView))
          return
        }
        coreLib.flyTo(lon, lat, 2000)
      }
    },
    close() {
      this.form = {}
      this.isAdd=true
      this.showDia = false
      this.$refs.ruleFormRef.clearValidate()
       coreLib.Theme.unSubscribeTheme( coreLib.themeType.MapClick, this.updatePosition)
       coreLib.Theme.unSubscribeTheme( coreLib.themeType.MapRightClicked, this.confirmPosition)

    },
    open(row) {
      console.log(222,row);
      this.showDia = true

      this.title = '设备新增'
      if (row) {
        this.isAdd = false
        this.title = '设备编辑'
        this.form = {...row}
      }
      coreLib.Theme.subscribeTheme( coreLib.themeType.MapClick, this.updatePosition)
       coreLib.Theme.subscribeTheme( coreLib.themeType.MapRightClicked, this.confirmPosition)

    },
    updatePosition(data){
      let [lon,lat]=data
      this.addPointIcon(lon,lat)
    },
    confirmPosition(data){
      let {lon, lat,id} = this.currentPosition
      let [,,,,mapView]=data
      this.$set(this.form, 'lon', (+lon).toFixed(6))
      this.$set(this.form, 'lat', (+lat).toFixed(6))
      this.$set(this.form, 'mapView', JSON.stringify(mapView))

      this.displayAllDialog('inline')
      if (id) {
        this.currentPosition.id=''
        coreLib.FeatureManager.removeFeature(id)
      }
    },
    displayAllDialog(val) {
      let dia = document.getElementsByClassName('el-overlay')
      map(dia, ele => {
        ele.style.display = val
      })

    },
    addPointIcon(lon, lat){
      if (this.currentPosition.id) {
         coreLib.FeatureManager.removeFeature(this.currentPosition.id)
      }
      let {id} =  coreLib.FeatureManager.addPointIcon({
        lon, lat, scale: 0.15,
      })
      this.currentPosition={id,lon, lat}
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
.el-dialog {
  width: 550px !important;
  .el-input{
    width: 170px!important;
  }
}
</style>