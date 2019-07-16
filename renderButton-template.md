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