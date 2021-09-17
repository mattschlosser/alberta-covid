<template>
    <div>
            
        <v-data-table :items="severeChanges" :items-per-page="-1" :headers="headers">
        </v-data-table>
        <v-data-table :items="ohNoChanges" :items-per-page="-1" :headers="ohhoHeaders">
        </v-data-table>
    </div>
</template>

<script>
// import QuickChart from "./Chart/QuickChart.vue";
export default {
    mounted() {

    }, 
    async created() {
        this.severe = await import('../../severe/all.json').then(r => r.default);
        this.ohno = await import('../../severeVaccine/all.json').then(r => r.default);
    },
    data() {
        return {
            severe: [], 
            ohno: [],
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
        }
    }

}



</script>