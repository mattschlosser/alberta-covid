<template>
    <v-layout row reverse>
        <v-flex md12 lg9 
            :class="{'max-height': !['xs', 'sm', 'md'].includes($vuetify.breakpoint.name)}">
            <div
            class="chart-container"
            style="
                postion: relative;
                width: 75%;
                margin: 25px auto;
            "
            >
            <v-alert v-if='$scopedSlots.note' color="warning">
              <slot name="note"></slot>
            </v-alert>
            <v-row >
              <v-col sm="12">
                <LineChart :chart-data="chartData" :type="type" /> 
              </v-col>
                <v-col sm="12" md="6">
                  <div>Last 30 Reports</div>
                  <LineChart :aspect-ratio="0.5" :chart-data="last30" :type="type" />
                </v-col>
                <v-col sm="12" md="6">
                  <div>Last 7 Reports</div>
                  <LineChart :aspect-ratio="0.5" :chart-data="last7" :type="type" />
                </v-col>
            </v-row>
            </div>
        </v-flex>
        <v-flex md12 lg3 
                    align-self-start
                    style="margin: 0px" 
                    :class="{'max-height': !['xs', 'sm', 'md'].includes($vuetify.breakpoint.name)}"
        >
            <v-alert prominent>
            Data is current until end of day {{allData.length && allData[0].data.slice(-1)[0].x || 'loading'}}
            </v-alert>
            <v-list subheader>
             <v-subheader>Mode</v-subheader>
              <v-list-item-group mandatory multiple v-model="selectedMode">
                <v-list-item
                    v-for="({name: mode}) in processedModes"
                    :key="mode"
                    :value="mode"
                    :style="{
                    'font-weight': selectedMode == mode ? 'bold' : 'normal',
                    }"
                >
                    <v-list-item-title>
                    {{ friendlyModes[mode] || mode }}
                    </v-list-item-title>  
                    <v-list-item-action-text>
                      {{ getTotal(mode) }} 
                      ({{ getDiff(mode) }})
                    </v-list-item-action-text>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-list subheader>
            <v-subheader>
              Category
            </v-subheader>
            <v-subheader>
              <v-text-field label="Search" placeholder="Enter a search term" v-model="search"></v-text-field>
            </v-subheader>
            <v-list-item-group mandatory multiple v-model="selectedCategories">  
                <v-list-item v-for="({category: cat, index: i}) in filteredCategories" :key="cat" :value="i">
                    <v-list-item-title>
                    {{ cat }}
                    </v-list-item-title>
                </v-list-item>
            </v-list-item-group>
            </v-list>
        </v-flex>
    </v-layout>
</template>
<script>
import LineChart from "./LineChart.vue";
import distinctColors from 'distinct-colors'
export default {
  components: {
    LineChart,
  },
  props: {
    initMode: String,
    modes: Array, 
    friendlyModes: {
      type: Object,
      default: () => ({}),
    },
    initCategory: Number, 
    allData: {
      type: Array,
      default: () => []
    },
    keyedBy: String,
    type: {
      type: String, 
      default: "line"
    }
  }, 
  data() {
    return {
      selectedMode: [this.initMode],
      selectedCategories: [this.initCategory],
      category: this.initCategory, 
      search: ''
    };
  },
  computed: {
    filteredCategories() {  
      return this.categories.map((category, index) => ({category, index}))
        .filter(({category}) => {
          if (this.search) {
            return category.includes(this.search);
          } else {
            return true
          }
      });
    }, 
    processedModes() {
      let m = {};
      for (let mode of this.modes) {
        if (typeof mode === 'string') {
          m[mode] = this.defaultMode(mode);
        } else {
          m[mode.name] = {...this.defaultMode(mode.name), ...mode}
        }
      }
      return m;
    }, 
    categories() {
      return this.allData.map((e) => e[this.keyedBy]);
    },
    autoWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "25%";
        case "lg":
          return "55%";
        case "md":
          return "75%";
        case "sm":
          return "100%";
      }
      return "100%";
    },
    modeTotals() {
      return Object.values(this.processedModes).reduce((obj, {name: mode}) => {
        let {allData} = this;
        obj[mode] =  {
          total: this.selectedCategories.reduce((a, category) => {
            return a + (allData[category] && allData[category].data.slice(-1)[0][mode])
          }, 0), 
          diff: this.selectedCategories.reduce((a, category) => {
            return a + (Math.round((allData[category] && allData[category].data.slice(-1)[0][mode] - allData[category].data.slice(-2)[0][mode])*10)/10)
          }, 0)
        }
        return obj
      }, {})
    }, 
    chartData() {
      let categoryCount = this.selectedCategories.length;
      let modeCount = this.selectedMode.length;
      let colors = distinctColors({
        count: categoryCount * modeCount
      })
      return {
        datasets: this.selectedCategories.map((category, j) => {
            return this.selectedMode.map((selected, i) => ({
              label: `${this.friendlyModes[selected] || selected} - ${this.getCategoryName(category)}` ,
              borderColor: colors[j * modeCount + i].hex(),
              backgroundColor:  this.processedModes[selected].backgroundColor !== "#fff0" ? colors[j * modeCount + i].hex() :  "#fff0",
              type: this.processedModes[selected].type,
              tension:0,
              data:  this.allData[category]?.data.map(e => e[selected]) || [],
              xAxisID: "1"
            }))
          }
        ).reduce((a,e) => [...a, ...e], []),
        labels: this.allData[this.category]?.data.map(e => e.x) || []
      };
    },
    last30() {
      
      let data = {...this.chartData};
      return this.last(data, 30);
    },
    last7() {
      let data = {...this.chartData};
      return this.last(data, 7);
    }
  },
  methods: {
    getCategoryName(category) {
      if (this.allData[category]) {
        return this.allData[category][this.keyedBy];
      } else {
        return "";
      }
    },  
    getTotal(mode) {
      return this.modeTotals[mode].total ?? "Loading"
    }, 
    getDiff(mode) {
      return this.modeTotals[mode].diff ?? "~"
    }, 
    last(data, n) {
      let myDatasets = [];
      for (let dataset of data.datasets) {
        // clone
        let myDataset = {...dataset};
        myDataset.data = [...dataset.data];
        myDataset.data = dataset.data.slice(-n)
        myDatasets.push(myDataset);
      }
      data.labels = [...data.labels].slice(-n)
      data.datasets = myDatasets;
      return data;  
    }, 
    defaultMode(mode) {
      return {
        type: "line", 
        name: mode, 
        backgroundColor: "#fff0",
        title: this.friendlyModes[mode] || mode,
        key: mode
      }
    }
  }
};
</script>
<style scoped>
  .max-height {
    max-height: calc(100vh - 100px);
    overflow-x: auto;
  }
</style>
