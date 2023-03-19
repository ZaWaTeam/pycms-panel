<template>
  <div>
    <VCard title="System Information">
      <div className="d-flex justify-space-between">
        <VueApexCharts
          type="donut"
          height="410"
          :options="chartOptionsMemory"
          :series="chartSeriesMemory"
        />

        <VueApexCharts
          type="donut"
          height="410"
          :options="chartOptionsCPU"
          :series="chartSeriesCPU"
        />
      </div>
    </VCard>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import {useTheme} from 'vuetify'
import {getDonutChartConfig} from '@core/libs/apex-chart/apexCharConfig'

export default {
  components: {
    VueApexCharts,
  },
  setup() {
    const chartSeriesMemory = [1, 2]
    const chartSeriesCPU = [1, 2]

    return {
      chartSeriesMemory,
      chartSeriesCPU,
    }
  },

  computed: {
    chartOptionsMemory() {
      const vuetifyTheme = useTheme()
      const chartOptionsMemory = getDonutChartConfig(vuetifyTheme.current.value)
      chartOptionsMemory.labels = ['Memory Used', 'Memory Free']
      chartOptionsMemory.plotOptions.pie.donut.labels.total = {
        show: true,
        color: 'gray',
        fontSize: '1.5rem',
        label: 'Memory Usage',
        formatter: () => `${this.$store.state.dashboard.memoryUsed}G / ${this.$store.state.dashboard.memoryTotal}G`,
      }
      return chartOptionsMemory
    },
    chartOptionsCPU() {
      const vuetifyTheme = useTheme()
      const chartOptionsCPU = getDonutChartConfig(vuetifyTheme.current.value)
      chartOptionsCPU.labels = ['CPU Used', 'CPU Free']
      chartOptionsCPU.plotOptions.pie.donut.labels.total = {
        show: true,
        color: 'gray',
        fontSize: '1.5rem',
        label: 'CPU Usage',
        formatter: () => `${this.$store.state.dashboard.cpuUsage}% / 100%`,
      }
      return chartOptionsCPU
    },
  },

  methods: {
    async update() {
      this.$store.dispatch('fetchSystemInfo')
      const usedMemory = this.$store.state.dashboard.memoryUsed
      const totalMemory = this.$store.state.dashboard.memoryTotal
      const memoryUsedPercent = (usedMemory / totalMemory) * 100
      const memoryFreePercent = 100 - memoryUsedPercent

      const usedCPU = this.$store.state.dashboard.cpuUsage
      const totalCPU = 100
      const cpuUsedPercent = usedCPU
      const cpuFreePercent = totalCPU - cpuUsedPercent

      this.chartSeriesCPU = [cpuUsedPercent, cpuFreePercent]
      this.chartSeriesMemory = [memoryUsedPercent, memoryFreePercent]
      console.log(this.chartSeriesCPU)
    },
  },

  created() {
    this.update()

    setInterval(() => {
      this.update()
    }, 5000)
  },
}
</script>
