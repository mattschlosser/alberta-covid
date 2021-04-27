<template>
    <quick-chart
        :all-data="allData"
        keyed-by="category"
        :modes="modes"
        :friendlyModes="friendlyModes"
        init-category=0
        init-mode="deaths"
        
    >
    <template #note>
        On April 27, 2021, AHS adjusted the number of deaths, decreasing the total for all ages by 14 after further review of past cases, deeming that COVID was not a contributing factor for those 14 deaths. 
    </template>
    </quick-chart>
</template>
<script>
import allData from '../../severe/all.json'
import QuickChart from './Chart/QuickChart.vue'
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
            ],
            friendlyModes: {
                "hospitalized": "Hospitalized",
                "hospitalized_pct": "% of cases Hospitalized",
                "hospitalized_rate": "Hospitalized per 100,000",
                "icu": "ICU",
                "icu_pct": "% of cases admmitted to ICU",
                "icu_rate": "ICU per 100,000",
                "deaths": "Deaths",
                "deaths_pct": "% of cases resulting in death",
                "deaths_rate": "Deaths per 100,000",
            }
        }
    }
}
</script>