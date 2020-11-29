<template>
    <quick-chart
      :modes="modes"
      keyed-by="category"
      :all-data="myData"
      init-category=0
      init-mode="male_cases"
    />
</template>
<script>
import myData from "../../age/all.json";
import QuickChart from './Chart/QuickChart.vue';
export default {
  components: {
    QuickChart   
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