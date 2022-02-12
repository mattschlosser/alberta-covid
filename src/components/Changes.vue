<template>
    <div>
        <v-row>
            <v-col sm="12" md="6">
                <v-card>
                    <v-card-title>
                        By Vaccination Status
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :items="ohNoChanges" :items-per-page="-1" :headers="ohhoHeaders">
                        </v-data-table>
                        The follwoing numbers are based on <b>today's</b> data only. They can vary widely. 
                        <v-row class="pa-3" no-gutters>
                          <v-col cols="4">
                        <v-card style="height: 100%;" class="green">
                            <v-card-title>
                            {{ vaccineEffectiveness }}%
                            </v-card-title> 
                            <v-card-text>
                            effective against infection
	                    </v-card-text>
                        </v-card>
                        </v-col>
                        <v-col cols="4">	
                        <v-card style="height: 100%;" class="orange">
                            <v-card-title>
                            {{ vaccineEffectivenessHosp }}%
                            </v-card-title> 
                            <v-card-text>
                            effective against hospitalization
	                    </v-card-text>
                        </v-card>
                        </v-col>
                        <v-col>	
                        <v-card style="height: 100%;" class="red">
                            <v-card-title>
                            {{ vaccineEffectivenessDeath }}%
                            </v-card-title> 
                            <v-card-text>
                            effect against death
	                    </v-card-text>
                        </v-card>
	                </v-col>
                        </v-row>	
                        <div class="journal">
                            <p><b>Definitions:</b></p>
                            <p><b>Vaccinated</b> individuals are those who have at least one dose administered more than two seeks ago.</p>
                            <p><b>Unvaccinated</b> individuals are those who have no dose, or had one dose administerd less than two weeks ago</p>
                            <p><b>How to interpret this data:</b></p>
                            <p><b>Unvaccinated</b> individuals make up {{unvaccinatedPercent}}% of the population, so they are {{unvaccinatedRisk.timesTheVaccine}} times less common than their vaccianted counterparts, but
                            make up {{unvaccinatedRisk.timesTheCases}}% more cases compared to vaccianted individuals, meaning they  are  {{unvaccinatedRisk.factor}} times more likely to test positive for the virus.</p>  
                            <p><b>Vaccinated</b> individuals make up {{vaccinatedPercent}}% of the population, so they are {{unvaccinatedRisk.timesTheVaccine}} times more common than their unvaccinated counterparts, 
                            but have {{unvaccinatedRisk.timesTheCases*100}}% less cases, compared to unvaccinated individuals, meaning they are   {{unvaccinatedRisk.factor}} times less likely to test postiive for the virus</p>
                            <p>Based on today's data only, the vaccines are generally {{vaccineEffectiveness}}% effective against infection. 
                                meaning {{vaccineEffectiveness}}% of the time when a vaccinated individual is exposted to the virus, 
                                they do not become infected. 
                            </p>
                        </div>
                        
                             
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col sm="12" md="6">
                <v-card>
                    <v-card-title>New Severe Outcomes</v-card-title>
                    <v-card-text>
                        <v-data-table :items="severeChanges" :items-per-page="-1" :headers="headers">
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col sm="12" md="6">
                <v-card>
                    <v-card-title>
                        New Deaths by Region
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :items="newDeathRegions" :items-per-page="-1" :headers="newDeathRegionHeaders">
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col sm="12" md="6">
                <v-card>
                    <v-card-title>
                        New AEFIs
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :items="vaccineReactionChanges" :items-per-page="-1" :headers="vaccineReactionHeaders">
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
            <template v-for="variant in dailyDiffs">
                <v-col sm="12" md="6"  :key="variant.name">
                    <v-card>
                        <v-card-title>
                            New {{variant.name}} Cases
                        </v-card-title>
                        <v-card-text>
                            This is a breakdown of the {{variant.data.reduce((a,e)=>a+e.y,0)}} new {{variant.name}} cases
                            <v-data-table :items="variant.data" :items-per-page="-1" :headers="variantHeaders">
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </template>
            
        </v-row>
    </div>

</template>

<script>;
import VaccineData from './VaccineData.vue';
import {round} from './../../lib/utils';
// import QuickChart from "./Chart/QuickChart.vue";
export default {
  components: { VaccineData },
    mounted() {

    }, 
    async created() {
        this.severe = await import('../../severe/all.json').then(r => r.default);
        this.ohno = await import('../../severeVaccine/all.json').then(r => r.default);
        this.vaccines = await import('../../data/dailyVaccineCounts.json').then(r => r.default);
        this.vaccineReaction = await import('../../vaccineReactions/all.json').then(r => r.default);
        this.local = await import('../../local/all.json').then(r => r.default);
        this.stats = await import('../../data/dailyCaseCounts.json').then(r => r.default)
        this.dailyDiffs = await import("../../data/dailyDiffs.json").then(r => r.default);
    },
    data() {
        return {
            severe: [], 
            ohno: [],
            dailyDiffs: [],
            vaccineReaction: [],
            local: [], 
            vaccines: [],
            stats: [], 
            variantHeaders: [
                {
                    text: "Date", 
                    value: 'x'
                }, 
                {
                    text: "Difference", 
                    value: 'y'
                }, 
                {
                    text: "New Total for Day", 
                    value: 'total'
                }
            ], 
            newDeathRegionHeaders: [
                {
                    text: "Region", 
                    value: 'region'
                }, 
                {
                    text: "New Deaths", 
                    value: "new_deaths"
                }, 
                {
                    text: "Total Deaths", 
                    value: "deaths"
                }
            ], 
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
                    text: 'Proportion Adjusted for Population', 
                    value: "caseRiskFactor"
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
        vaccinatedPercent() {
            let category = this.stats.find(e => e.name == "Alberta");
            if (category) {
                let dataLength = category.data.length;
                return category.data[dataLength-1]['12+ population with 1 dose'];
            } else {
                return 0;
            }
        }, 
        unvaccinatedPercent() {
            return round(100 - this.vaccinatedPercent, 2)
        },
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
        newDeathRegions() {
            return this.local.map(f => {
                let dataLength = f.data.length;
                return {    
                    region: f.name,
                    new_deaths: f.data[dataLength - 1].deaths - f.data[dataLength - 2].deaths, 
                    deaths: f.data[dataLength - 1].deaths
                }
            }).filter(e => e.new_deaths > 0)
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
            }).map((e, i,  a) => {
                let total = a.find(e => e.category === 'Total') 
                let unvax = a.find(e => e.category === 'Unvaccinated');
                let vax = a.find(e => e.category === 'Vaccinated');
                if (e.category == "Unvaccinated") {
                    e.timesTheCases = round(e.cases/vax.cases, 2);
                    e.timesTheVaccine = round(this.vaccinatedPercent / this.unvaccinatedPercent, 2);
                    e.timesTheHosp = round(e.hospitalized/vax.hospitalized, 2);
                    e.timesTheDeath = round(e.deaths/vax.deaths, 2);
                    e.caseRiskFactor = round(e.timesTheCases * e.timesTheVaccine, 2);
                    e.hospRiskFactor = round(e.timesTheHosp * e.timesTheVaccine, 2);
                    e.deathRiskFactor = round(e.timesTheDeath * e.timesTheVaccine, 2); 
                } else if (e.category == "Vaccinated") {
                    e.timesTheCases = round(e.cases/unvax.cases, 2);
                    e.timesTheVaccine = round(this.unvaccinatedPercent / this.vaccinatedPercent, 2);
                    e.caseRiskFactor = round(e.timesTheCases * e.timesTheVaccine, 2);
                } else {
                    e.timesTheCases = 1;
                    e.timesTheVaccine = 1;
                    e.caseRiskFactor = 1;
                }
                return e
            })
        },
        unvaccinatedRisk() {
            let x = this.ohNoChanges.find(e => e.category == "Unvaccinated") ?? {};
            return {
                
                timesTheCases: x.timesTheCases ?? 0, 
                timesTheVaccine: x.timesTheVaccine ?? 0,
                factor: x.caseRiskFactor ?? 0, 
                hospFactor: x.hospRiskFactor ?? 0, 
                deathFactor: x.deathRiskFactor ?? 0
            }
        }, 
        vaccinatedRisk() {
            let x= this.ohNoChanges.find(e => e.category == "Vaccinated") ?? {};
            return {
                timesTheCases: x.timesTheCases ?? 0, 
                timesTheVaccine: x.timesTheVaccine ?? 0,
                factor: x.caseRiskFactor ?? 0, 
            }
        }, 
        vaccineEffectiveness() {
            return Math.round((100 - 1/this.unvaccinatedRisk.factor * 100) * 100) /100;
        }, 
        vaccineEffectivenessHosp() {
            return Math.round((100 - 1/this.unvaccinatedRisk.hospFactor * 100) * 100) / 100;
        }, 
        vaccineEffectivenessDeath() {
            return Math.round((100 - 1/this.unvaccinatedRisk.deathFactor * 100) * 100) / 100;
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
<style scoped>
.journal {
    font-size: 1.5rem;
    line-height: 2rem;
}
</style>
