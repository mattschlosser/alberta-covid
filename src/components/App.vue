<template>
  <v-app>
    <v-main>
      <v-app-bar app>
        <v-app-bar-nav-icon v-if="showHamburger" @click="toggleDrawer"/>
        <v-toolbar-title>
          Alberta Covid Data
        </v-toolbar-title>

      </v-app-bar>  
      <v-navigation-drawer app v-model="drawer">
        <v-list>
          <v-list-item-group v-model="tab">
            <v-list-item link v-for="item in items" :key="item">
              <v-icon class="mr-2">{{item.icon}}</v-icon>{{item.name}}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-container app fluid>
        <div>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="{name:   item} in items" :key="item">
              <template v-if="item == 'Daily Data'">
                <daily-data />
              </template>
              <template v-if="item == 'Variants (By Type)'">
                <variant-data />
              </template>
              <template v-if="item == 'Variants (Active)'">
                <variant-active-data />
              </template>
              <template v-if="item == 'Location Chart'">
                <v-layout row reverse>
                  <v-flex md12 lg9>
                    <QuickStats :stats="stats" />
                    <div
                      class="chart-container"
                      style="
                        postion: relative;
                        width: 75%;
                        margin: 0 auto;
                      "
                    >
                      <LineChart :chart-data="chartData" />
                    </div>
                  </v-flex>
                  <v-flex
                    md12
                    lg3
                    align-self-start
                    style="overflow: auto; max-height: 100vh; margin: 0px"
                  >
                    <v-list subheader>
                      <v-subheader>Mode</v-subheader>
                      <v-list-item
                        v-for="mode in modes"
                        :key="mode"
                        @click="selectedMode = mode"
                        :style="{
                          'font-weight':
                            selectedMode == mode ? 'bold' : 'normal',
                        }"
                      >
                        <v-list-item-title>
                          {{ mode }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <v-list subheader>
                      <v-subheader>Region</v-subheader>
                      <v-btn depressed block v-if='!allAreSelected' @click="selectAll">Select all</v-btn>
                      <v-btn depressed block v-else-if="selected.length" @click="deselectAll">Deselect All</v-btn>
                      <v-list-item-group multiple v-model="selected">
                        <v-list-item
                          v-for="{ name } in names"
                          :key="name"
                          :value="name"
                        >
                          <v-list-item-title>
                            {{ name }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-flex>
                </v-layout>
              </template>
              <template v-if="item == 'Location Table'">
                <v-container>
                  <v-alert class="p-3">Here is a summary of today's stats. Data was last updated on {{ lastActive }}. New numbers are new since {{ lastLastActive }}</v-alert>
                  
                  
                  <h2>
                    Of cases with location data :
                  </h2>
                  <v-simple-table style="margin-bottom: 20px">
                      <thead>
                        <th>Type</th><th>Total</th><th>Change</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>All Time Cases:</td>
                          <td>{{todaysTotalSummary.cases}} *  </td>
                          <td> ({{ todaysTotalSummary.newCases }})</td>
                        </tr>
                        <tr>
                          <td>Active:</td>
                          <td>{{todaysTotalSummary.active}} </td>
                          <td> ({{todaysTotalSummary.newActive}})</td>
                        </tr>
                        <tr>
                          <td>Recoveries:</td>
                          <td>{{todaysTotalSummary.recovered}} </td>
                          <td> ({{ todaysTotalSummary.newRecovered }})</td>
                        </tr>
                        <tr>
                          <td>Deaths:</td>
                          <td>{{todaysTotalSummary.deaths}} </td>
                          <td> ({{ todaysTotalSummary.newDeaths }})</td>
                        </tr>
                      </tbody>
                  </v-simple-table>
                  <em>* Does not include cases for which there is no location data</em>
                  <h2>
                    Summary Table
                  </h2>
                  <custom-table :chart-data="todaysSummary" />
                </v-container>
              </template>
              <template v-if="item == 'Municipal Chart'">
                <municipal-chart/>
              </template>
              <template v-if="item == 'Age Chart'">
                <age-charts/>
              </template>
              <template v-if="item == 'Severe Outcomes'">
                <severe-chart/>
              </template>
              <template v-if="item == 'Vaccine Rollout'">
                <vaccine-data/>
              </template>
              <template v-if="item == 'Vaccine Rollout (By Age)'">
                <age-vaccine-chart/>
              </template>
              <template v-if="item == 'Local Vaccine'">
                <LocalVaccine />
              </template>
              <template v-if="item == 'Changes'">
                <Changes />
              </template>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-container>
      <v-footer>
        Another site by &nbsp; <a href="https://mattschlosser.me">&nbsp;Matt Schlosser</a>
      </v-footer>
    </v-main>
  </v-app>
</template>
<script>
import LineChart from "./Chart/LineChart.vue";
import QuickStats from "./QuickStats.vue";
import data from "../../local/all2.json";
import CustomTable from "./CustomTable.vue";
import AgeCharts from './AgeCharts.vue';
import DailyData from './DailyData.vue';
import SevereChart from './SevereChart.vue';
import MunicipalChart from './MunicipalCharts.vue';
import Changes from './Changes.vue';
import VariantData from './VariantData.vue';
import LocalVaccine from './LocalVaccine.vue';
import VariantActiveData from './VariantActiveData.vue';
import VaccineData from './VaccineData.vue';
import AgeVaccineChart from './AgeVaccineChart.vue';
function merger(rest, first) {
  for (let one of first) {
    let existing = rest.find((x) => x.x == one.x);
    if (existing) {
      // merge one's value which existing's value
      let types = ["cases", "recovered", "deaths", "active"];
      types.map((mode) => {
        if (existing[mode] !== undefined || one[mode] !== undefined) {
          existing[mode] = (existing[mode] || 0) + (one[mode] || 0);
        }
      });
    } else {
      // push one's value into rest
      rest.push({ ...one });
    }
  }
  return rest;
}
export default {
  components: {
    DailyData,
    LineChart,
    QuickStats,
    CustomTable,
    AgeCharts,
    SevereChart,
    MunicipalChart,
    VariantData,
    VariantActiveData,
    VaccineData, 
    AgeVaccineChart,
    LocalVaccine,
    Changes
  },
  data() {
    return {
      drawer: false, 
      tab: 0,
      items: [{
        name: "Daily Data",
        icon: 'show_chart'
      }, 
      {
        name: "Vaccine Rollout", 
        icon: 'show_chart', 
      }, 
      {
        name: "Vaccine Rollout (By Age)", 
        icon: 'show_chart', 
      }, 
        { 
          name: "Variants (By Type)", 
          icon: 'show_chart'
        }, 
        { 
          name: "Variants (Active)", 
          icon: 'show_chart'
        }, 
        { 
          name: "Location Chart",
          icon: 'show_chart'
        }, 
        { 
          name: "Location Table",
          icon: 'table_chart'
        }, 
        { 
          name: "Municipal Chart",
          icon: 'show_chart'
        }, 
        { 
          name: "Age Chart",
          icon: 'show_chart'
        }, 
        { 
          name: "Severe Outcomes", 
          icon: 'show_chart'
        }, 
        { 
          name: "Local Vaccine", 
          icon: 'show_chart'
        }, 
        {
          name: "Changes", 
          icon: 'table_chart'
        }
      ], 
      allData: data,
      modes: ["cases", "active", "recovered", "deaths"],
      selectedMode: "cases",
      selected: ["Edmonton - Bonnie Doon (& Nearby Neighbourhoods)"],
    };
  },
  watch: {
    showHamburger: {
      handler(val) {
        if (!val) {
          this.drawer = true; 
        }
      }, 
      immediate: true
    }
  }, 
  computed: {
    showHamburger() {
      return this.$vuetify.breakpoint.name.match(/xs|sm/)
    }, 
    allAreSelected() {
      return this.selected.length == this.names.length
    }, 
    autoWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "25%";
        case "lg":
          return "55%";
        case "md":
          return "75%";
        case "sm":
          return "100%";
      }
      return "100%";
    },
    names() {
      let names = this.allData.map((e) => ({ name: e.name }));
      names.sort((a, b) => a.name > b.name);
      return names;
    },
    mergedData() {
      return this.selected
        .map((selected) => this.allData.find((e) => e.name === selected))
        .reduce((a, e) => merger(a, e.data), []);
    },
    selectedData() {
      return this.mergedData?.map((data) => ({
        x: data.x,
        y: data[this.selectedMode],
      }));
    },
    todaysSummary() {
      return this.allData.map((e) => {
        let x = { ...e };
        let diffs = x.data.slice(-2);
        let yesterday = diffs[0];
        let today = diffs[1] || yesterday;
        x.active = today.active;
        x.cases = today.cases;
        x.recovered = today.recovered;
        x.deaths = today.deaths;
        x.newActive = today.active - yesterday.active;
        x.newRecovered = today.recovered - yesterday.recovered;
        x.newDeaths = today.deaths - yesterday.deaths;
        x.newCases = today.cases - yesterday.cases;
        x.recoveryRate = x.recovered > 0 || x.deaths > 0 ? Number(today.recovered / (today.recovered + today.deaths) * 100).toFixed(2)+"%" : '-'
        return x;
      });
    },
    todaysTotals() {
      return this.allData.reduce((a,e) => {
        let last = e.data.slice(-1)[0];
        a.active += last.active;
        a.cases += last.cases;
        a.deaths += last.deaths;
        a.recovered += last.recovered;
        return a;
      }, {
        active: 0, 
        cases: 0,
        deaths: 0,
        recovered: 0
      })
    }, 
    yesterdaysTotals() {
      return this.allData.reduce((a,e) => {
        let last = e.data.slice(-2)[0];
        a.active += last.active;
        a.cases += last.cases;
        a.deaths += last.deaths;
        a.recovered += last.recovered;
        return a;
      }, {
        active: 0, 
        cases: 0,
        deaths: 0,
        recovered: 0
      })
    },
    todaysTotalSummary() {
      return {
        ...this.todaysTotals, 
        newActive: this.todaysTotals.active - this.yesterdaysTotals.active, 
        newCases: this.todaysTotals.cases - this.yesterdaysTotals.cases, 
        newDeaths: this.todaysTotals.deaths - this.yesterdaysTotals.deaths, 
        newRecovered: this.todaysTotals.recovered - this.yesterdaysTotals.recovered
      }
    }, 
    stats() {
      return {
        regions: this.selected,
        ...this.mergedData.slice(-1)[0]
      }
    },
    lastActive() {
      return this.stats.x;
    }, 
    lastLastActive() {
      return this.mergedData.slice(-2)[0].x;
    }, 
    chartData() {
      return {
        datasets: [
          {
            label: "Count",
            borderColor: "#7979f8",
            backgroundColor: "#fff0",
            data: this.selectedData,
          },
        ],
      };
    },
  },
  methods: {
    toggleDrawer() {
      console.log("CLICKED");
      this.drawer = !this.drawer;
    },
    selectAll() {
      this.selected = this.names.map(e => e.name);
    },
    deselectAll() {
      this.selected = []
    }
  }
};
</script>
<style scoped>
.p-3 {
  padding: 30px;
}
</style>
