<template>
  <div class="el_admin_table">
    <el-form ref="searchForm"
             :inline="true"
             size="small"
             :model="formData"
             v-on="$listeners"
             v-if="hasSearch">
      <slot name="search"></slot>
      <el-form-item>
        <el-button type="primary"
                   @click="goSearch">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <slot name="top-content" />

    <el-table v-loading="loading"
              :data="tableData"
              v-on="$listeners"
              size="small"
              v-bind="tableAttrsMirror">
      <template v-if="tableAttrs.columns && tableAttrs.columns.length>0">
        <el-table-column type="selection"
                         v-for="(column, columnIndex) in tableAttrs.columns.filter((c, i) => c.type === 'selection')"
                         :key="`selection-${columnIndex}`" />
      </template>
      <template v-if="tableAttrs.columns && tableAttrs.columns.length>0">
        <el-table-column v-for="(column, columnIndex) in tableAttrs.columns.filter((c, i) => (c.type !== 'selection'&&c.type !== 'operation'))"
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
                         label="操作"
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
          暂无数据
        </slot>
      </div>
    </el-table>
    <div class="pager">
      <el-pagination :current-page="pager.currentPage"
                     @current-change="currentChange"
                     :page-sizes="[5, 10, 20, 50]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalNum"
                     v-bind="pagerAttrs"
                     v-on="$listeners" />
    </div>
  </div>
</template>
<script>
import renderButton from "./render-button";
import renderExpand from "./render-expand";
export default {
  name: "el-admin-table",
  components: { renderButton, renderExpand },
  inheritAttrs: false,
  props: {
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
    pageSize: {
      type: Number,
      default: 10
    },
    // 表格配置项
    tableAttrs: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 不用渲染form的时候用的筛选条件
    customQuery: {
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
    }
  },
  computed: {
    hasSearch() {
      return Object.keys(this.formData).length > 0;
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
      pager: {
        currentPage: 1
      }
    };
  },
  methods: {
    goSearch() {
      this.pager.currentPage = 1;
      this.getList();
      this.$emit("goSearch");
    },
    reset() {
      this.pager.currentPage = 1;
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
      try {
        const params = {
          ...this.formData,
          ...this.customQuery,
          ...this.pager,
          pageSize: this.pageSize
        };
        this.loading = true;
        if (!this.apiFn) {
          setTimeout(() => {
            this.loading = false;
          }, 200);
          return console.warn("apiFn 为空");
        }
        const { data } = await this.apiFn(params);
        this.tableData = data;
        this.totalNum = data.total;
        this.loading = false;
      } catch (e) {
        console.warn(e);
      }
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
}
</style>
