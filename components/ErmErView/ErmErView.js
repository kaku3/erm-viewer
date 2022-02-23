import { dragscroll } from 'vue-dragscroll'
import ErmMixin from '~/components/Erm/ErmMixin.js'

export default {
  mixins: [
    ErmMixin
  ],
  directives: {
    dragscroll
  },
  props: {
    value: Boolean
  },
  data () {
    return {
      erm: null,
      width: 4,
      stage: {
        zoom: 1,
        width: 0,
        height: 0
      },
      lines: [],
      relations: [],
      selection: {
        table: null
      },
      relation: {
        show: false,
        table: null,
        columns: [],
        referencedColumns: []
      }
    }
  },
  methods: {
    init(erm) {
      this.reset()
      this.erm = erm
      this.initStage()
      this.$nextTick(() => {
        this.initLines()
      })
    },
    select(table, behavior='auto') {
      this.selection.table = table
      const _table = document.querySelector(`#table-${table.id}`)
      _table.scrollIntoView({
        behavior,
        block: 'center',
        inline: 'center'
      })
    },

    reset() {
      this.selection.table = null
    },

    initStage() {
      // 全オブジェクトが配置できるように最小値・最大値、幅・高さを求める。
      const categoriesRectangle = this.getRectangle(this.categories)
      const tablesRectangle = this.getRectangle(this.tables)

      const x0 = Math.min(categoriesRectangle.x0, tablesRectangle.x0)
      const y0 = Math.min(categoriesRectangle.y0, tablesRectangle.y0)
      const x1 = Math.max(categoriesRectangle.x1, tablesRectangle.x1)
      const y1 = Math.max(categoriesRectangle.y1, tablesRectangle.y1)

      // 0,0からオブジェクトを配置できるように正規化する。
      this.categories.forEach(v => {
        v.x -= x0
        v.y -= y0
      })
      this.tables.forEach(v => {
        v.x -= x0
        v.y -= y0
      })
      this.stage.width = x1 - x0
      this.stage.height = y1 - y0
    },
    initLines() {
      this.lines = []
      this.relations = []
      const columns = this.columns
      const style = `stroke:#444;stroke-width:${1 / this.stage.zoom};`

      this.columns.forEach(c => {
        if(c.referenced_column) {
          this.relations.push({
            id: c.id,
            rid: c.referenced_column
          })

          const r1 = this.getColumnRectangle(c.id, columns)
          const r2 = this.getColumnRectangle(c.referenced_column, columns)

          if(r1.x < r2.x) {
            const l = {
              x1: r1.x + r1.w / 2,
              y1: r1.y,
              x2: r2.x - r2.w / 2,
              y2: r2.y,
              style
            }
            this.lines.push(l)
          } else {
            const l = {
              x1: r1.x - r1.w / 2,
              y1: r1.y,
              x2: r2.x + r2.w / 2,
              y2: r2.y,
              style
            }
            this.lines.push(l)
          }
        }
      })
    },

    getColumnRectangle(columnId, columns) {
      const column = columns.find(c => c.id == columnId)
      const _table = document.querySelector(`#table-${column._tableId}`)
      const _column = document.querySelector(`#column-${column.id}`)

      return {
        x: _table.offsetLeft + _table.offsetWidth / 2,
        y: _table.offsetTop + _column.offsetTop + _column.offsetHeight / 2,
        w: _table.offsetWidth,
        h: _column.offsetHeight
      }
    },

    getRectangle(objs) {
      const x0 = objs.map(v => v.x).reduce((o, c) => Math.min(c, o))
      const y0 = objs.map(v => v.y).reduce((o, c) => Math.min(c, o))
      const x1 = objs.filter(v => v.width != -1).map(v => v.x + v.width).reduce((o, c) => Math.max(c, o))
      const y1 = objs.filter(v => v.height != -1).map(v => v.y + v.height).reduce((o, c) => Math.max(c, o))
      const ww = x1 - x0
      const hh = y1 - y0

      return { x0, y0, x1, y1, ww, hh }
    },

    rgb2hex(c) {
      const v = `#${this.toHex2(c.r)}${this.toHex2(c.g)}${this.toHex2(c.b)}`
      return v
    },
    toHex2(v) {
      return v.toString(16).padStart(2, '0')
    },

    stageStyle(stage) {
      return {
        'width': `${ stage.width * stage.zoom }px`,
        'height': `${ stage.height * stage.zoom }px`,
        'transform': `scale(${stage.zoom})`
      }
    },
    svgWidth(svg) {
      return svg.width
    },
    svgHeight(svg) {
      return svg.height
    },

    categoryStyle(category) {
      return {
        'left': category.x + 'px',
        'top': category.y + 'px',
        'width': category.width + 'px',
        'height': category.height + 'px',
        'background-color': this.rgb2hex(category.color)
      }
    },
    tableStyle(table) {
      const style = {
        'left': table.x + 'px',
        'top': table.y + 'px'
      }
      return style
    },
    tableColumnStyle(column) {
      const style = {}
      if(this.hasRelation(column)) {
        style.hasRelation = true
      }
      return style
    },

    tableColumn(o) {
      return `${this.columnLogicalName(o)} / ${this.columnPhysicalName(o)}`
    },
    isTableColumnPk(o) {
      return o.primary_key === "true"
    },
    isTableColumnFk(o) {
      return o.foreign_key === "true"
    },
    isTableColumnNn(o) {
      return o.not_null === "true"
    },
    hasRelation(c) {
      return this.relations.find(r => r.id == c.id || r.rid == c.id)
    },

    onClickColumn(c) {
      if(this.hasRelation(c)) {
        this.relation.table = this.table(c._tableId)

        // 自分 id を検索して、つながってる column を取得
        this.relation.columns = this.relations.filter(r => r.id == c.id).map(r => this.column(r.rid))
        this.relation.referencedColumns = this.relations.filter(r => r.rid == c.id).map(r => this.column(r.id))

        this.relation.show = true
      }
      console.log(this.relation)
    },

    onClickRelationTable() {
      this.select(this.relation.table, 'smooth')
    },

    onClickRelation(c) {
      this.select(this.table(c._tableId), 'smooth')
    },

    onChangeZoom() {
      this.initLines()
    },
    onClose() {
      this.onCloseRelation()
      this.show = false
    },
    onCloseRelation() {
      this.relation.show = false
    }
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
  },
  watch: {
    width(v) {
      v = Math.max(v, 1)
      v = Math.min(v, 5)
      this.width = v
    }
  }
}
