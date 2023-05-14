<template>
    <div class="widget" :class="{ 'widget-selected': props.selected }" @click="widgetSelect" :id="props.data.id">
        <button class="widget-tool-delete" @click="widgetDelete"><Icon color="#fff" icon="tabler-trash"></Icon></button>
        <div v-html="renderHandler"></div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { findReplaceCodesByKey, getValueFromString } from '@/@core/utils/unitwidgets';
import { WidgetData } from '@/views/webeditor';

const props = defineProps<{
    data: WidgetData,
    selected: boolean,
}>();

const content = ref("");

const emits = defineEmits<{
    (event: 'select', data: WidgetData, e: Event): void,
    (event: 'remove', wid: string): void,
}>();

// Computeds
const renderHandler = computed(() => {
    let renderer = props.data.widget.renderContent(props.data.content as any);
    let appearance = props.data.widget.appearanceContent ? props.data.widget.appearanceContent(props.data.props as any) : undefined;

    // Render Appearance Content
    if (appearance) {
        appearance = appearance.replaceAll('instance', `#${props.data.id}`);
        // Go though loop to replace all props shortcodes
        for (const obj in props.data.props) {
            appearance = appearance.replaceAll(`[${obj}]`, (props.data.props as any)[obj].value);

            const unitsProcessor = unitsWidgetsProcessor(obj, appearance);
            if (unitsProcessor) {
                appearance = unitsProcessor;
            }
        }

        renderer += `\n${appearance}`;
    }

    // Go though loop to replace all content shortcodes
    for (const obj in props.data.content) {
        const refrence = (props.data.widget.settingTypes as any)?.mainContentEditable;

        if (refrence?.target === obj) {
            renderer = renderer.replaceAll(`[${obj}]`, `<div contenteditable="${props.selected}" id="edt-${props.data.id}">${(props.data.content as any)[obj].value}</div>`);

        }
        else {
            renderer = renderer.replaceAll(`[${obj}]`, (props.data.content as any)[obj].value);
        }
    }



    if ((props.data.props as any).customStyles) {
        let customStyles = `\n<style>${(props.data.props as any).customStyles.value}</style>`;
        customStyles = customStyles.replaceAll(`.instance`, `#${props.data.id}`);
        customStyles = customStyles.replaceAll(`body`, `.editor-content`);
        renderer += customStyles;
    }


    return renderer;
})

const unitsWidgetsProcessor = (obj: string, rn: string) => {
    const propObject = (props.data.props as any)[obj];
    if (propObject.type.split(":")[0] === "dimension") {
        const instance = (props.data.widget.settingTypes as any)[obj];
        const process = processDimension(obj, propObject, instance, rn);
        
        return process;
    }
    return undefined;
}

const processDimension = (name: string, obj: any, instance: any, rn: string) => {
    const dimensions = getValueFromString(instance.type);
    let values: Array<number> = obj.value;

    if (values.length !== dimensions) {
        values = []

        for (let i = 0; i++; i < (dimensions as number)) {
            values.push(0);
        }
    }
    const codes = findReplaceCodesByKey(rn, name);
    codes.forEach((code) => {
        if (typeof code === "number") {
            rn = rn.replaceAll(`[${name}:${code}]`, values[code - 1].toString());
        }
        else if (code === "unit") {
            rn = rn.replaceAll(`[${name}:unit]`, obj.unit);
        }
    })

    return rn;
    
}



/* Methods */
const widgetSelect = (event: Event) => {
    emits("select", props.data, event);
    const refrence = (props.data.widget.settingTypes as any)?.mainContentEditable;

    if (refrence && props.selected) {
        const elem = document.getElementById(`edt-${props.data.id}`);
        // Contenteditable listeners
        elem?.addEventListener("input", widgetContent.bind(this));
        elem?.addEventListener("blur", widgetUpdated.bind(this))
    }
}
const widgetDelete = (event: Event) => {
    emits("remove", props.data.id);
}
const widgetContent = (event: Event) => {
    // @ts-ignore
    content.value = event.target.innerHTML;
}
const widgetUpdated = () => {
    /*
    {
        mainContentEditable: {
            type: "insideSettings",
            target: "(target content)",
        }
    }
    */
    console.log("Test");
    const refrence = (props.data.widget.settingTypes as any)?.mainContentEditable;
    if (refrence) {
        (props.data.content as any)[refrence.target].value = content.value;

    }
}

</script>

<style lang="scss">
.widget {
    position: relative;
    border: 2px dashed rgba(211, 211, 211, 0.444);
    transition: .5s ease;
    width: 100%;
    cursor: pointer;

    ol {
        list-style: decimal;
        padding-left: 1.5rem;
    }

    ul {
        list-style: circle;
        padding-left: 1.5rem;
    }
}

.widget .widget-tool-delete {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    height: 0;
    width: 30px;
    transition: height .5s ease;
    background-color: red;
    color: white;
    fill: white;
    border-radius: 0 0 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.widget .widget-tool-delete path {
    stroke: white;

}
.widget:hover .widget-tool-delete {
    height: 30px;
}

.widget:hover {
    border-color: cyan;
    opacity: 1;
}

.widget-selected {
    border-color: cyan;
    opacity: 1;
    padding: 0.5rem;
}

p {
    padding: 0;
    margin: 0;
}

div {
    outline: none;
}
</style>