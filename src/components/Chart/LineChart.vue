<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
export default {
  extends: Line,
  mixins: [reactiveProp], 
  props: ['chartData'],
  mounted () {
    this.renderChart(
        this.chartData, 
        // options
        {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        // parser: 'YYYY-MM-DD',
                        unit: 'day',
                        displayFormats: {
                            'day': 'll'
                        }
                    },
                    // ticks: {
                    //     source: 'data'
                    // }
                }]    
                    // min: new Date("2020-03-15")
                // }]
            },
            cubicInterpolationMode: 'monotone',
        }
    )
  }
}
</script>