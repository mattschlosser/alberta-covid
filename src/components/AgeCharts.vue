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
            This data is subject to experiments, and may not be correct. 
            <v-list subheader>
            <v-subheader>Mode</v-subheader>
            <v-list-item
                v-for="mode in modes"
                :key="mode"
                @click="selectedMode = mode"
                :style="{
                'font-weight': selectedMode == mode ? 'bold' : 'normal',
                }"
            >
                <v-list-item-title>
                {{ mode }}
                </v-list-item-title>
            </v-list-item>
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
import LineChart from "./LineChart";
import myData from "../../age/all.json";
export default {
  components: {
    LineChart,
  },
  data() {
    return {
      myData,
      selectedMode: "male_cases",
      modes: [
        "male_cases",
        "male_percent",
        "female_cases",
        "female_percent",
        "unknown_cases",
        "unknown_percent",
        "all_cases",
        "percent",
      ],
      category: 0
    };
  },
  computed: {
    categories() {
      return this.myData.map((e) => e.category);
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
            data: this.myData[this.category].data.map((e) => ({
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