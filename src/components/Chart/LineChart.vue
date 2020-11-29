<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
export default {
  extends: Line,
  mixins: [reactiveProp], 
  mounted () {
    this.renderChart(
        this.chartData, 
        // options
        {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    bounds: 'data',
                    min: new Date("2020-03-15")
                }]
            },
            cubicInterpolationMode: 'monotone',
        }
    )
  }
}
</script>