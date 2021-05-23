<template>
  <canvas ref="myChart" style="margin: 0 auto;"></canvas>
</template>
<script>
import chart from "chart.js";
export default {
  props: {
    chartData: {
      type: Object
    }, 
    type: {
      type: String, 
      default: "line"
    },
  },
  data: () => ({ c: null }),
  watch: {
    chartData() {
      // recreate the chart if data changes
      if (this.c) {
        this.c?.destroy();
      }
      this.c = this.createChart();
    }
  }, 
  mounted() {
    this.c = this.createChart();
  },
  beforeDestroy() {
    this.c?.destroy();
  },
  methods: {
    createChart() {
      return new chart(this.$refs.myChart, {
        type: this.type,
        data: this.chartData,
        options: {
          responsive: true, 
          aspectRatio: 1.3,
          scales: {
            xAxes: [
              {
                offset: true, 
                id: "1",
                type: "time",
                time: {
                  parser: "YYYY-MM-DD",
                  unit: "day",
                  displayFormats: {
                    day: "ll",
                  },
                },
              },
            ]
          },
          cubicInterpolationMode: "monotone",
        },
      });
    },
  },
};
</script>