<template>
    <quick-chart
        :all-data="variantData"
        keyed-by="name"
        :modes="modes"
        :friendly-modes="friendlyModes"
        init-category=0
        init-mode="B.1.1.7"
    />
</template>
<script>
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    }, 
    async created() {
        let variantData = await import('../../data/dailyVariantCounts.json').then(r => r.default);
        variantData[0].data.sort((a,b) => a.x < b.x ? -1 : 1)
        this.variantData = variantData;
    }, 
    data() {
        return {
            variantData: [],
            modes: [
                "B.1.1.7",
                "B.1.351",
                "B.1.617",
                "P.1",
                "Kappa",
                "Omicron",
                "total"
            ], 
            friendlyModes: {
                "B.1.1.7": "B.1.1.7 (Alpha)",
                "B.1.351": "B.1.351 (Beta)",
                "B.1.617": "B.1.617 (Delta)",
                "P.1": "P.1 (Gamma)",
                "Kappa": "B.1.617.1 (Kappa)",
                "Omicron": "B.1.1.529 (Omicron)",
                "total": "total"
            }
        }
    }
}
</script>
