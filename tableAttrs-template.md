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