<template>
  <div class="d-flex justify-center align-center">
    <v-card class="mx-2" max-width="350" outlined>
      <v-card-title class="text-center">
        CPU Usage
      </v-card-title>
      <v-card-text>
        <v-progress-circular
          :rotate="360"
          :size="120"
          :width="12"
          :model-value="cpuUsage"
          color="primary"
          class="mx-auto"
        >
          {{ cpuUsage }}%
        </v-progress-circular>
      </v-card-text>
    </v-card>
    <v-card class="mx-2" max-width="350" outlined>
      <v-card-title class="text-center">
        Memory Usage
      </v-card-title>
      <v-card-text>
        <v-progress-circular
          :rotate="360"
          :size="120"
          :width="12"
          :model-value="memoryUsage"
          color="primary"
          class="mx-auto"
        >
          {{ memoryUsage }}%
        </v-progress-circular>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cpuUsage: 0,
      memoryUsage: 0
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('http://localhost:5000/api/admin/sysinfo')
        .then(response => {
          this.cpuUsage = response.data.cpu;
          let usedMemory = parseInt(response.data.memory.used);
          let totalMemory = parseInt(response.data.memory.total);
          this.memoryUsage = Math.round((usedMemory / totalMemory) * 100);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }
}
</script>
