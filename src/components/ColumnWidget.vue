<template>
    <VCol :cols="(data.settings as any)?.colSize.value" class="widget widget-holder"
        :class="{ 'dragging-widget': draggedIn, 'widget-selected': selected?.id === data?.id }" @dragenter="dragEntered"
        @dragover.prevent @drop="addItemContainer" @dragleave="dragLeft" :id="props.data.id">
        <div class="holder-tools">
            <button class="holder-tool-button" @click="widgetSelect">
                <Icon color="#fff" icon="tabler-click"></Icon>
            </button>
            <button class="holder-tool-delete" @click="widgetRemoved(data.id)">
                <Icon color="#fff" icon="tabler-trash"></Icon>
            </button>
        </div>
        <VueDraggableNext :list="data.contents">
            <div :key="(widget as WidgetData).id" v-for="widget in data.contents">
                <ContentWidget
                    v-if="(widget as WidgetData).widget.id !== 'container' && (widget as WidgetData).widget.id !== 'column'"
                    @remove="widgetRemoved" @select="widgetSelected" :data="(widget as WidgetData)"
                    :selected="(selected as WidgetData)?.id === (widget as WidgetData).id"></ContentWidget>
                <ContainerWidget :data="(widget as HolderData)" :widgets="widgets" :selected="(selected as any)" v-else
                    @select="widgetSelected"></ContainerWidget>
            </div>
        </VueDraggableNext>
        <h3 class="text-center" v-if="data.contents.length === 0">COLUMN</h3>
    </VCol>
</template>

<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next';
import ContentWidget from './ContentWidget.vue';
import ContainerWidget from './ContainerWidget.vue';
import { Icon } from '@iconify/vue';
import { Container, ColumnData, HolderData, Widget, WidgetData } from '@/views/webeditor';

const props = defineProps<{
    data: ColumnData,
    selected: WidgetData | HolderData,
    widgets: (Widget | Container)[],
}>();

const draggedIn = ref(false);

const emits = defineEmits<{
    (event: 'select', data: any): void,
    (event: 'remove', wid: any): void,
}>();

/* Methods */
const appendWidget = (widget: any) => {
    if (widget.id === 'column') {
        return;
    }

    const genId = `WgT-${Math.floor((Math.random() * 50) + 1)}-I-${widget.id}`;
    if (widget.id === 'container') {
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

const retriveHolderSettings = (widget: Container) => {
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
    position: relative;
}

.widget .holder-tools {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    padding: 0;
    margin: 0;
}

.widget .holder-tool-delete {
    overflow: hidden;
    height: 0;
    width: 30px;
    transition: height .5s ease;
    background-color: red;
    color: white;
    fill: white;
    border-radius: 0 0 8px 0;
}

.widget .holder-tool-delete path {
    stroke: white;

}

.widget:hover .holder-tool-delete {
    height: 30px;
}

.widget .holder-tool-button {
    overflow: hidden;
    height: 0;
    width: 30px;
    transition: height .5s ease;
    background-color: rgb(var(--v-theme-secondary));
    color: white;
}

.widget:hover .holder-tool-button {
    height: 30px;
}

.widget-holder {
    padding: 1rem;
}

.dragging-widget::after {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    background-color: cyan;
}</style>