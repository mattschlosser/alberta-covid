<template>
    <div style="width: 100%; margin: 0 auto; display: flex; ">
        <div style="max-height: 100vh; overflow: auto;">
            <ul style="position: sticky; display: block; top: 0; background-color: white; margin-bottom: 20px; padding-bottom: 10px;">
                <li v-for="mode in modes" :key="mode" @click="selectedMode = mode" :class="{bold: selectedMode == mode}">
                    {{mode}}
                </li>
            </ul>
            <ul>
                <li v-for="name in names" :key="name" @click="selected = name">
                    <b v-if="selected == name">
                        {{name}}
                    </b>
                    <span v-else>
                        {{name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class='full-width'>
            <LineChart :chart-data="chartData" />
        </div>
        
    </div>
</template>
<script>
import LineChart from './LineChart.vue'
import data from '../../local/all2.json'
let x = data.find(e => e.name.match(/Bonnie/));
let d = x.data.map((data) => ({x: data.x, y: data.active}))
console.log(d);
export default {
    components: {
        LineChart
    },
    data() {
        return {
            allData: data,
            modes: ['cases', 'active', 'recovered', 'deaths'],
            selectedMode: 'cases',
            selected: "Edmonton - Bonnie Doon",
        }
    },
    computed: {
        names() {
            let names = this.allData.map(e => e.name)
            names.sort();
            return names;
        },
        selectedData() {
            return this.allData.find(e => e.name === this.selected)?.data.map(data => ({x: data.x, y: data[this.selectedMode]}))
        },
        chartData() {
            return {
                datasets: [{
                    label: 'Edmonton', 
                    backgroundColor: '#f87979',
                    data: this.selectedData,
                }]
            }
        }
    }
}
</script>
<style>
.full-width {
    width: 50%;
    max-height: 100vh;
}
.bold {
    font-weight: bolder;
}
</style>