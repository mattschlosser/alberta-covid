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
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    }, 
    async created() {
        let allData = await import('../../municipal/all.json').then(r => r.default);
        allData.sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
        this.allData = allData;
    }, 
    data() {
        return {
            allData: [],
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