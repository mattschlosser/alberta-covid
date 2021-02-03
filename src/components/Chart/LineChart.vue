<template>
  <canvas ref="myChart" style="width: 100%;"></canvas>
</template>
<script>
import chart from "chart.js";
export default {
  props: ["chartData"],
  data: () => ({ c: null }),
  watch: {
    chartData() {
      // recreate the chart if data changes
      if (this.c) this.c?.destroy();
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
      new chart(this.$refs.myChart, {
        type: "line",
        data: this.chartData,
        options: {
          responsive: true, 
          aspectRatio: 1.3,
          scales: {
            xAxes: [
              {
                id: "1",
                type: "time",
                time: {
                  parser: "YYYY-MM-DD",
                  unit: "day",
                  displayFormats: {
                    day: "ll",
                  },
                },
                // ticks: {
                //     source: 'data'
                // }
              },
            ],
            // min: new Date("2020-03-15")
            // }]
          },
          cubicInterpolationMode: "monotone",
        },
      });
    },
  },
};
</script>