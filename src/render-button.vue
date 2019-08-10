<script>
const size = "small";
const type = "text";
let timer = 0;
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
    const { prop, attr, show } = this.data;
    if (show && !show(this.row)) return;
    return h(
      "el-button",
      {
        props:
          typeof prop === "function"
            ? {
                size,
                type,
                ...prop(this.row)
              }
            : { size, type },
        attrs:
          typeof attr === "function"
            ? {
                ...attr(this.row)
              }
            : {},
        on: {
          click: this.atClick
        }
      },
      this.data.text
    );
  },
  methods: {
    atClick(e) {
      e.stopPropagation();
      clearInterval(timer);
      timer = setTimeout(() => {
        this.data.atClick ? this.data.atClick(this.row) : () => {};
      }, 300);
    }
  }
};
</script>
