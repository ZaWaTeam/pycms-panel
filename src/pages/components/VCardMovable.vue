<template>
  <div
    class="v-card-movable"
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @mousedown="initResize"
  >
    {{ text }}
    <div class="resize-handle" @mousedown.stop="initResize"></div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: "VCardMovable",
  props: {
    text: {
      type: String,
      default: "V-Card Movable",
    },
  },
  setup() {
    const isResizing = ref(false);

    const dragStart = (event) => {
      if (!isResizing.value) {
        event.dataTransfer.setData("text/plain", event.target.textContent);
        event.target.style.opacity = "0.5";
      } else {
        event.preventDefault();
      }
    };

    const dragEnd = (event) => {
      event.target.style.opacity = "1";
    };

    const initResize = (event) => {
      if (event.target.classList.contains("resize-handle")) {
        isResizing.value = true;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
      }
    };

    const resize = (event) => {
      if (isResizing.value) {
        event.target.style.width = `${event.clientX - event.target.parentNode.offsetLeft}px`;
        event.target.style.height = `${event.clientY - event.target.parentNode.offsetTop}px`;
      }
    };

    const stopResize = () => {
      if (isResizing.value) {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
        isResizing.value = false;
      }
    };

    return { initResize, isResizing, dragStart, dragEnd };
  },
};
</script>

<style scoped>
.v-card-movable {
  background-color: lightblue;
  padding: 10px;
  border-radius: 5px;
  cursor: move;
  user-select: none;
  position: relative;
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: darkblue;
  border-radius: 50%;
  cursor: nwse-resize;
}
</style>
