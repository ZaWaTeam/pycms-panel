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
import { ref } from 'vue';
import VCardMovable from '../components/VCardMovable.vue';

export default {
  name: "dashboard",

    setInterval(() => {
      this.update()
    }, 5000)
  },
}
</script>
