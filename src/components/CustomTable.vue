<template>
    <v-data-table
        class="width-adjustment"
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
                {text: 'Active',      value: 'active'}, 
                {text: 'Active cases per 100k', value: 'capita'},
                {text: 'Trend',      value: 'newActive'}, 
                {text: 'Recovered',   value: 'recovered'}, 
                {text: 'New Recovieres',   value: 'newRecovered'}, 
                {text: 'Deaths',      value: 'deaths'}, 
                {text: 'New Deaths',      value: 'newDeaths'},  
                {text: 'Survival Rate',      value: 'recoveryRate', sort: (a, b) => Number(a.slice(0, -1)) < Number(b.slice(0, -1))}, 
            ], 
        }
    }
}
</script>
<style scoped>
    .width-adjustment {
        margin-left: -12px;
        margin-right: -12px;
        max-width: calc(100% + 24px)
    }
</style>