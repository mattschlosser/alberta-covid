<template>
    <quick-chart
        :all-data="allData"
        keyed-by="category"
        :modes="modes"
        :friendlyModes="friendlyModes"
        :init-category="0"
        init-mode="count"
        
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
        let allData = await import('../../vaccineReactions/all.json').then(r => r.default);
        this.allData = allData.map(f => {
            f.data = f.data.map((e,i,a) => {
                if (!i) return e;
                e[`new`] = {x: e.x, y: e.count - a[i-1].count}
                return e;
            })
            f.data.forEach(datum => {
              Object.keys(datum).forEach(key => {
               if (key !== 'new' && key !== 'x') {
                 datum[key] = {x: datum.x, y: datum[key]}
               }
             })
            });
            return f;
        })
    }, 
    data() {
        return {
            allData: [],
            modes: [
                "count",
                {
                    name: "new",
                    type: "bar", 
                    backgroundColor: "#99ff66"
                },
            ],
            friendlyModes: {
                "count": "Count",
                "new": "New"
            }
        }
    }
}
</script>
