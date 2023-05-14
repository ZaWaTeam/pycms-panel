<template>
    <div class="widget-list">
        <VueDraggableNext :list="widgets">
            <div :key="(widget as WidgetData).id" v-for="widget in widgets">
                <ContentWidget
                    v-if="(widget as WidgetData).widget.id !== 'container' && (widget as WidgetData).widget.id !== 'column'"
                    @remove="widgetRemoved" @select="widgetSelect" :data="(widget as WidgetData)"
                    :selected="(selectedWidget as WidgetData)?.id === (widget as WidgetData).id"></ContentWidget>
                <ContainerWidget :data="(widget as HolderData)" :widgets="(widgetComponents as any)"
                    :selected="(selectedWidget as any)" v-if="(widget as WidgetData).widget.id === 'container'"
                    @remove="widgetRemoved" @select="widgetSelect"></ContainerWidget>
            </div>
        </VueDraggableNext>

    </div>
</template>

<script lang="ts">
import { Column, Container, HolderData, Widget, WidgetData } from './webeditor';
import ContentWidget from '@/components/ContentWidget.vue';
import { VueDraggableNext } from 'vue-draggable-next';
import ContainerWidget from '@/components/ContainerWidget.vue';

export default {
    components: {
        ContentWidget,
        VueDraggableNext,
        ContainerWidget
    },
    props: {
        nodeName: {
            required: false,
            default: "root",
            type: String,
        },
        selectedWidget: {
            required: false,
            type: Object,
        },
        widgets: {
            required: true,
            type: Array,
        },
        widgetComponents: {
            required: true,
            type: Array
        }
    },
    methods: {
        appendWidget(widget: any) {
            const genId = `WgT-${Math.floor((Math.random() * 50) + 1)}-I-${widget.id}`;

            if (widget.id === 'container' || widget.id === 'column') {
                const holderContents = this.retriveHolderSettings(widget);
                (this.widgets as HolderData[]).push({
                    id: genId,
                    contents: [],
                    settings: holderContents,
                    widget: widget,
                });
                return;
            }

            const contents = this.retriveWidgetContents(widget);
            const props = this.retriveWidgetProps(widget);

            (this.widgets as WidgetData[]).push({
                id: genId,
                props: props,
                settings: {},
                content: contents,
                editables: [],
                widget: widget,
            });
            console.log(this.widgets);
        },
        retriveHolderSettings(widget: Column | Container) {
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
        },
        retriveWidgetContents(widget: Widget) {
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
        },
        retriveWidgetProps(widget: Widget) {
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
        },
        /* Methods */
        widgetSelect(data: WidgetData) {
            this.$emit("select", data);
        },
        widgetRemoved(wid: string) {
            this.$emit("remove", wid);
        },
        isWidget(value: any) {
            return value.widget.id !== "container" && value.widget.id !== "column";
        },
        isContainer(value: any) {
            return value.widget.id === "container";
        },
        isColumn(value: any) {
            return value.widget.id === "column";
        }
    }

}
</script>