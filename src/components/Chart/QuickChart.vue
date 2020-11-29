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
            <v-alert prominent>
              This data is subject to experiments, and may not be correct. 
            </v-alert>
            <v-list subheader>
             <v-subheader>Mode</v-subheader>
              <v-list-item-group v-model="selectedMode">
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
      selectedMode: this.initMode,
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
        datasets: [
          {
            label: "Count",
            backgroundColor: "#f87979",
            data: this.allData[this.category].data.map((e) => ({
              x: e.x,
              y: e[this.selectedMode],
            })),
          },
        ],
      };
    },
  },
};
</script>