<template>
  <div id="app">
    <div class="sidebar">
      <h2>Components</h2>
      <VCardMovable :text="'Drag me!'" />
    </div>
    <div class="main" @dragover.prevent @drop="drop">
      <h2>Canvas</h2>
      <VCardMovable v-for="(component, index) in canvasComponents" :key="index" :text="component.text" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import VCardMovable from './components/VCardMovable.vue';

export default {
  name: 'App',
  components: {
    VCardMovable,
  },
  setup() {
    const canvasComponents = ref([]);

    function drop(event) {
      const text = event.dataTransfer.getData("text/plain");

      // Check if the element already exists in the canvasComponents array
      const elementExists = canvasComponents.value.some(component => component.text === text);

      if (elementExists) {
        alert('Element already exists in the canvas area!');
      } else {
        canvasComponents.value.push({ text });
      }
    }

    return { canvasComponents, drop };
  },
};
</script>

<style>
#app {
  display: flex;
  height: 100vh;
}
.sidebar,
.main {
  padding: 20px;
  box-sizing: border-box;
}
.sidebar {
  background-color: #f0f0f0;
  width: 300px;
}
.main {
  flex-grow: 1;
}
</style>
