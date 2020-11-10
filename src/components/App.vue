<template>
  <v-app>
    <v-main>
        <v-container fluid> 
            <v-layout row reverse>
                <v-flex md12 lg9>
                    <div style="postion: sticky; top: 0; margin: 0 auto; width: 100%; max-height: 100vh" 
                        :style="{width: autoWidth}">
                        <LineChart :chart-data="chartData" />
                    </div>  
                </v-flex>
                <v-flex md12 lg3 align-self-start style="overflow: auto; max-height: 100vh; margin: 0px;">
                    <v-list subheader>
                        <v-subheader>Mode</v-subheader>
                        <v-list-item
                        v-for="mode in modes"
                        :key="mode"
                        @click="selectedMode = mode"
                        :style="{
                            'font-weight': selectedMode == mode ? 'bold' : 'normal',
                        }"
                        >
                        <v-list-item-title>
                            {{ mode }}
                        </v-list-item-title>
                        </v-list-item>
                    </v-list>
                    <v-list subheader>
                        <v-subheader>Region</v-subheader>
                        <v-list-item
                        v-for="{ name } in names"
                        :key="name"
                        @click="selected = name"
                        >
                        <v-list-item-title>
                            <b v-if="selected == name">
                            {{ name }}
                            </b>
                            <span v-else>
                            {{ name }}
                            </span>
                        </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-flex>
            </v-layout>
        </v-container>
    </v-main>
  </v-app>
</template>
<script>
import LineChart from "./LineChart.vue";
import data from "../../local/all2.json";
let x = data.find((e) => e.name.match(/Bonnie/));
let d = x.data.map((data) => ({ x: data.x, y: data.active }));
console.log(d);
export default {
  components: {
    LineChart,
  },
  data() {
    return {
      allData: data,
      modes: ["cases", "active", "recovered", "deaths"],
      selectedMode: "cases",
      selected: "Edmonton - Bonnie Doon",
    };
  },
  computed: {
    autoWidth() {
        switch (this.$vuetify.breakpoint.name) {
            case 'xl': return '25%';
            case 'lg': return '55%';
            case 'md': return '75%';
            case 'sm': return '100%';
        }
        return '100%';
    },
    names() {
      let names = this.allData.map((e) => ({ name: e.name }));
      names.sort((a, b) => a.name > b.name);
      return names;
    },
    selectedData() {
      return this.allData
        .find((e) => e.name === this.selected)
        ?.data.map((data) => ({ x: data.x, y: data[this.selectedMode] }));
    },
    chartData() {
      return {
        datasets: [
          {
            label: "Count",
            backgroundColor: "#f87979",
            data: this.selectedData,
          },
        ],
      };
    },
  },
};
</script>