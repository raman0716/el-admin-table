### 基本说明
- 可以使用el-table/el-pagination/el-form的所有@事件
- 增加了@reset, @goSearch
- customQuery 不用渲染form的时候用的筛选条件

### api 调用需要传入 apiFn

### formData使用 .sync 方式传入,才能重置成功

###  使用参考对应的 [name]-template.md
```
  tableAttrs {
    ...所有 el-table属性,
    // 配置对应的列显示
    columns:[
      {
        col:{
          包含除了以下4个的所有el-table-column属性
        },
        width, // 
        prop,  // 
        render, // 是一个h函数,来自vue.$createElement,优先显示html标签
        formatter // 普通函数,用于显示改变后的字符串
      }
    ]
  }
```