<template>
    <quick-chart
        :all-data="allData"
        keyed-by="name"
        :modes="modes"
        init-category=0
        init-mode="active cases"
    />
</template>
<script>
import allData from '../../dailyCaseCounts.json'
allData.sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    }, 
    data() {
        return {
            allData,
            modes: [
                "active cases",
                "current hospitalizations",
                "current ICU",
                "total deaths",
            ]
        }
    }
}
</script>