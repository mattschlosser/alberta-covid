<template>
    <quick-chart
        :all-data="vaccineData"
        keyed-by="name"
        :modes="modes"
        :init-category="0"
        init-mode="Doses"
    />
</template>
<script>
// vaccineData.sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
// vaccineData[0].data.sort((a,b) => a.x < b.x ? -1 : 1)
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    }, 
    async created() {
        this.vaccineData = await import('../../data/dailyVaccineCounts.json').then(r => r.default);
    }, 
    data() {
        return {
            vaccineData: [],
            modes: [
                "Doses"
            ]
        }
    }
}
</script>