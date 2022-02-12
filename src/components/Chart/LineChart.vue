<template>
  <canvas ref="myChart" style="margin: 0 auto;"></canvas>
</template>
<script>
import chart from "chart.js";
import "chartjs-annotation";
import moment from 'moment';
export default {
  props: {
    chartData: {
      type: Object
    }, 
    annotate: {
      type: Boolean, 
      default: false
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
          annotation: this.annotate ? {
             annotations: [{
                 drawTime: 'afterDatasetsDraw',
                 id: `rep-start-${Math.random()}`, 
                 type: "line",
                 mode: "vertical",  
                 borderColor: 'black', 
                 borderWidth: 4, 
                 label: { content: "REP Start", enabled: true },
                 value: new Date("2021-09-23"), 
                 scaleID: this.annotate ? "annotate-1" : "1" // this conflicts with other charts on the page otherwise
             }, {
                 drawTime: 'afterDatasetsDraw',
                 id: `rep-start-${Math.random()}`, 
                 type: "line",
                 mode: "vertical",  
                 borderColor: 'black', 
                 borderWidth: 4, 
                 label: { content: "REP End", enabled: true },
                 value: new Date("2022-02-09"), 
                 scaleID: this.annotate ? "annotate-1" : "1" // this conflicts with other charts on the page otherwise
             }]
          } : undefined, 
          responsive: true, 
          aspectRatio: this.aspectRatio, 
          scales: {
            xAxes: [
              {
                offset: true, 
                id: this.annotate ? "annotate-1" : "1",
                type: "time",
                time: {
                  parser: "YYYY-MM-DD",
                  unit: "day",
                  displayFormats: {
                    day: "ll",
                  },
                  tooltipFormat: "ll"
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
