<template>

  <el-table :span-method="spanMethod" class="mainTable"
            :height="400"
            :highlight-current-row="true"
            :show-header="showHeader=='false'?false:true"
            :data="(data||[]) instanceof Array ? data : data.records" ref="table"
            :row-key="getRowKeys"
            @current-change="currentRowChange"
            tooltip-effect="dark"
            style="width: 100%"
            border>
    <template v-for="(colConfig, index) in tableConfig">
      <slot v-if="colConfig.slot" :name="colConfig.slot"></slot>
      <el-table-column v-else-if="colConfig.type=='index'" type="index" :fixed="colConfig.fixed" v-bind="colConfig"
                       :key="index"
                       :width="colConfig.width"
                       :reserve-selection="true">
        <template #default="{row,$index}">
          {{ getIndex($index) }}
        </template>
      </el-table-column>
      <el-table-column v-else :show-overflow-tooltip="true" v-bind="colConfig" :key="index+'q'"
                       :fixed="colConfig.fixed"
                       :width="colConfig.width"
                       :prop="colConfig.prop"
                       :reserve-selection="true">
        <template #default="{row,$index}">
          {{ getTableRowCol(row,$index,colConfig) }}
        </template>
      </el-table-column>
    </template>
  </el-table>
  <div class="tablepage">
    <el-pagination v-if="data&&data.current" background @size-change="handleSizeChange"
                   @current-change="handleCurrentChange" :current-page="data.current"
                   :page-sizes="[1, 15, 20, 50, 100]" :page-size="data.size"
                   layout="total, sizes, prev, pager, next, jumper" :total="data.total"></el-pagination>
  </div>

</template>
<script>

export default {

  name: 'SearchTable',
  props: ['tableConfig', 'data', 'spanMethod', 'showHeader'],
  data() {
    return {

      resizeCallback: [],
      updateWidth: false,
      timer: null,
    };
  },
  computed: {
    getIndex() {
      return (index) => {
        let blo = this.data instanceof Array;
        if (blo) {
          return +index + 1
        } else {
          let {current, size, records} = data
          return (current - 1) * size + +index + 1
        }
      }
    },
    getTableRowCol() {
      return (row,index,config) => {
          if(config.format){
              return config.format(row,index)
          }else{
              return row[config.prop]
          }
      }
    }
  },
  watch: {

    data: {
      handler(n) {
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          if (this.$refs.table && this.$refs.table.doLayout) {
            this.$refs.table.doLayout();
          }
        }, 100);
      },
      immediate: true,
    },
  },


  unmounted() {

  },
  mounted() {


  },
  methods: {


    doLayout() {
      this.$refs.table.doLayout();
    },

    // 确定唯一的key值
    getRowKeys(row) {
      return row.id; // 每条数据的唯一识别值
    },
    handleSizeChange(size) {
      this.size = size;
      this.$emit('handleSizeChange', size);
    },
    handleCurrentChange(cur) {
      this.$emit('handleCurrentChange', cur);
    },
    currentRowChange(row, oldRow) {
      // 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性
      this.$emit('currentRowChange', row, oldRow);
    },


  },


};
</script>

<style lang="scss" scoped>
$borderColor: rgba(232, 226, 226, 0.47);


/deep/ .option {
  display: flex;
  justify-content: space-around;
  height: 100%;
  align-items: center;


}

.el-table:before,
.el-table::after,
.el-table:after {
  background-color: $borderColor;
}

.el-table {
  border-color: $borderColor !important;
  height: 100% !important;
  background: rgba(30, 38, 44, 0.7) !important;

  /deep/ .el-table__inner-wrapper:before,
  /deep/ .el-table__inner-wrapper::after {
    background: $borderColor !important;

  }

  /deep/ .el-table__inner-wrapper {
    height: 100%!important;
    .el-table__fixed-right::before,
    .el-table__fixed::before {
      background-color: rgba(232, 226, 226, 0);
    }

    .el-table__fixed-right,
    .el-table__fixed {
      background-color: transparent !important;
      //background: #5279aa !important;
    }

    .el-table__expanded-cell {
      background-color: transparent !important;
    }

    .el-table__header {
      tr,
      th {
        background: transparent !important;
        //background: rgba(2, 10, 21, 0.4) !important;
      }
    }

    .el-table__border-right-patch,
    .el-table__border-left-patch {
      background: $borderColor !important;

    }

    .el-table__row,
    td, th {
      background: transparent !important;
      color: #fff !important;
      padding: 0 !important;
      border-color: $borderColor !important;
      $height: 25px;

      .cell {
        height: $height;
        line-height: $height;
        padding: 0 4px !important;
        svg {
          $WHpx:18px;
          width: $WHpx;
          height: $WHpx;
          fill: #ffffff;
          background: none;
        }

        svg:hover {
          fill: #409EFF;
        }
      }
    }


    .hover-row > td {
      //background-color: #80b8f1 !important;
      background-color: rgba(128, 184, 241, 0.38) !important;
    }

    .current-row > td {
      background-color: #80b8f1;
    }


    .el-table__row:nth-child(even) {
      //background: #22718c!important;
    }

    .el-table__row:nth-child(odd) {
      //background: #FFFFFF!important;
    }
  }
}

.tablepage {
  margin-top: 15px;
  display: flex;
  justify-content: center;

  /deep/ .el-pagination__total,
  /deep/ .el-pagination__jump {
    color: #fff !important;
  }


}


</style>

