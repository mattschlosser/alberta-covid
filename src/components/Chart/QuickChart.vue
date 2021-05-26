<template>
    <v-layout row reverse>
        <v-flex md12 lg9>
            <div
            class="chart-container"
            style="
                postion: relative;
                width: 75%;
                margin: 0 auto;
            "
            >
            <v-alert v-if='$scopedSlots.note' color="warning">
              <slot name="note"></slot>
            </v-alert>
            <LineChart :chart-data="chartData" :type="type" />
            <v-row >
                <v-col sm="12" md="6">
                  <div>Last 30 Days</div>
                  <LineChart :chart-data="last30" :type="type" />
                </v-col>
                <v-col sm="12" md="6">
                  <div>Last 7 Days</div>
                  <LineChart :chart-data="last7" :type="type" />
                </v-col>
            </v-row>
            </div>
        </v-flex>
        <v-flex md12 lg3 
                    align-self-start
                    style="overflow: auto; max-height: 100vh; margin: 0px">
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
                      {{ allData[category] && allData[category].data.slice(-1)[0][mode] }} 
                      ({{allData[category] && allData[category].data.slice(-1)[0][mode] - allData[category].data.slice(-2)[0][mode] }})
                    </v-list-item-action-text>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-list subheader>
            <v-subheader>Category</v-subheader>
            <v-list-item-group mandatory v-model="category">
                <v-list-item v-for="(cat, i) in categories" :key="cat" :value="i">
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
      category: this.initCategory
    };
  },
  computed: {
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
    currentCategoryName() {
      if (this.allData[this.category]) {
        return this.allData[this.category][this.keyedBy];
      } else {
        return "";
      }
    },  
    chartData() {
      return {
        datasets: this.selectedMode.map((selected, i) => ({
            label: `${selected} - ${this.currentCategoryName}` ,
            borderColor: i == 0 ? "#7979f8" : i == 1 ? '#f97979' : i == 2 ? '#79f979' : '#797979',
            backgroundColor: this.processedModes[selected].backgroundColor || "#fff0",
            type: this.processedModes[selected].type,
            tension:0,
            data:  this.allData[this.category]?.data.map(e => e[selected]) || [],
            xAxisID: "1"
          })
        ),
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