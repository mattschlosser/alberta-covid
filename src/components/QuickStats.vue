<template>
    <v-alert>
        Recovery Rate: {{ recoveryRate }}%<br/>
        Because of all cases of which an outcome is known, {{stats.recovered}} recovered and {{stats.deaths}}
        died.
    </v-alert>
</template>
<script>
export default {
    props: {
        stats: {
            type: Object,
        }
    }, 
    computed: {
        recoveryRate() {
            return this.stats ? Number(this.stats.recovered / (this.stats.recovered + this.stats.deaths)*100).toFixed(4) : 100
        }
    }
}
</script>