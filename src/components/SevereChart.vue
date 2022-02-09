<template>
    <quick-chart
        :all-data="allData"
        keyed-by="category"
        :modes="modes"
        :friendlyModes="friendlyModes"
        :init-category="0"
        init-mode="deaths"
    />
</template>
<script>
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    }, 
    async created() {
        let allData = await import('../../severe/all.json').then(r =>r.default);
        this.allData = allData.map(f => {
            f.data = f.data.map((e,i,a) => {
                if (!i) return e;
                e.new_hospitalized = e.hospitalized - a[i-1].hospitalized;
                e.new_hospitalized_rate = e.new_hospitalized / Math.floor((new Date(e.x) - new Date(a[i-1].x))/1000/3600/24)/4.442
                e.new_icu = e.icu - a[i-1].icu;
                e.new_deaths = e.deaths - a[i-1].deaths;
                return e;
            })
            return f;
        })
    }, 
    data() {
        return {
            allData: [],
            modes: [
                "hospitalized",
                {
                    name: "new_hospitalized",
                    type: "bar", 
                    backgroundColor: "#6666ff"
                },
                "hospitalized_pct",
                "hospitalized_rate",
                "new_hospitalized_rate",
                "icu",
                {
                    name: "new_icu",
                    type: "bar", 
                    backgroundColor: "#66ff66"
                },
                "icu_pct",
                "icu_rate",
                "deaths",
                {
                    name: "new_deaths",
                    type: "bar", 
                    backgroundColor: "#ff6666"
                },
                "deaths_pct",
                "deaths_rate",
            ],
            friendlyModes: {
                "hospitalized": "Total Hospitalized",
                "new_hospitalized": "New Hospitalized",
                "hospitalized_pct": "% of cases Hospitalized",
                "hospitalized_rate": "Hospitalized per 100,000",
                "new_hospitalized_rate": "New Hospitilizations per 100,000",
                "icu": "Total ICU",
                "new_icu": "New ICU Admissions",
                "icu_pct": "% of cases admmitted to ICU",
                "icu_rate": "ICU per 100,000",
                "deaths": "Total Deaths",
                "new_deaths": "New Deaths",
                "deaths_pct": "% of cases resulting in death",
                "deaths_rate": "Deaths per 100,000",
            }
        }
    }
}
</script>