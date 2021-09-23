<template>
    <div>
            
        <v-data-table :items="severeChanges" :items-per-page="-1" :headers="headers">
        </v-data-table>
        <v-data-table :items="ohNoChanges" :items-per-page="-1" :headers="ohhoHeaders">
        </v-data-table>
        <v-data-table :items="vaccineReactionChanges" :items-per-page="-1" :headers="vaccineReactionHeaders">
        </v-data-table>
    </div>
</template>

<script>;
// import QuickChart from "./Chart/QuickChart.vue";
export default {
    mounted() {

    }, 
    async created() {
        this.severe = await import('../../severe/all.json').then(r => r.default);
        this.ohno = await import('../../severeVaccine/all.json').then(r => r.default);
        this.vaccines = await import('../../data/dailyVaccineCounts.json').then(r => r.default);
        this.vaccineReaction = await import('../../vaccineReactions/all.json').then(r => r.default);
    },
    data() {
        return {
            severe: [], 
            ohno: [],
            vaccineReaction: [],
            vaccines: [],
            ohhoHeaders: [
                {
                    text: "Outcome",
                    value: "category"
                }, 
                {
                    text: "New Cases", 
                    value: 'cases',
                }, 
                {
                    text: "New Hospitialized", 
                    value: 'hospitalized'
                }, 
                {
                    text: "New Deaths", 
                    value: "deaths"
                }
            ],
            vaccineReactionHeaders: [
                {
                    text: 'Type', 
                    value: 'category'
                }, 
                {
                    text: 'New Incidents',
                    value: 'new'
                }
            ],
            headers: [
                {
                    text: 'Age', 
                    value: 'category'
                }, 
                {
                    text: 'New Hospitalizaed', 
                    value: 'new_hospitalized'
                },
                {
                    text: 'New ICU Admissions', 
                    value: 'new_icu'
                },
                {
                    text: 'New Deaths', 
                    value: 'new_deaths'
                }
            ]
        }
    },
    computed: {
        severeChanges() {
            return this.severe.map(f => {
                let dataLength = f.data.length;
                return {    
                    category: f.category,
                    new_hospitalized: f.data[dataLength - 1].hospitalized - f.data[dataLength - 2].hospitalized,
                    new_icu: f.data[dataLength - 1].icu - f.data[dataLength - 2].icu,
                    new_deaths: f.data[dataLength - 1].deaths - f.data[dataLength - 2].deaths
                }
            })
        }, 
        ohNoChanges() {
            return this.ohno.map(f => {
                let dataLength = f.data.length;
                return {
                    category: f.category,
                    cases: f.data[dataLength - 1].cases - f.data[dataLength - 2].cases,
                    hospitalized: f.data[dataLength - 1].hospitalized - f.data[dataLength - 2].hospitalized,
                    deaths: f.data[dataLength - 1].deaths - f.data[dataLength - 2].deaths
                }
            })
        },
        vaccineReactionChanges() {
            let total = 0;
            let totalCount = 0;
            let categories = this.vaccineReaction.map(f => {
                let dataLength = f.data.length;
                totalCount += f.data.slice(-1)[0].count;
                let newCount = f.data[dataLength - 1].count - f.data[dataLength - 2].count;
                total += newCount
                return {
                    category: f.category, 
                    'new': newCount
                }
            }).filter(e => e.new)
            categories.push({
                category: "Total New AEFIs",  
                'new': total
            })
            let newVaccinations = this.vaccines?.[0]?.data.slice(-2).reduce((a,e) => a ? e.Doses-a : e.Doses , 0) ?? 0
            let totalVaccinations = this.vaccines?.[0]?.data.slice(-1)[0].Doses
            categories.push({
                category: "Total New Immunizations",
                'new': newVaccinations
            })
            categories.push({
                category: "Today's Safety",
                'new' : Number(100 - total/newVaccinations*100).toFixed(3) + "%"
            })
            categories.push({
                category: "Total AEFIs",  
                'new': totalCount
            })
            categories.push({
                category: "Total Immunizations",
                'new': totalVaccinations
            })
            categories.push({
                category: "Total Safety",
                'new': Number(100 - totalCount/totalVaccinations*100).toFixed(3) + "%"
            })
            return categories;
        }
    }

}



</script>