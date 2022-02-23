<template>
  <div class="index">
    <v-container v-if="!erm">
      <v-card :loading="loading">
        <v-card-text>
          <v-file-input
            accept="text/erm"
            label="erm"
            dense
            @change="onChangeErmFile"
          >
          </v-file-input>
        </v-card-text>
      </v-card>
    </v-container>
    <div v-else>
      <ErmTableView ref="ermTableView" @select-table="onSelectTable"></ErmTableView>
      <ErmErView ref="ermErView" v-model="erView.show"></ErmErView>
    </div>
  </div>
</template>

<script>
import xml2js from 'xml2js'

import ErmMixin from '~/components/Erm/ErmMixin.js'

export default {
  name: 'IndexPage',
  mixins: [
    ErmMixin
  ],
  data () {
    return {
      loading: false,
      erm: null,
      erView: {
        show: false,
        table: null
      }
    }
  },
  methods: {
    async onChangeErmFile(file) {
      this.loading = true
      this.readAsText(file)
        .then(xml => {
          const parser = new xml2js.Parser({
            trim: true,
            explicitArray: false
          })
          parser.parseStringPromise(xml)
            .then(erm => {
              this.erm = erm
              this.normalizeErm()

              this.$nextTick(() => {
                this.$refs.ermTableView.init(this.erm)
                this.$refs.ermErView.init(this.erm)
                this.loading = false
              })
            })
        })
    },

    readAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsText(file)
      })
    },

    onSelectTable(table) {
      this.erView.show = true
      this.erView.table = table
      this.$refs.ermErView.select(table)
    }
  }
}
</script>
