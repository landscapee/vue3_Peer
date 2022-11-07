<template>
  <div v-if="  showPage" class="dataBaseBox">
    <div class="title">
      数据库操作
    </div>
    <div class="optionBox">
      <el-button @click="exportExcel" type="primary" size="small">导出</el-button>
    </div>
    <div class="tableBox">
      <my-table :data="data" :table-config="tableConfig">
        <template v-slot:option>
          <el-table-column label="操作" fixed="right" align="center">
            <template #default="{row,$index}">
              <span>sfsdfsdf</span>
            </template>
          </el-table-column>
        </template>

      </my-table>
    </div>


  </div>

</template>

<script>
import Request from '@/lib/axios'
import {dataBaseConfig} from "./tableConfig"

export default {
  name: "dataBase",
  data() {
    return {
      tableConfig: dataBaseConfig(),
      data: [
        {prop: 'qq', id: 'wwww', Monitor: 'wwww1'},

      ],
      showPage: false,
    }
  },
  methods: {
    open() {
      this.showPage = !this.showPage
    },
    async exportExcel() {
    }
  },
  mounted() {

  }

}
</script>

<style lang="scss" scoped>

.dataBaseBox {
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
    font-size: 14px;
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
</style>