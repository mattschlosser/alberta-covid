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
    aspectRatio: {
      type: Number, 
      default: 1.3
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
          aspectRatio: this.aspectRatio, 
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
            ], 
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          cubicInterpolationMode: "monotone",
        },
      });
    },
  },
};
</script>