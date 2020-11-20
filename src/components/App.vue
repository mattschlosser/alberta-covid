<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <div>
          <v-tabs v-model="tab">
            <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in items" :key="item">
              <template v-if="item == 'Chart'">
                <v-layout row reverse>
                  <v-flex md12 lg9>
                    <QuickStats :stats="stats" />
                    <div
                      style="
                        postion: sticky;
                        top: 0;
                        margin: 0 auto;
                        width: 100%;
                        max-height: 100vh;
                      "
                      :style="{ width: autoWidth }"
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
              <template v-if="item == 'Summary'">
                <div class="p-3">Here is a summary of today's stats.</div>
                <custom-table :chart-data="todaysSummary" />
              </template>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import LineChart from "./LineChart.vue";
import QuickStats from "./QuickStats.vue";
import data from "../../local/all2.json";
import CustomTable from "./CustomTable.vue";
let x = data.find((e) => e.name.match(/Bonnie/));
let d = x.data.map((data) => ({ x: data.x, y: data.active }));
console.log(d);
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
    LineChart,
    QuickStats,
    CustomTable,
  },
  data() {
    return {
      tab: "Chart",
      items: ["Chart", "Summary", "Other"],
      allData: data,
      modes: ["cases", "active", "recovered", "deaths"],
      selectedMode: "cases",
      selected: ["Edmonton - Bonnie Doon (& Nearby Neighbourhoods)"],
    };
  },
  computed: {
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
        let today = diffs[1];
        x.active = today.active;
        x.cases = today.cases;
        x.recovered = today.recovered;
        x.deaths = today.deaths;
        x.newActive = today.active - yesterday.active;
        x.newRecovered = today.recovered - yesterday.recovered;
        x.newDeaths = today.deaths - yesterday.deaths;
        x.newCases = today.cases - yesterday.cases;
        return x;
      });
    },
    stats() {
      return this.mergedData.slice(-1)[0];
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
<style scoped>
.p-3 {
  padding: 30px;
}
</style>