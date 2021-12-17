<template>
    <quick-chart
      :modes="modes"
      keyed-by="category"
      :friendlyModes="friendlyModes"
      :all-data="myData"
      :init-category="12"
      init-mode="new_all_cases"
    />
</template>
<script>
import QuickChart from './Chart/QuickChart.vue';
export default {
  components: {
    QuickChart   
  },
  async created() {
    let myData = await import('../../age/all.json').then(r => r.default);
    myData.map((f) => {
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
    })
    this.myData = myData;
  },
  data() {
 return {
      myData: [],
      selectedMode: "all_cases",
      modes: [
        "male_cases",
        {
          name: "new_male_cases",
          type: "bar", 
          backgroundColor: "#6666ff"
        },
        "male_percent",
        "female_cases",
        {
          name: "new_female_cases",
          type: "bar", 
          backgroundColor: "#66ff66"
        },
        "female_percent",
        "unknown_cases",
        {
          name: "new_unknown_cases",
          type: "bar", 
          backgroundColor: "#99ff66"
        },
        "unknown_percent",
        "all_cases",
        {
          name: "new_all_cases",
          type: "bar", 
          backgroundColor: "#ff6666"
        }
      ],
      friendlyModes: {
        "male_cases": "Male Cases",
        "new_male_cases": "New Male Cases",
        "male_percent": "% of Male Cases",
        "female_cases": "Female Cases",
        "new_female_cases": "New Female Cases",
        "female_percent": "% of Female Cases",
        "unknown_cases": "Unknown Sex",
        "new_unknown_cases": "New Unknown Sex",
        "unknown_percent": "% of Unknwon Sex Cases",
        "all_cases": "All Cases",
        "new_all_cases": "New Cases",
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