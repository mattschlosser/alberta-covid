<template>
    <v-data-table
        :headers="headers"
        :items="chartData"
    >
    </v-data-table>
</template>
<script>
export default {
    props: ["chartData"], 
    data() {
        return {
            headers: [
                {text: 'Area Name',   value: 'name'}, 
                {text: 'Total Cases', value: 'cases'}, 
                {text: 'New Cases',   value: 'newCases'}, 
                {text: 'Recovered',   value: 'recovered'}, 
                {text: 'New Recovieres',   value: 'newRecovered'}, 
                {text: 'Deaths',      value: 'deaths'}, 
                {text: 'New Deaths',      value: 'newDeaths'}, 
                {text: 'Active',      value: 'active'}, 
                {text: 'New Active',      value: 'newActive'}, 
            ], 
        }
    }
}
</script>