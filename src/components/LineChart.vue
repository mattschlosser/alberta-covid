<script>
import { Line } from 'vue-chartjs'
import data from '../../local/all.json'
let x = data.find(e => e.name.match(/Bonnie/));
let d = x.data.map((data) => ({x: data.x, y: data.active}))
console.log(d);
for (let i of d) {
    console.log(i.x);
}
export default {
  extends: Line,
  mounted () {
    this.renderChart(
        {
            datasets: [{
                label: 'Edmonton', 
                backgroundColor: '#f87979',
                data: d,
            }]
        }, 
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
            }
        }
    )
  }
}
</script>