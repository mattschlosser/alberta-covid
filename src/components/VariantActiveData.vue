<template>
    <quick-chart
        :all-data="variantData"
        keyed-by="name"
        :modes="modes"
        :init-category="0"
        init-mode="Active"
    />
</template>
<script>
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart  
    }, 
    async created() {
        let variantData = await import('../../data/dailyVariantActiveDiedRecoveredCounts.json').then(r => r.default);
        variantData[0].data.sort((a,b) => a.x < b.x ? -1 : 1)
        this.variantData = variantData;
    }, 
    data() {
        return {
            variantData: [],
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