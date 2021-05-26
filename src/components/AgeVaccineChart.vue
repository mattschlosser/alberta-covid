<template>
    <quick-chart
        :all-data="allData"
        keyed-by="age_group"
        :modes="modes"
        :friendlyModes="friendlyModes"
        init-category=4
        init-mode="total"
        
    >
    </quick-chart>
</template>
<script>
import allData from '../../ageVaccinations/all.json'
for (let category of allData) {
    // if (!i) continue;
    for (let i in category.data) {
        if (!i) continue;
        category.data[i].new_dose_1 = category.data[i].dose_1 - category.data[i-1]?.dose_1
        category.data[i].new_dose_2 = category.data[i].dose_2 - category.data[i-1]?.dose_2
        category.data[i].new_total = category.data[i].total - category.data[i-1]?.total
    }
}
import QuickChart from './Chart/QuickChart.vue'
export default {
    components: {
        QuickChart
    }, 
    data() {
        return {
            allData,
            modes: [
                "dose_1",
                {
                    name: "new_dose_1",
                    type: "bar",
                    backgroundColor: "#ff6666"
                }, 
                "dose_1_pct",
                "dose_2",
                {
                    name: "new_dose_2", 
                    type: "bar",
                    backgroundColor: "#00ff99"
                },
                "dose_2_pct",
                "total",
                {
                    name: "new_total", 
                    type: "bar",
                    backgroundColor: "#99ff00"
                },
            ],
            friendlyModes: {
                "dose_1": "Cummulative Dose 1",
                "new_dose_1": "Dose 1 Per Day",
                "dose_1_pct": "% of age category with dose 1",
                "dose_2": "Cummulative Dose 2",
                "new_dose_2": "Dose 2 Per Day",
                "dose_2_pct": "% of age category with dose 2",
                "total": "Total",
                "new_total": "Per Day"
            }
        }
    }
}
</script>