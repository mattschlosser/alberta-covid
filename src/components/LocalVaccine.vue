<template>
    <quick-chart
        v-if="allData.length"
        :all-data="allData"
        keyed-by="place"
        :modes="modes"
        init-category=1
        init-mode="75+"
    />
</template>
<script>
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    },
    async created() {
        let allData = await import("../../localVaccine/all.json").then(r=>r.default);;
        allData.sort((a,b) => a.place < b.place ? -1 : a.place > b.place ? 1 : 0)
        this.allData = allData.map(place => {
            let x = place;
            let seen = {};
            x.data = place.data.map(f => {
                let i = f;
                if (seen[i.x]) {
                    return null;
                } else {
                    seen[i.x] = true;
                }
                return i;
            }).filter(e => e!==null);
            return x;
        });
    }, 
    data() {
        return {
            allData: [],
            modes: [
                "75+",
                "60-74",
                "40-59",
                "20-39",
                "12-19", 
                "12+", 
                "All ages"
            ]
        }
    }
}
</script>