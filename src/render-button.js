const size = 'small';
export default {
  inheritAttrs: false,
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    show: {
      type: Function
    },
    row: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  render(h) {
    // validator(this.attrs)
    const { prop, attr, show } = this.data
    if (show && !show(this.row)) return;
    return h('el-button', {
      props: typeof prop === 'function' ? {
        size,
        ...prop(this.row)
      } : { size },
      attrs: typeof attr === 'function' ? {
        ...attr(this.row)
      } : {},
      on: {
        click: this.atClick
      }
    }, this.data.text)
  },
  methods: {
    atClick(e) {
      e.stopPropagation();
      this.data.atClick ? this.data.atClick(this.row) : () => { };
    }
  }
}