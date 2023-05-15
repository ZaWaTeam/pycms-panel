<template>
    <div class="dimensions">
        <div v-if="disabled" class="disabled-overlay"></div>
        <div class="d-flex dim-inputs">
            <div v-for="i in value.length">
                <VTextField :disabled="i > 1 && isBinded" v-if="isBinded && i !== 1" type="number"
                    v-model:model-value="value[i - 1]" placeholder="0" />
                <VTextField v-else-if="isBinded && i === 1" type="number" v-model:model-value="allValues" placeholder="0" />
                <VTextField :disabled="i > 1 && isBinded" v-else-if="!isBinded" type="number"
                    v-model:model-value="value[i - 1]" placeholder="0" />
            </div>
        </div>
        <div class="d-flex">
            <VBtn :icon="isBinded ? `tabler-link` : `tabler-link-off`" @click="isBinded = !isBinded" variant="text" />
            <div class="dimension-units">
                <VRadioGroup class="d-flex" v-model:model-value="dimensionUnitUpdater">
                    <VRadio v-for="unit in form.body.units" :key="unit" :label="unit" :value="unit" />
                </VRadioGroup>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { HolderData, WidgetData } from '@/views/webeditor';

/* Component Props */
const props = defineProps<{
    disabled?: boolean,
    data: WidgetData | HolderData,
    value: number[],
    dimensionUnit: string,
    form: {
        name: string,
        body: any,
    }
}>();

/* Component Emits */
const emit = defineEmits<{
    (event: 'update:value', value: number[]): void,
    (event: 'update:dimensionUnit', value: string): void,

}>();

/* Reactivity Datas */
const isBinded = ref(true);

/* Computeds */
const allValues = computed({
    get() {
        return props.value[0];
    },
    set(newValue) {
        let vals: number[] = [];
        props.value.forEach(() => {
            vals.push(newValue);
        })
        console.log(vals);
        emit("update:value", vals);
    },
})
const dimensionUnitUpdater = computed({
    get() {
        return props.dimensionUnit;
    },
    set(newValue) {
        emit("update:dimensionUnit", newValue);
    },
})



</script>

<style lang="scss">
.dimensions {
    position: relative;
}
.dimensions .disabled-overlay {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    opacity: 0.5;
}
.v-theme--dark .dimensions .disabled-overlay {
    background: rgb(47, 51, 73);
}
.dimensions .dim-inputs {
    gap: 3px;
}
.dimensions .dimension-units {
    display: flex;
}
.dimensions .dimension-units div {
    flex-direction: row;
}
</style>