<script>
import { Bar } from 'vue-chartjs'
import data from '../../local/20200531.json'
console.log(data);
export default {
  extends: Bar,
  mounted () {
    this.renderChart(data, {})
  }
}
</script>