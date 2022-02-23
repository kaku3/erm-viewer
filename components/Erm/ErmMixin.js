export default {
  methods: {
    normalizeErm() {
      // 数値が文字列として保持されているので数値に変換しておく
      this.categories.forEach(o => {
        o.id = parseInt(o.id)
        o.x = parseInt(o.x)
        o.y = parseInt(o.y)
        o.width = parseInt(o.width)
        o.height = parseInt(o.height)
        o.color = {
          r: parseInt(o.color.r),
          g: parseInt(o.color.g),
          b: parseInt(o.color.b)
        }
        if(Array.isArray(o.node_element)) {
          for(const i in o.node_element) {
            o.node_element[i] = parseInt(o.node_element[i])
          }
        } else {
          o.node_element = parseInt(o.node_element)
        }
      })
      this.tables.forEach(o => {
        o.id = parseInt(o.id)
        o.x = parseInt(o.x)
        o.y = parseInt(o.y)
        o.width = parseInt(o.width)
        o.height = parseInt(o.height)
      })
      this.tables
        .forEach(t => {
          const columns = t.columns
          if(Array.isArray(columns.normal_column)) {
            for(const normal_column of columns.normal_column) {
              this.normalizeColumnsNormalColumn(normal_column)
            }
          } else {
            this.normalizeColumnsNormalColumn(columns.normal_column)
          }
        })
      this.tables
        .filter(t => typeof t.connections.relation !== 'undefined')
        .forEach(t => {
          const connections = t.connections
          if(Array.isArray(connections.relation)) {
            for(const relation of connections.relation) {
              this.normalizeRelation(relation)
            }
          } else {
            this.normalizeRelation(connections.relation)
          }
        })
    },
    normalizeRelation(o) {
      o.id = parseInt(o.id)
      o.source = parseInt(o.source)
      o.target = parseInt(o.target)
      o.source_xp = parseInt(o.source_xp)
      o.source_yp = parseInt(o.source_yp)
      o.target_xp = parseInt(o.target_xp)
      o.target_yp = parseInt(o.target_yp)
      o.color = {
        r: parseInt(o.color.r),
        g: parseInt(o.color.g),
        b: parseInt(o.color.b)
      }
    },
    normalizeColumnsNormalColumn(o) {
      o.id = parseInt(o.id)
      if(o.referenced_column) o.referenced_column = parseInt(o.referenced_column)
      if(o.relation) o.relation = parseInt(o.relation)
    },

    tablesInCategory(c) {
      return this.tables.filter(t => c.node_element.includes(t.id))
    },
    table(id) {
      return this.tables.find(t => t.id === id)
    },
    column(id) {
      return this.columns.find(c => c.id === id)
    },
    tablePhysicalName(id) {
      return this.table(id).physical_name
    },

    columnLogicalName(c) {
      if (c.logical_name) {
        return c.logical_name
      }
      if (c.word_id) {
        return eval(`this.erm.diagram.dictionary.word[${c.word_id}].logical_name`)
      }
      // 外部キー
      c = eval(`this.columns[${c.referenced_column}]`)
      return this.columnLogicalName(c)
    },

    columnPhysicalName(c) {
      if (c.physical_name) {
        return c.physical_name
      }
      if (c.word_id) {
        return eval(`this.erm.diagram.dictionary.word[${c.word_id}].physical_name`)
      }
      // 外部キー
      c = eval(`this.columns[${c.referenced_column}]`)
      return this.columnPhysicalName(c)
    },

    columnForeignKey(c) {
      if(c.referenced_column) {
        // 外部キー
        c = eval(`this.columns[${c.referenced_column}]`)
        return `-> ${this.table(c._tableId).physical_name}.${this.columnPhysicalName(c)}`
      }
      return ''
    },

    columnDescription(c) {
      if (c.word_id) {
        return eval(`this.erm.diagram.dictionary.word[${c.word_id}].description`).replace(/\r\n/g, '<br />')
      }
      // 外部キー
      c = eval(`this.columns[${c.referenced_column}]`)
      return this.columnDescription(c)
    },

    columnLength(c) {
      if (c.word_id) {
        const v = eval(`this.erm.diagram.dictionary.word[${c.word_id}].length`)
        return v !== 'null' ? v : ''
      }
      // 外部キー
      c = eval(`this.columns[${c.referenced_column}]`)
      return this.columnLength(c)
    },

    columnBool(b) {
      return b === "true" ? 'o' : ''
    }
  },
  computed: {
    categories() {
      return this.erm?.diagram.settings.category_settings.categories.category || []
    },

    tables() {
      return this.erm?.diagram.contents.table || []
    },

    columns() {
      return this.tables
        .flatMap(t => {
          const cs = t['columns']['normal_column'].map(c => Object.assign(c, { _tableId: t.id }))
          return cs
        })
        .sort((a, b) => parseInt(a.id) < parseInt(b.id) ? -1 : 1)
    },

    relations() {
      return this.tables
        .filter(t => typeof t.connections.relation !== 'undefined')
        .flatMap(t => t['connections']['relation'])
        .sort((a, b) => a.id < b.id ? -1 : 1)
    }
  }
}
