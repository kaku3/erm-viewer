<template lang="pug">
  v-tabs(v-model="uiCategory.tab" background-color="blue-grey lighten-4" dense)
    v-tab(v-for="c in uiCategory.categories" :key="c.id" :href="anchor(c.href)") {{ c.name }}({{ c.node_element.length }})
    v-tab-item(v-for="c in uiCategory.categories" :key="c.id" :value="c.href")
      v-card
        v-card-text
          v-row
            v-col(cols="4")
              v-text-field(
                v-model="c.search"
                prepend-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                dense
              )

          v-data-table.db-tables(
            dense
            fixed-header
            height="calc(100vh - 128px)"
            disable-pagination
            hide-default-footer
            :search="c.search"
            :headers="TABLE_HEADERS",
            :items="tablesInCategory(c)"
            item_key="physical_name"
            @click:row="onClickTableItem"
            show-expand
            :expanded.sync="c.expands"
          )
            template(v-slot:expanded-item="{ headers, item }")
              td(:colspan="headers.length")
                v-card
                  v-data-table.db-table-columns(
                    dense
                    disable-pagination
                    hide-default-footer
                    :headers="COLUMN_HEADERS"
                    :items="item.columns.normal_column"
                    item_key="physical_name"
                  )
                    template(v-slot:item.logical_name="{item}") {{ columnLogicalName(item) }}
                    template(v-slot:item.physical_name="{item}") {{ columnPhysicalName(item) }}
                    template(v-slot:item.length="{item}") {{ columnLength(item) }}
                    template(v-slot:item.primary_key="{item}") {{ columnBool(item.primary_key) }}
                    template(v-slot:item.not_null="{item}") {{ columnBool(item.not_null) }}
                    template(v-slot:item.unique_key="{item}") {{ columnBool(item.unique_key) }}
                    template(v-slot:item.foreign_key="{item}") {{ columnForeignKey(item) }}
                    template(v-slot:item.auto_increment="{item}") {{ columnBool(item.auto_increment) }}
                    template(v-slot:item.description="{item}")
                      p(v-html="columnDescription(item)")

</template>
<script lang="ts" src="./ErmTableView/ErmTableView.js"></script>
<style lang="scss" src="./ErmTableView/table.scss" scoped ></style>
