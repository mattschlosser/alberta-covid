<template>
    <quick-chart
        :all-data="allData"
        keyed-by="name"
        :modes="modes"
        init-category=0
        init-mode="active cases"
    />
</template>
<script>
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    }, 
    async created() {
        let allData = await  import("../../data/dailyCaseCounts.json").then(r=>r.default);
        /* eslint-disable-next-line */
        let allAllData = await import("../../data/allCaseCounts.json").then(r=>r.default);
        console.log(allAllData);
        allData.sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
        allData.forEach((e) => {
            e.data.forEach((e,i,a) => { 
                if (!i) return;
                e["net change"] = e["active cases"] - a[i-1]["active cases"]
            });
        })
        this.allData = allData;
    }, 
    data() {
        return {
            allData: [],
            modes: [
                "net change",
                "active cases",
                "current hospitalizations",
                "current ICU",
                "total deaths"
            ]
        }
    }
}
</script>