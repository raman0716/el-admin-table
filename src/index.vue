<template>
  <div class="el_admin_table">
    <el-form
      ref="searchForm"
      :inline="true"
      size="small"
      :model="formData"
      v-on="$listeners"
      v-if="hasSearch"
      @submit.native.prevent
    >
      <slot name="search"></slot>
      <el-form-item v-if="hasSearchBtn">
        <el-button type="primary" @click="goSearch">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
      <slot name="right-btns"></slot>
    </el-form>

    <div v-loading="loading">
      <slot name="top-content" />

      <el-table
        :data="tableData"
        v-on="$listeners"
        size="small"
        @selection-change="selectChange"
        :class="{ last_key: chooseOne }"
        ref="elTable"
        v-bind="tableAttrsMirror"
      >
        <template v-if="tableAttrs.columns && tableAttrs.columns.length > 0">
          <el-table-column
            type="selection"
            v-for="(column, columnIndex) in tableAttrs.columns.filter((c, i) => c.type === 'selection')"
            :key="`selection-${columnIndex}`"
          />
        </template>

        <template v-if="tableAttrs.columns && tableAttrs.columns.length > 0">
          <el-table-column
            v-for="(column, columnIndex) in tableAttrs.columns.filter((c, i) => c.type === 'index')"
            :key="`index-${columnIndex}`"
            :label="column.label || '序号'"
            type="index"
            :index="typeIndex"
            v-bind="column.col"
          />

          <el-table-column
            v-for="(column, columnIndex) in tableAttrs.columns.filter(
              (c, i) => c.type !== 'selection' && c.type !== 'operation' && c.type !== 'index'
            )"
            :key="`col-${columnIndex}`"
            :label="column.label"
            v-bind="column.col"
            :render="column.render"
          >
            <template slot-scope="scope">
              <renderExpand v-if="column.render" :row="scope.row" :render="column.render" />
              <span v-else-if="column.formatter">{{ column.formatter(scope.row) }}</span>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-for="(column, columnIndex) in tableAttrs.columns.filter((c, i) => c.type === 'operation')"
            :key="`operation-${columnIndex}`"
            label="操作"
            v-bind="column.col"
          >
            <template slot-scope="scope">
              <renderButton v-for="(item, i) in column.btns" :key="i" :data="item" :row="scope.row" />
            </template>
          </el-table-column>
        </template>
        <div slot="empty">
          <slot name="empty">
            暂无数据
          </slot>
        </div>
      </el-table>
      <div class="pager">
        <el-pagination
          v-if="hasPager"
          :current-page="pager.currentPage"
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          v-bind="pagerAttrsMirror"
          v-on="$listeners"
        />
      </div>
    </div>
  </div>
</template>
<script>
import renderButton from "./render-button.vue";
import renderExpand from "./render-expand";

export default {
  name: "el-admin-table",
  components: { renderButton, renderExpand },
  inheritAttrs: false,
  props: {
    // 开启选择框单选时，emit 最后一个选择
    selectUnique: {
      type: Object
    },
    // 用于显示总条数
    totalCount: {
      type: Number,
      default: 0
    },
    // API函数 给个参数位置 apiFn(param)
    apiFn: {
      type: Function
    },
    // 分页插件配置
    pagerAttrs: {
      type: Object,
      default: () => {
        return {};
      }
    },
    hasPager: {
      type: Boolean,
      default: true
    },
    // 不用渲染form的时候用的筛选条件
    customQuery: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 表格配置项
    tableAttrs: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 表单
    formData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 表格列表需要自己组装的数据结构
    filterOut: {
      type: Function
    },
    // 是否需要查询按钮
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
      console: console,
      formDataOrigin: null,
      totalNum: 0,
      loading: false,
      tableData: [],
      // 默认分页的配置项目，mirror的方式可以覆盖
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
    isSelect(rows) {
      if (rows) {
        this.$nextTick(() => {
          rows.forEach(row => {
            this.$refs.elTable.toggleRowSelection(row, true);
          });
        });
      } else {
        this.$refs.elTable.clearSelection();
      }
    },
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
    toggleSelection(rows, toSelect) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.elTable.toggleRowSelection(row, toSelect);
        });
      } else {
        this.$refs.elTable.clearSelection();
      }
    },
    toggleRowSelection(row, toSelect) {
      this.$refs.elTable.toggleRowSelection(row, toSelect);
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
      // 置空formDataOrigin
      for (let i in this.formDataOrigin) {
        this.formDataOrigin[i] = "";
      }
      this.$emit("update:formData", this.formDataOrigin);
      this.$emit("reset");
      this.$nextTick(() => {
        this.getList();
      });
    },
    currentChange(val) {
      this.pager.currentPage = val;
      this.getList();
    },
    async getList() {
      let t = Object.values(this.customQuery).some(e => !e);
      if (t) {
        console.warn("customQuery有部分参数为空");
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
        this.tableData = [];
        this.$emit("update:totalCount", 0);
        if (!this.apiFn) {
          setTimeout(() => {
            this.loading = false;
          }, 200);
          return console.warn("apiFn 为空");
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
        this.$emit("getListDone");
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
