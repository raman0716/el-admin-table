export default {
  name: 'render-expand',
  functional: true,
  inheritAttrs: false,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render: (h, ctx) => ctx.props.render(h, ctx.props.row)
}