<template>
  <div class="v-card-movable" @dragstart="dragStart" @dragend="dragEnd" draggable="true">
    {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    dragStart(event) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', this.text);
      event.target.classList.add('dragging');
    },
    dragEnd(event) {
      event.target.classList.remove('dragging');
    },
  },
};
</script>

<style>
.v-card-movable {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: move;
}
.dragging {
  opacity: 0.5;
}
</style>
