<template>
    <quick-chart
        :all-data="variantData"
        keyed-by="name"
        :modes="modes"
        init-category=0
        init-mode="Active"
    />
</template>
<script>
import variantData from '../../data/dailyVariantActiveDiedRecoveredCounts.json'
variantData[0].data.sort((a,b) => a.x < b.x ? -1 : 1)
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    }, 
    data() {
        return {
            variantData,
            modes: [
                "Active",
                "Died",
                "Recovered",
                "Total"
            ]
        }
    }
}
</script>