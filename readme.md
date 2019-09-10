### 基本说明
- 可以使用el-table/el-pagination/el-form的所有@事件
- 增加了@reset, @goSearch
- customQuery 不用渲染form的时候用的筛选条件
- selectUnique 在使用选择框的时候，独一份的选择结果的obj，sync属性

### api 调用需要传入 apiFn

### formData使用 .sync 方式传入,可以互动成功
### pagerAttrs .sync 方式传入,可以互动成功

### 属性说明 about Props
```
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
```

###  tableAttrs
```
  tableAttrs {
    ...{ el-table props },
    columns:[
      {
        col: {
          // all el-table-column props besides the below props
          // 包含除了以下4个的所有el-table-column属性
        },
        label, // 
        prop,  // 
        render, // vue.$createElement. (first class) 是一个h函数,来自vue.$createElement,优先显示html标签
        formatter // a simple function. (enable without render) 普通函数,用于改变字符串
      },
      {
        type: selection
      },
      {
        type: "index" // (just index) 序号
      },
      {
        type: operation,
        btns: [
          prop: row => { props },
          text: 'btn text',
          atClick: click event
        ]
      },
    ]
  }
```

### render-button
```
  prop: (row: any) => {
    return {
      disabled: row.status === '1',
      type: 'text'
    };
  },
  show: (row: any) => row.name !== 1,
  text: 'comments',
  atClick: (row: RowType) => console.log(row)
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
      label: 'Date',
      formatter: row => new Date().toLocaleString()
    },
    {
      col: {
        width: '180px'
      },
      prop: 'name',
      label: 'Name'
    },
    {
      prop: 'address',
      label: 'Addr',
      render: (h, row) => h('div', {
        attrs: {
          class: 'box'
        }
      }, 'msg')
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
          text: 'Delete',
          atClick: row => console.log(row)
        }
      ]
    }
  ]
}
```