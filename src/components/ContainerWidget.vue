<template>
    <div class="widget widget-holder"
        :class="{ 'dragging-widget': draggedIn, 'widget-selected': selected?.id === data?.id }" @dragenter="dragEntered"
        @dragover.prevent @drop="addItemContainer" @dragleave="dragLeft" :id="props.data.id">
        <div class="holder-tools">
            <button class="holder-tool-button" @click="widgetSelect">
                <Icon color="#fff" icon="tabler-click"></Icon>
            </button>
            <button class="holder-tool-delete" @click="widgetRemoved((data as any).id)">
                <Icon color="#fff" icon="tabler-trash"></Icon>
            </button>
        </div>
        <VueDraggableNext class="d-flex row" v-if="data.contents.length" :list="data.contents">
            <template :key="(widget as WidgetData).id" v-for="widget in filteredWidgets">
                <ContentWidget class="w-100"
                    v-if="(widget as WidgetData).widget.id !== 'container' && (widget as WidgetData).widget.id !== 'column'"
                    @remove="widgetRemoved" @select="widgetSelected" :data="(widget as WidgetData)"
                    :selected="(selected as WidgetData)?.id === (widget as WidgetData).id"></ContentWidget>
                <ColumnWidget :widgets="widgets" @remove="widgetRemoved" @select="widgetSelected" :data="(widget as ColumnData)"
                    :selected="(selected as any)" v-else-if="(widget as WidgetData).widget.id === 'column'"></ColumnWidget>
            </template>
        </VueDraggableNext>
        <h3 class="text-center" v-else>CONTAINER</h3>

        <div class="widget-invisable-customs" v-html="renderHandler"></div>
    </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { VueDraggableNext } from 'vue-draggable-next';
import ContentWidget from './ContentWidget.vue';
import { Column, ColumnData, HolderData, Widget, WidgetData } from '@/views/webeditor';
import ColumnWidget from './ColumnWidget.vue';
import { findReplaceCodesByKey, getValueFromString } from '@/@core/utils/unitwidgets';

const props = defineProps<{
    data: HolderData,
    selected: WidgetData | ColumnData,
    widgets: (Widget | Column)[],
}>();

const depthLimit = ref(2);

const draggedIn = ref(false);

const emits = defineEmits<{
    (event: 'select', data: any): void,
    (event: 'remove', wid: string): void
}>();

/* Computeds */
const filteredWidgets = computed(() => {
    const filter = (items: (WidgetData[] | ColumnData[]), depth: number) => {
        if (depth >= depthLimit.value) return items
        return items.map(item => {
            if ((item as ColumnData).contents) {
                // @ts-ignore
                (item as ColumnData).contents = filter((item as ColumnData).contents, depth + 1)
            }
            return item;
        })
    }
    return filter(props.data.contents, 0);
});

/* Computeds */
const renderHandler = computed(() => {
    let renderer = "";
    let appearance = props.data.widget.appearanceContent ? props.data.widget.appearanceContent(props.data.settings as any) : undefined;

    // Render Appearance Content
    if (appearance) {
        appearance = appearance.replaceAll('instance', `#${props.data.id}`);
        // Go though loop to replace all props shortcodes
        for (const obj in props.data.settings) {
            appearance = appearance.replaceAll(`[${obj}]`, (props.data.settings as any)[obj].value);

            const unitsProcessor = unitsWidgetsProcessor(obj, appearance);
            if (unitsProcessor) {
                appearance = unitsProcessor;
            }
        }

        renderer += `\n${appearance}`;
    }


    // Render Custom styles
    if ((props.data.settings as any).customStyles) {
        let customStyles = `\n<style>${(props.data.settings as any).customStyles.value}</style>`;
        customStyles = customStyles.replaceAll(`.instance`, `#${props.data.id}`);
        customStyles = customStyles.replaceAll(`body`, `.editor-content`);
        renderer += customStyles;
    }


    return renderer;
})

const unitsWidgetsProcessor = (obj: string, rn: string) => {
    const propObject = (props.data.settings as any)[obj];
    if (propObject.type.split(":")[0] === "dimension") {
        const instance = (props.data.widget.settings as any)[obj];
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
const appendWidget = (widget: any) => {
    const genId = `WgT-${Math.floor((Math.random() * 50) + 1)}-I-${widget.id}`;

    if (widget.id === 'container' || widget.id === 'column') {
        const holderContents = retriveHolderSettings(widget);
        (props.data.contents as any[]).push({
            id: genId,
            contents: [],
            settings: holderContents,
            widget: widget,
        });
        return;
    }

    const contents = retriveWidgetContents(widget);
    const widgetProps = retriveWidgetProps(widget);

    (props.data.contents as any[]).push({
        id: genId,
        props: widgetProps,
        settings: {},
        content: contents,
        editables: [],
        widget: widget,
    });

    console.log(props.data.contents);
}
const retriveWidgetContents = (widget: Widget) => {
    const settings: any = widget.settingTypes;

    let contents: any = {};
    for (const setting in settings) {
        // @ts-ignore
        if (settings[setting].category === "content") {
            contents[setting] = {
                type: settings[setting].type,
                value: settings[setting].default,
            };
        }
    }

    return contents;
}
const retriveWidgetProps = (widget: Widget) => {
    const settings: any = widget.settingTypes;

    let props: any = {};
    for (const setting in settings) {
        // @ts-ignore
        if (settings[setting].category === "appearance") {
            props[setting] = {
                type: settings[setting].type,
                value: settings[setting].default,
            };

            if (settings[setting].type.split(":")[0] === "dimension") {
                props[setting]["unit"] = settings[setting].defaultUnit;
            }
        }
    }

    return props;
}
const retriveHolderSettings = (widget: Column) => {
    const settings: any = widget.settings;

    let contents: any = {};
    for (const setting in settings) {
        // @ts-ignore
        contents[setting] = {
            type: settings[setting].type,
            value: settings[setting].default,
        };
        if (settings[setting].type.split(":")[0] === "dimension") {
            contents[setting]["unit"] = settings[setting].defaultUnit;
        }
    }

    return contents;
}

const widgetSelect = () => {
    emits("select", props.data);
};

const widgetSelected = (data: WidgetData, e?: Event) => {
    e?.stopPropagation();
    emits("select", data);
}

const widgetRemoved = (wid: string) => {
    emits("remove", wid);
}

const dragEntered = (event: DragEvent) => {
    draggedIn.value = true;
}

const dragLeft = (event: DragEvent) => {
    draggedIn.value = false;
}
const addItemContainer = (event: DragEvent) => {
    event.stopPropagation();
    draggedIn.value = false;
    console.log("CMON PLS");
    const transfareObject = JSON.parse(event.dataTransfer?.getData("text/plain") as string);

    const widget = props.widgets.map(item => item.id);
    const widgetIndx = widget.indexOf(transfareObject.id);

    if (widgetIndx === -1) {
        return;
    }

    appendWidget(props.widgets[widgetIndx]);
}

</script>

<style>
.widget-holder {
    padding: 1rem !important;
}

.widget .row {
    display: flex;
    flex-wrap: wrap;
}

.dragging-widget::after {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    background-color: cyan;
}</style>