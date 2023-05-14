<template>
    <div class="sidebar-widget-icon" @drag.prevent @dragstart="dragStart" draggable="true">
        <Icon style="width: 40px; height: 40px;" :icon="props.icon"></Icon>
        <div>
            <small class="icon-text">{{ props.name }}</small>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

/* Definitions & Declarations */
const props = defineProps<{
    id?: string,
    name: string,
    description?: string,
    icon: string,
    renderContent: Function,
    settingTypes: object,
    isEditable: boolean,
    allowEditables: boolean,
}>();


const dragStart = (event: DragEvent) => {
    event.dataTransfer?.setData("text/plain", JSON.stringify({
        id: props.id,
        name: props.name,
    }));
}


</script>

<style lang="scss">
.editor-sidebar .sidebar-widget-icon {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 1px;
    padding: 0.5rem;
    width: 100px;
    height: 100px;
    border: 1px solid grey;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: .3s ease;

    &:hover {
        transform: scale(1.03);
    }

}
.icon-text {
    overflow-y: hidden;
    text-overflow: clip;
    word-wrap: unset;
    white-space: nowrap;
    word-break: keep-all;
}

// .editor-sidebar .sidebar-widget-icon:hover {
//         transform: scale(0.5rem);
// }
</style>
