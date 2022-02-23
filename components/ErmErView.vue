<template lang="pug">
  .erm-er-view
    v-navigation-drawer(
      v-model="show"
      :width="`${width * 20}%`"
      absolute
      right
      component-class="erm-er-dialog"
      :elevation="6"
    )
      .close
        v-btn(
          class="mx-2"
          fab
          dark
          x-small
          color="primary"
          @click="onClose"
        )
          v-icon(dark) mdi-close

      .er-tool.d-flex.blue-grey.lighten-5
        .er-tool__zoom-icon
          v-icon mdi-loupe
        .er-tool__zoom
          v-slider(dense min="0.1" max="1" step="0.3" v-model="stage.zoom" @change="onChangeZoom")
        .er-tool__width.ml-auto
          v-icon.pr-1 mdi-image-size-select-small
          input(type="number" v-model="width")
      .er-container(v-dragscroll)
        .stage(ref="stage" :style="stageStyle(stage)")
          .category(v-for="c in categories"
            :key="`category-${c.id}`"
            :style="categoryStyle(c)"
          )
            .category-name {{ c.name }}
          svg(:width="svgWidth(stage)" :height="svgHeight(stage)")
            line(v-for="(l, i) in lines" :key="`line-${i}`" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" :style="l.style")
          .table(v-for="t in tables"
            :key="`table-${t.id}`"
            :id="`table-${t.id}`"
            :style="tableStyle(t)"
          )
            .table-name
              .logical-name {{ t.logical_name }}
              .physical-name {{ t.physical_name }}
            .table__column(v-for="c in t.columns.normal_column"
              :key="`table-${t.id}__column-${c.id}`"
              :id="`column-${c.id}`"
              :class="tableColumnStyle(c)"
              @click.stop="onClickColumn(c)"
            )
              .name {{ tableColumn(c) }}
              .pk(v-if="isTableColumnPk(c)") PK
              .fk.orange.lighten-3(v-if="isTableColumnFk(c)") FK
              .nn(v-if="isTableColumnNn(c)") NN

    v-navigation-drawer(
      v-model="relation.show"
      :width="320"
      absolute
      right
      component-class="erm-er__relation-dialog"
      :elevation="10"
    )
      .close
        v-btn(
          class="mx-2"
          fab
          dark
          x-small
          color="primary"
          @click="onCloseRelation"
        )
          v-icon(dark) mdi-close
      h3.relation__table(v-if="relation.table" @click.stop="onClickRelationTable") {{relation.table.physical_name}}
      ul.relation__columns(v-if="relation.columns.length > 0")
        li(v-for="o in relation.columns" :key="`relation__columns-${o.id}`" @click.stop="onClickRelation(o)")
          .table-name {{tablePhysicalName(o._tableId)}}
          .column-name {{columnPhysicalName(o)}}
      ul.relation__referenced-columns(v-if="relation.referencedColumns.length > 0")
        li(v-for="o in relation.referencedColumns" :key="`relation__referenced-columns-${o.id}`" @click.stop="onClickRelation(o)")
          .table-name {{tablePhysicalName(o._tableId)}}
          .column-name {{columnPhysicalName(o)}}
</template>
<script src="./ErmErView/ErmErView.js"></script>
<style lang="scss" src="./ErmErView/ErmErView.scss" scoped></style>
