<template>
    <VRow>
        <VCol :cols="selectedWidget ? 4 : 3">
            <VCard>
                <div v-if="!selectedWidget" class="editor-sidebar">
                    <h2 class="sidebar-title">Widgets</h2>
                    <hr>
                    <div class="sidebar-widgets">
                        <div v-for="widget in widgets" :key="widget.id">
                            <WidgetIcon id="container" name="Container" icon="tabler-box-margin"
                                :setting-types="(widget as any).settings" :is-editable="false" :allow-editables="false"
                                :render-content="widget.renderContent" v-if="widget.id === 'container'">

                            </WidgetIcon>
                            <WidgetIcon id="column" name="Column" icon="tabler-box-margin"
                                :setting-types="(widget as any).settings" :is-editable="false" :allow-editables="false"
                                :render-content="widget.renderContent" v-else-if="widget.id === 'column'">

                            </WidgetIcon>
                            <WidgetIcon v-else :setting-types="(widget as any).settingTypes"
                                :render-content="widget.renderContent" :name="(widget as any).name" :id="widget.id"
                                :icon="(widget as any).icon" :description="(widget as any).description"
                                :is-editable="(widget as any).isEditable" :allow-editables="(widget as any).allowEditables">
                            </WidgetIcon>
                        </div>
                    </div>
                </div>
                <div v-else class="editor-sidebar">
                    <div class="d-flex">
                        <button class="sidebar-menu-button"><Icon icon="tabler-menu-2"></Icon></button>
                        <h2 class="sidebar-title w-100">Selected: <b>{{ (selectedWidget as WidgetData).widget.name ||
                            selectedWidget.widget.id }}</b></h2>
                        <button class="sidebar-menu-button" @click="selectedWidget = null">
                            <Icon icon="tabler-category"></Icon>
                        </button>
                    </div>
                    <hr>
                    <div class="sidebar-widgets">

                        <HolderSettings v-if="isSettings" v-model:model-form="(selectedWidget as HolderData)"
                            id="hldSettings"></HolderSettings>
                        <WidgetSettings v-else id="widSettings" v-model:model-form="(selectedWidget as WidgetData)">
                        </WidgetSettings>
                    </div>
                </div>
            </VCard>
        </VCol>
        <VCol>
            <VCard>
                <div id="editor">
                    <!-- <div v-if="!selectedWidget" class="editor-sidebar">
                        <h2 class="sidebar-title">Widgets</h2>
                        <hr>
                        <div class="sidebar-widgets">
                            <WidgetIcon v-for="widget in widgets" :key="widget.id" :setting-types="widget.settingTypes"
                                :render-content="widget.renderContent" :name="widget.name" :id="widget.id"
                                :icon="widget.icon" :description="widget.description" :is-editable="widget.isEditable"
                                :allow-editables="widget.allowEditables"></WidgetIcon>
                        </div>
                    </div>
                    <div v-else class="editor-sidebar">
                        <h2 class="sidebar-title">Selected: <b>{{ selectedWidget.widget.name }}</b></h2>
                        <hr>
                        <div class="sidebar-widgets">
                            <WidgetSettings id="widSettings" v-model:model-form="selectedWidget"></WidgetSettings>
                        </div>
                    </div> -->
                    <div class="editor-content" :class="{ 'editor-dragged': draggedIn }" @dragenter="dragEntered"
                        @dragover.prevent @drop="addItemEditor" @dragleave="dragLeft">
                        <ListWidgets :widget-components="widgets" :widgets="widgetDatas"
                            :selected-widget="(selectedWidget as any)" @remove="widgetRemove" @select="widgetSelect" ref="listWidgets">
                        </ListWidgets>
                    </div>
                </div>
            </VCard>
        </VCol>
    </VRow>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { Icon } from '@iconify/vue';
import WidgetIcon from '@/components/WidgetIcon.vue';
import { Column, Container, HolderData, Widget, WidgetData } from './webeditor';
import ListWidgets from './ListWidgets.vue';
import WidgetSettings from '@/components/WidgetSettings.vue';
import HolderSettings from '@/components/HolderSettings.vue';

/* Datas */
const draggedIn = ref(false);
const listWidgets = ref(null);
const selectedWidget: Ref<WidgetData | HolderData | null> = ref(null);

/* Built-in widgets */
const widgets: (Widget | Container | Column)[] = [
    {
        id: "container",
        renderContent: (data) => {
            return [
                `<div class='container'>`,
                `</div>`
            ]
        },
        appearanceContent: () => `<style>
            instance .container {
                padding: [padding:1][padding:unit] [padding:2][padding:unit] [padding:3][padding:unit] [padding:4][padding:unit];
                margin: [margin:1][margin:unit] [margin:2][margin:unit] [margin:3][margin:unit] [margin:4][margin:unit];
            }
        </style>`,
        groups: [],
        settings: {
            customStyles: {
                available: true,
                hint: "Add your custom styles",
                type: "code:css",
                category: "appearance",
            },
            padding: {
                available: true,
                title: "Container Padding",
                hint: "Container inside padding",
                type: "dimension:4",
                units: ["px", "%", "em", "rem"],
                default: [10, 50, 10, 50],
                // Default unit of dimension
                defaultUnit: "px",
                category: "appearance",
            },
            margin: {
                available: true,
                title: "Container Margin",
                hint: "Container outside padding",
                type: "dimension:4",
                units: ["px", "%", "em", "rem"],
                default: [10, 50, 10, 50],
                // Default unit of dimension
                defaultUnit: "px",
                category: "appearance",
            },
        },
    },
    {
        id: "column",
        groups: [],
        renderContent: (data) => {
            return [
                `<div class='column'>`,
                `</div>`
            ]
        },
        appearanceContent: () => `<style>
            instance .container {
                padding: [padding:1][padding:unit] [padding:2][padding:unit] [padding:3][padding:unit] [padding:4][padding:unit];
                margin: [margin:1][margin:unit] [margin:2][margin:unit] [margin:3][margin:unit] [margin:4][margin:unit];
            }
        </style>`,
        settings: {
            colSize: {
                available: true,
                hint: "For grids that are the same from the smallest of devices to the largest.",
                title: "Column breakpoint",
                type: "input:number",
                category: "appearance"
            }
        },
    },
    {
        id: "btn",
        name: "Button",
        renderContent: (data) => {
            if (!data.buttonLink.value) {
                return `<button class="elem-btn">${data.content.value}</button>`;
            }
            return `
            <a href="${data.buttonLink.value}"><button class="elem-btn">${data.content.value}</button></a>
        `;
        },
        appearanceContent: (data) => `
        <style>
            instance .elem-btn {
                background-color: [background];
                color: [color];
                padding: [padding:1][padding:unit] [padding:2][padding:unit] [padding:3][padding:unit] [padding:4][padding:unit];
                margin: [margin:1][margin:unit] [margin:2][margin:unit] [margin:3][margin:unit] [margin:4][margin:unit];
                border-radius: [borderRadius:1][borderRadius:unit] [borderRadius:2][borderRadius:unit] [borderRadius:3][borderRadius:unit] [borderRadius:4][borderRadius:unit];
            }
        </style>
    `,
        icon: "tabler-square-check-filled",
        settingTypes: {
            customStyles: {
                available: true,
                hint: "Add your custom styles",
                type: "code:css",
                category: "appearance",
            },
            padding: {
                available: true,
                title: "Button Padding",
                hint: "Button inside padding",
                type: "dimension:4",
                units: ["px", "%", "em", "rem"],
                default: [10, 50, 10, 50],
                // Default unit of dimension
                defaultUnit: "px",
                category: "appearance",
            },
            margin: {
                available: true,
                title: "Button Margin",
                hint: "Button outside padding",
                type: "dimension:4",
                units: ["px", "%", "em", "rem"],
                default: [0, 0, 0, 0],
                // Default unit of dimension
                defaultUnit: "px",
                category: "appearance",
            },
            borderRadius: {
                available: true,
                title: "Button Border Radius",
                hint: "Set radius to border of button",
                type: "dimension:4",
                units: ["px", "%", "rem"],
                default: [0, 0, 0, 0],
                // Default unit of dimension
                defaultUnit: "px",
                category: "appearance",
            },
            background: {
                available: true,
                title: "Background color",
                hint: "Buttons background color in normal state",
                default: "#7367F0",
                type: "color",
                category: "appearance"
            },
            color: {
                available: true,
                title: "Font color",
                hint: "Buttons text color in normal state",
                default: "#fff",
                type: "color",
                category: "appearance"
            },
            content: {
                available: true,
                title: "Button content",
                hint: "Add your custom button text",
                type: "input:text",
                default: "Edit button's content",
                category: "content",
            },
            buttonLink: {
                available: true,
                title: "Button link",
                hint: "Add redirect link",
                type: "textarea",
                category: "content",
            }
        },
        isEditable: true,
        allowEditables: true,

    }, {
        id: "img",
        name: "Image",
        renderContent: (data) => `
        <img src="[bodyAttachment]" alt="Image" />
    `,
        icon: "tabler-photo",
        settingTypes: {
            customStyles: {
                available: true,
                hint: "Add your custom styles",
                type: "code:css",
                category: "appearance",
            },
            bodyAttachment: {
                available: true,
                hint: "Upload image",
                type: "attachment",
                default: "https://www.w3schools.com/images/img_fullaccess3_120.png",
                category: "content",
            },
        },
        isEditable: true,
        allowEditables: true,

    },
    {
        id: "paragraph",
        name: "Text",
        renderContent: () => `
        [content]
    `,
        appearanceContent: (data) => `
    <style>
        instance * {
            text-align: [textAlign];
        }
    </style>
    `,
        icon: "tabler-typography",
        settingTypes: {
            customStyles: {
                available: true,
                title: "Custom CSS",
                hint: ["Add your custom CSS styles", "Use .instance to reference current widgets class", "Avoid overriding widgets visual appearance settings", "Avoid overriding CPanel's css classes"],
                default: "",
                type: "code:css",
                category: "appearance",
            },
            content: {
                available: true,
                title: "Content",
                hint: "Add your custom content",
                default: "Add your custom content",
                type: "wswyig",
                category: "content",
            },
            textAlign: {
                available: true,
                title: "Text Alignment",
                hint: "Paragraph text alignment position",
                type: "select",
                options: ["left", "center", "right"],
                default: "left",
                category: "content",
            },
            mainContentEditable: {
                type: "insideSettings",
                target: "content",
            }
        },
        isEditable: true,
        allowEditables: true,

    },
    {
        id: "html",
        name: "Custom HTML",
        renderContent: (data) => `[content]`,
        icon: "tabler-html",
        settingTypes: {
            customStyles: {
                available: true,
                title: "Custom CSS",
                hint: ["Add your custom CSS styles", "Use .instance to reference current widgets class", "Avoid overriding widgets visual appearance settings", "Avoid overriding CPanel's css classes"],
                default: "",
                type: "code:css",
                category: "appearance",
            },
            content: {
                available: true,
                title: "Custom HTML Code",
                hint: "Add your custom HTML",
                default: "<h4>HTML</h4>",
                type: "code:html",
                category: "content",
            },
        },
        isEditable: true,
        allowEditables: true,

    },
];

const widgetDatas: Ref<any> = ref([]);

/* Methods */
const dragEntered = (event: DragEvent) => {
    draggedIn.value = true;
}

const dragLeft = (event: DragEvent) => {
    draggedIn.value = false;
}

const widgetSelect = (data: WidgetData) => {
    selectedWidget.value = data;
}

const widgetRemove = (wid: string) => {
    nestedListProcess(widgetDatas.value, wid);
    if (selectedWidget.value?.id === wid) {
        selectedWidget.value = null;
    }
}

const nestedListProcess = (arr: any[], id: string) => {
    
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];

        if ((element as any)?.id === id) {
            arr.splice(i, 1);
            break;
        }

        if ((element as any)?.contents && Array.isArray((element as any).contents)) {
            nestedListProcess((element as any).contents, id);
        }
    }

}

const addItemEditor = (event: DragEvent) => {
    if (!listWidgets.value) {
        return;
    }
    draggedIn.value = false;
    console.log(event.dataTransfer?.getData("text/plain"));
    const transfareObject = JSON.parse(event.dataTransfer?.getData("text/plain") as string) || false;

    if (!transfareObject) {
        return;
    }

    const widget = widgets.map(item => item.id);
    const widgetIndx = widget.indexOf(transfareObject.id);

    if (widgetIndx === -1) {
        console.log(transfareObject.id);
        return;
    }
    (listWidgets.value as any).appendWidget(widgets[widgetIndx]);
}

/* Computeds */
const isSettings = computed(() => {
    if ((selectedWidget.value as HolderData)?.widget.id === "container") {
        return true;
    }
    else if ((selectedWidget.value as HolderData)?.widget.id === "column") {
        return true;
    }
    return false;
})

</script>

<style lang="scss">
#editor {
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
    background-color: white;

    * {
        color: black;
    }
}
.sidebar-menu-button {
    padding: 0.5rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
}
.sidebar-menu-button:hover {
    color: rgb(215, 215, 215);
}
.editor-sidebar {
    min-width: 300px;
    height: 100vh;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

.editor-sidebar .sidebar-title {
    font-weight: 200;
    padding: 0.5rem 0;
    text-align: center;
}

.editor-sidebar .sidebar-widgets {
    padding: 0.5rem 0;
    padding-top: 1rem;
    margin-right: 0;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    max-height: 90vh;
    justify-content: center;
}

.editor-content {
    padding: 0.5rem;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.editor-dragged::after {
    content: '';
    display: block;
    transition: .5s ease;
    width: 100%;
    height: 3px;
    background-color: aqua;
}
</style>