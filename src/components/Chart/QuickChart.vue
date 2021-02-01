<template>
    <v-layout row reverse>
        <v-flex md12 lg9>
            <div
            style="
                postion: sticky;
                top: 0;
                margin: 0 auto;
                width: 100%;
                max-height: 100vh;
            "
            :style="{ width: autoWidth }"
            >
            <LineChart :chart-data="chartData" />
            </div>
        </v-flex>
        <v-flex md12 lg3 
                    align-self-start
                    style="overflow: auto; max-height: 100vh; margin: 0px">
            <!-- <v-alert prominent>
              This data is subject to experiments, and may not be correct. 
            </v-alert> -->
            <v-list subheader>
             <v-subheader>Mode</v-subheader>
              <v-list-item-group multiple v-model="selectedMode">
                <v-list-item
                    v-for="(mode) in modes"
                    :key="mode"
                    :value="mode"
                    :style="{
                    'font-weight': selectedMode == mode ? 'bold' : 'normal',
                    }"
                >
                    <v-list-item-title>
                    {{ mode }}
                    </v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-list subheader>
            <v-subheader>Category</v-subheader>
            <v-list-item-group v-model="category">
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

function genLabels() {
  let l = [];
  let start = new Date(2020, 3,15);
  let now = new Date();
  while (start < now) {
    l.push(`${start.getUTCFullYear()}-${("0"+(start.getUTCMonth()+1)).slice(-2)}-${("0"+start.getUTCDate()).slice(-2)}`)
    start.setDate(start.getDate()+1);
  }
  return l;
}

export default {
  components: {
    LineChart,
  },
  props: {
    initMode: String,
    modes: Array, 
    initCategory: Number, 
    allData: Array,
    keyedBy: String
  }, 
  data() {
    return {
      selectedMode: [this.initMode],
      category: 0
    };
  },
  computed: {
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
    chartData() {
      return {
        datasets: this.selectedMode.map((selected, i) => ({
            label: selected,
            borderColor: i == 0 ? "#7979f8" : i == 1 ? '#f97979' : i == 2 ? '#79f979' : '#797979',
            backgroundColor: "#fff0",
            data: this.allData[this.category].data.map((e) => ({
              x: e.x,
              y: e[selected],
            })),
          })
        ),
        labels: genLabels()
      };
    },
  },
};
</script>