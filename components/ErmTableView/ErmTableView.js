import ErmMixin from '~/components/Erm/ErmMixin.js'
import { TABLE_HEADERS, COLUMN_HEADERS } from './header.js'

export default {
  mixins: [
    ErmMixin
  ],
  data () {
    return {
      erm: null,
      uiCategory: {
        categories: null,
        tab: 'all',
      },
    }
  },
  mounted() {
    console.log(ErmMixin)
  },
  methods: {
    init(erm) {
      this.erm = erm
      this.initCategories()
    },
    initCategories () {
      const categories = this.categories.map(c => {
        return {
          'id': c.id,
          'name': c.name,
          'node_element': c.node_element,
          'href': `category-${c.id}`,
        }
      })
      categories.sort((a, b) => (a.name >= b.name) ? 1 : -1)
      categories.unshift({
        'id': 'all',
        'name': 'すべて',

        'node_element': this.tables.map(t => t.id),
        'href': 'category-all'
      })
      this.uiCategory.categories = categories
    },

    anchor(href) {
      return `#${href}`
    },

    onClickTableItem(item) {
      console.log('onClickTableItem')
      this.$emit('select-table', item)
    }

  },
  computed: {
    TABLE_HEADERS() {
      return TABLE_HEADERS
    },
    COLUMN_HEADERS() {
      return COLUMN_HEADERS
    }
  }
}
