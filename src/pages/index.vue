<script setup>

import {onMounted, ref} from 'vue';
import {createChart} from 'lightweight-charts';
import {defineProps} from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'line',
  },
  data: {
    type: [1,2,3],
    required: true,
  },
  chartOptions: {
    type: Object,
  },
  seriesOptions: {
    type: Object,
  },
});
let chart;
const chartContainer = ref();

onMounted(() => {
  // Create the Lightweight Charts Instance using the container ref.
  chart = createChart(chartContainer.value);
});

onUnmounted(() => {
  if (chart) {
    chart.remove();
    chart = null;
  }
});
</script>
<template>
  <div class="lw-chart" ref="chartContainer"></div>
</template>
<style scoped>
.lw-chart {
  height: 100%;
}
</style>
