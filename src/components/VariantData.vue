<template>
    <quick-chart
        :all-data="variantData"
        keyed-by="name"
        :modes="modes"
        init-category=0
        init-mode="B.1.1.7"
    />
</template>
<script>
import variantData from '../../data/dailyVariantCounts.json'
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
                "B.1.1.7",
                "B.1.351",
                "P.1",
                "total"
            ]
        }
    }
}
</script>