<template>
    <quick-chart
        :all-data="allData"
        keyed-by="category"
        :modes="modes"
        :friendlyModes="friendlyModes"
        :init-category="0"
        init-mode="unvaxed"
        
    >
    </quick-chart>
</template>
<script>
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    }, 
    async created() {
        let allData = await import('../../severeVaccine/all.json').then(r => r.default);
        this.allData = allData.map(f => {
            f.data = f.data.map((e,i,a) => {
                if (!i) return e;
                e.new_hospitalized = e.hospitalized - a[i-1].hospitalized;
                e.new_cases = e.cases - a[i-1].cases;
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
                "vaxed",
                "unvaxed",
                "total"
            ],
            friendlyModes: {
                "vaxed": "At Least One Dose +2 weeks",
                "unvaxed": "No Dose or < 2 weeks",
                "total": "Total",
                // "new_hospitalized": "New Hospitalized",
                // "deaths": "Total Deaths",
                // "new_deaths": "New Deaths",
            }
        }
    }
}
</script>