<template>
    <quick-chart
        :all-data="allData"
        keyed-by="name"
        :friendly-modes="friendlyModes"
        :modes="modes"
        :init-category="0"
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
        let newCases = allAllData[0].x.reduce((a,e,i) => {
            if (!i) {
                a[e] = {x: new Date(e), y: 0};
            } else {
                a[e] = {x: new Date(e), y: allAllData[0].y[i] - allAllData[0].y[i-1]};
            }
            return a;
        }, {})
        allData.sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
        allData.forEach((e) => {
            e.data.forEach((e,i,a) => { 
                if (!i) return;
                e["new cases"] = newCases[e.x];
                e["net change"] = {x: new Date(e.x), y: e["active cases"] - a[i-1]["active cases"]};
                e["new deaths"] = {x: new Date(e.x), y: e["total deaths"] - a[i-1]["total deaths"]};
            });
            e.data.forEach(e => {
                e["active cases"] = {x: new Date(e.x), y: e["active cases"]};
                e["current hospitalizations"] = {x: new Date(e.x), y: e["current hospitalizations"]};
                e["total deaths"] = {x: new Date(e.x), y: e["total deaths"]};
                e["current ICU"] = {x: new Date(e.x), y: e["current ICU"]};
            });
        })
        this.allData = allData;
    }, 
    data() {
        return {
            allData: [],
            modes: [
                {
                    name: "new cases",
                    type: "bar",
                    backgroundColor: "#ff6666"
                }, 
                "net change",
                "active cases",
                "current hospitalizations",
                "current ICU",
                "total deaths",
                {
                    name: "new deaths",
                    type: "bar",
                    backgroundColor: "#66ff66"
                }, 
            ], 
            friendlyModes: {
                "new cases": "By Date Identified"
            }
        }
    }
}
</script>
