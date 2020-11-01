<template>
    <div style="width: 50%; margin: 0 auto;">
        <div class='full-width'>
            <LineChart />
        </div>
    </div>
</template>
<script>
import LineChart from './LineChart.vue'
export default {
    components: {
        LineChart
    }
}
</script>
<style>
.full-width {
    width: 100%;
}
</style>