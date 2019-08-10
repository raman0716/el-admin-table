### 基本说明
- 可以使用el-table/el-pagination/el-form的所有@事件
- 增加了@reset, @goSearch
- customQuery 不用渲染form的时候用的筛选条件
- selectUnique 在使用选择框的时候，独一份的选择结果的obj，sync属性

### api 调用需要传入 apiFn

### formData使用 .sync 方式传入,可以互动成功
### pagerAttrs .sync 方式传入,可以互动成功

###  tableAttrs
```
  tableAttrs {
    ...所有el-table属性,
    // 配置对应的列显示
    columns:[
      {
        col:{
          包含除了以下4个的所有el-table-column属性
        },
        label, // 
        prop,  // 
        render, // 是一个h函数,来自vue.$createElement,优先显示html标签
        formatter // 普通函数,用于改变字符串
      },
      {
        type: selection
      },
      {
        type: "index" // 序号
      },
      {
        type: operation,
        btns: [
          prop: row => (属性),
          text: btn文字,
          atClick: 点击事件
        ]
      },
    ]
  }
```

### render-button
```

  prop: (row: any) => {
    return {
      disabled: row.msgType === '1',
      type: 'text'
    };
  },
  show: (row: any) => row.name !== 1,
  text: '评价详情',
  // atClick: (row: msgList) => this.goDetail(row)

```

### tableAttrs
```
 tableAttrs: {
  border: true,
  size: 'small',
  'row-class-name': ({ rowIndex }) => {
    if (rowIndex % 2 === 1) {
      return 'dark';
    }
  },
  columns: [
    {
      type: 'selection'
    },
    {
      type: 'index'
    },
    {
      col: {
        sortable: true
      },
      prop: 'date',
      label: '日期',
      formatter: row => new Date().toLocaleString()
    },
    {
      col: {
        width: '180px'
      },
      prop: 'name',
      label: '姓名'
    },
    {
      prop: 'address',
      label: '地址',
      render: (h, row) => h('div', {
        attrs: {
          class: 'box'
        }
      }, '内容')
    },
    {
      type: 'operation',
      btns: [
        {
          prop: row => {
            return {
              disabled: row.status === 1
            };
          },
          text: '删除',
          atClick: row => console.log(row)
        }
      ]
    }
  ]
}
```