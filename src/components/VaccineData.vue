<template>
    <quick-chart
        :all-data="vaccineData"
        keyed-by="name"
        :modes="modes"
        init-category=0
        init-mode="Doses"
    />
</template>
<script>
import vaccineData from '../../data/dailyVaccineCounts.json'
// vaccineData.sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
// vaccineData[0].data.sort((a,b) => a.x < b.x ? -1 : 1)
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    }, 
    data() {
        return {
            vaccineData,
            modes: [
                "Doses"
            ]
        }
    }
}
</script>