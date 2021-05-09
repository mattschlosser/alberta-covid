<template>
    <quick-chart
      :modes="modes"
      keyed-by="category"
      :friendlyModes="friendlyModes"
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
      myData: myData.map((f) => {
        f.data = f.data.map((e,i,a) => {
          if (!i) return e;
          // figure out how many days it has been
          const diff = Math.round((new Date(e.x) - new Date(a[i-1].x))/1000/60/60/24);
          e.new_male_cases = (e.male_cases - a[i-1].male_cases)/diff;
          e.new_female_cases = (e.female_cases - a[i-1].female_cases)/diff;
          e.new_unknown_cases = (e.unknown_cases - a[i-1].unknown_cases)/diff;
          e.new_all_cases = (e.all_cases - a[i-1].all_cases)/diff;
          
          return e;
        });
        return f;
      }),
      selectedMode: "all_cases",
      modes: [
        "male_cases",
        "new_male_cases",
        "male_percent",
        "female_cases",
        "new_female_cases",
        "female_percent",
        "unknown_cases",
        "new_unknown_cases",
        "unknown_percent",
        "all_cases",
        "new_all_cases",
      ],
      friendlyModes: {
        "male_cases": "Male Cases",
        "new_male_cases": "New Male Cases",
        "male_percent": "% of Cases that are Male",
        "female_cases": "Female Cases",
        "new_female_cases": "New Female Cases",
        "female_percent": "% of Cases that are Female",
        "unknown_cases": "Unknown Sex",
        "new_unknown_cases": "New Unknown Sex",
        "unknown_percent": "% of Caess w\\ Unknown Sex",
        "all_cases": "All Cases",
        "new_all_cases": "New All Cases",
      },
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