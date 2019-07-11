export default {
  name: 'render-expand',
  functional: true,
  inheritAttrs: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render: (h, ctx) => ctx.props.render(h, ctx.props.row),
  mounted() {
    console.log(this.row)
  }
}