<template>
    <quick-chart
        :all-data="allData"
        keyed-by="name"
        :modes="modes"
        init-category=14
        init-mode="active"
    />
</template>
<script>
import allData from '../../municipal/all.json'
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
                "cases",
                "active",
                "deaths",
                "recovered"
            ]
        }
    }
}
</script>