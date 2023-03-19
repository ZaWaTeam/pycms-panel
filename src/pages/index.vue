<template>
  <div className="chart-container">
    <div ref="chart" className="chart"></div>
  </div>
</template>

<script>
import {createChart} from "lightweight-charts";

export default {
  mounted() {
    const chart = createChart(this.$refs.chart, {
      width: 600,
      height: 300,
    });

    const lineSeries = chart.addLineSeries();
    lineSeries.setData([
      {time: "2019-04-11", value: 80.01},
      {time: "2019-04-12", value: 96.63},
      {time: "2019-04-13", value: 76.64},
      {time: "2019-04-14", value: 81.89},
      {time: "2019-04-15", value: 74.43},
      {time: "2019-04-16", value: 80.01},
      {time: "2019-04-17", value: 96.63},
      {time: "2019-04-18", value: 76.64},
      {time: "2019-04-19", value: 81.89},
      {time: "2019-04-20", value: 74.43},
    ]);
  },
};
</script>

<style>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.chart {
  border: 1px solid #ccc;
}
</style>
