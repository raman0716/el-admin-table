<template>
  <div class="el_admin_table">
    <el-form ref="searchForm"
             :inline="true"
             size="small"
             :model="formData"
             v-on="$listeners"
             v-if="hasSearch"
             @submit.native.prevent>
      <slot name="search"></slot>
      <el-form-item v-if="hasSearchBtn">
        <el-button type="primary"
                   @click="goSearch">
          {{searchBtnTxt}}
        </el-button>
        <el-button @click="reset">
          {{resetBtnTxt}}
        </el-button>
      </el-form-item>
      <slot name="right-btns" />
    </el-form>

    <div v-loading="loading">
      <slot name="top-content" />

      <el-table :data="tableData"
                v-on="$listeners"
                size="small"
                @selection-change="selectChange"
                :class="{'last_key':chooseOne}"
                ref="elTable"
                v-bind="tableAttrsMirror">
        <template v-if="tableAttrs.columns && tableAttrs.columns.length>0">
          <el-table-column type="selection"
                           v-for="(column, columnIndex) in tableAttrs.columns.filter((c, i) => c.type === 'selection')"
                           :key="`selection-${columnIndex}`" />
        </template>

        <template v-if="tableAttrs.columns && tableAttrs.columns.length>0">
          <el-table-column v-for="(column, columnIndex) in tableAttrs.columns.filter((c, i) => c.type === 'index')"
                           :key="`index-${columnIndex}`"
                           :label="column.label || indexTxt"
                           type="index"
                           :index="typeIndex"
                           v-bind="column.col" />
        </template>

        <template v-if="tableAttrs.columns && tableAttrs.columns.length>0">
          <el-table-column v-for="(column, columnIndex) in tableAttrs.columns.filter((c, i) => (c.type !== 'selection'&&c.type !== 'operation' && c.type !== 'index'))"
                           :key="`col-${columnIndex}`"
                           :label="column.label"
                           v-bind="column.col"
                           :render="column.render">
            <template slot-scope="scope">
              <renderExpand v-if="column.render"
                            :row="scope.row"
                            :render="column.render" />
              <span v-else-if="column.formatter">{{ column.formatter(scope.row) }}</span>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>
        </template>

        <template v-if="tableAttrs.columns && tableAttrs.columns.length>0">
          <el-table-column v-for="(column, columnIndex) in tableAttrs.columns.filter((c, i) => c.type === 'operation')"
                           :key="`operation-${columnIndex}`"
                           :label="operationTxt"
                           v-bind="column.col">
            <template slot-scope="scope">
              <renderButton v-for="(item, i ) in column.btns"
                            :key="i"
                            :data="item"
                            :row="scope.row" />
            </template>
          </el-table-column>
        </template>
        <div slot="empty">
          <slot name="empty">
            {{emptyTxt}}
          </slot>
        </div>
      </el-table>
      <div class="pager">
        <el-pagination :current-page="pager.currentPage"
                       @current-change="currentChange"
                       @size-change="sizeChange"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="totalNum"
                       v-bind="pagerAttrsMirror"
                       v-on="$listeners" />
      </div>
    </div>
  </div>
</template>
<script>
import renderButton from "./render-button.vue";
import renderExpand from "./render-expand";
import { Table, TableColumn, Button, Pagination } from "element-ui";

export default {
  name: "el-admin-table",
  components: {
    renderButton,
    renderExpand,
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-pagination": Pagination
  },
  inheritAttrs: false,
  props: {
    searchBtnTxt: {
      type: String,
      default: "查询"
    },
    resetBtnTxt: {
      type: String,
      default: "重置"
    },
    indexTxt: {
      type: String,
      default: "序号"
    },
    operationTxt: {
      type: String,
      default: "操作"
    },
    emptyTxt: {
      type: String,
      default: "暂无数据"
    },
    /**
     * 开启选择框单选时，emit 最后一个选择 selectUnique.sync 接收
     * when el-table selection prop is enabled, selectUnique.sync will receive the last choice
     */
    selectUnique: {
      type: Object
    },
    /**
     * 用于显示总条数
     * sometimes we need to get the total amount after a success request, totalCount.sync prop will receive the number
     */
    totalCount: {
      type: Number,
      default: 0
    },
    /**
     * API函数 给个参数位置 apiFn(param)
     * 在父组件中调用可以用 apiFn(params) => otherFn(params, args)
     API function (param)
     complicated use e.g.
     */
    apiFn: {
      type: Function
    },
    /**
     * 分页插件配置
     * el-pagination config
     */
    pagerAttrs: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * 不用渲染form的时候用的参数条件，任意参数为空，将不发请求，需要手动
     * some static params without rendering a form
     * [ Warning: an empty key-value will stop the request ]
     */
    customQuery: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * 表格配置项
     * el-table props accepted
     */
    tableAttrs: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * 表单
     * alias el-form model
     */
    formData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * 表格列表需要自己组装的数据结构
     * when http-response brings you a complicated Object, you can use this functional prop format the response
     */
    filterOut: {
      type: Function
    },
    /**
     * 是否需要查询按钮
     * whether you need search buttons
     */
    hasSearchBtn: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    chooseOne() {
      return this.selectUnique !== undefined;
    },
    hasSearch() {
      return Object.keys(this.formData).length > 0;
    },
    pagerAttrsMirror() {
      return {
        ...this.defaultPager,
        ...this.pagerAttrs
      };
    },
    tableAttrsMirror() {
      let json = {};
      for (let x in this.tableAttrs) {
        if (x && x !== "column") {
          json.x = this.tableAttrs.x;
        }
      }
      return json;
    }
  },
  data() {
    return {
      formDataOrigin: null,
      totalNum: 0,
      loading: false,
      tableData: [],
      /**
       * 默认分页的配置项目，pagerAttrsMirror 的方式可以覆盖
       * initialize the pagination config, pagerAttrsMirror will overwrite this
       */
      defaultPager: {
        "page-sizes": [5, 10, 20, 50],
        "page-size": 10
      },
      pager: {
        currentPage: 1
      }
    };
  },
  methods: {
    selectChange(val) {
      if (!this.chooseOne) return;
      let res = [];
      if (val.length > 1) {
        res = val.pop();
        this.clearSelection();
        this.$refs.elTable.toggleRowSelection(res, true);
        return;
      }
      this.$emit("update:selectUnique", val[0] || {});
    },
    clearSelection() {
      this.$refs.elTable.clearSelection();
    },
    typeIndex(index) {
      return index + (this.pager.currentPage - 1) * this.defaultPager["page-size"] + 1;
    },
    goSearch() {
      this.pager.currentPage = 1;
      this.getList();
      this.$emit("goSearch");
    },
    reset() {
      this.pager.currentPage = 1;
      /**
       * 置空 formDataOrigin
       * reset formDataOrigin
       */
      for (let i in this.formDataOrigin) {
        this.formDataOrigin[i] = "";
      }
      this.$emit("update:formData", this.formDataOrigin);
      this.$emit("reset");
      this.$nextTick(() => {
        this.getList();
      });
    },
    toggleRowSelection(row, expanded) {
      this.$refs.elTable.toggleRowSelection(row, expanded);
    },
    currentChange(val) {
      this.pager.currentPage = val;
      this.getList();
    },
    async getList() {
      let t = Object.values(this.customQuery).some(e => !e);
      if (t) {
        console.warn("customQuery有部分参数为空, customQuery has at least one empty prop");
        return;
      }
      try {
        const params = {
          ...this.formData,
          ...this.customQuery,
          page: this.pager.currentPage,
          size: this.pagerAttrsMirror["page-size"]
        };
        this.loading = true;
        if (!this.apiFn) {
          setTimeout(() => {
            this.loading = false;
          }, 200);
          return console.warn("apiFn 为空, apiFn is not available");
        }

        const { totalCount, data, payload } = await this.apiFn(params);
        let res = payload || data || [];
        if (this.filterOut) {
          this.tableData = this.filterOut(res);
        } else {
          this.tableData = res;
        }
        this.totalNum = totalCount || this.tableData.length || 0;
        this.$emit("getTableData", res);
        this.$emit("update:totalCount", totalCount || this.tableData.length || 0);
        this.loading = false;
        return Promise.resolve();
      } catch (e) {
        console.warn(e);
        this.loading = false;
      }
    },
    sizeChange(val) {
      this.defaultPager["page-size"] = val;
      this.$emit("update:pagerAttrs", {
        ...this.pagerAttrs,
        "page-size": val
      });
      this.pager.currentPage = 1;
      this.$nextTick(() => {
        this.getList();
      });
    }
  },
  created() {
    this.formDataOrigin = Object.assign({}, this.formData);
  },
  beforeMount() {
    this.getList();
  }
};
</script>
<style lang="scss">
.el_admin_table {
  .el-form--inline {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .el-form-item {
    height: 40px;
    margin-bottom: 10px;
  }
  .pager {
    text-align: right;
    margin-top: 20px;
  }
  .last_key {
    /deep/ {
      .el-table__header {
        .el-checkbox {
          display: none;
        }
      }
    }
  }
}
</style>
