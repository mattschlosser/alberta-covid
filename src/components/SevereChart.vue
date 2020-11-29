<template>
    <quick-chart
        :all-data="allData"
        keyed-by="category"
        :modes="modes"
        init-category=0
        init-mode="deaths"
    />
</template>
<script>
import allData from '../../severe/all.json'
import QuickChart from './Chart/QuickChart'
export default {
    components: {
        QuickChart
    }, 
    data() {
        return {
            allData,
            modes: [
                "hospitalized",
                "hospitalized_pct",
                "hospitalized_rate",
                "icu",
                "icu_pct",
                "icu_rate",
                "deaths",
                "deaths_pct",
                "deaths_rate",
            ]
        }
    }
}
</script>