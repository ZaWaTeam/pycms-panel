<template>
    <div class="widget-settings">
        <VTabs grow v-model="currentTab">
            <VTab v-for="tab in tabOptions" :key="tab" :value="tab">{{ tab }}</VTab>
        </VTabs>
        <VDivider />
        <VWindow v-model="currentTab" style="width: 100%;" class="mt-5">
            <VWindowItem value="Appearance">
                <div v-for="form, index in getForms" :key="form.name" class="widget-setting-option">
                    <VTextField :disabled="!form.body.available" class="form-control" :label="form.body.title"
                        :placeholder="form.body.hint" v-if="isInput(form.body.type) && form.body.category === 'appearance'"
                        :type="inputAttr(form.body.type)" v-model="(modelForm as any).settings[form.name].value" />
                    <VTextarea :disabled="!form.body.available" :label="form.body.title" :placeholder="form.body.hint"
                        v-else-if="isTextarea(form.body.type) && form.body.category === 'appearance'"
                        v-model="(modelForm as any).settings[form.name].value"></VTextarea>
                    <QuillEditor :disabled="!form.body.available" theme="snow" class="qeditor" :options="QuillSettings"
                        v-else-if="isWswyig(form.body.type) && form.body.category === 'appearance'" content-type="html"
                        v-model:content="(modelForm as any).settings[form.name].value">
                    </QuillEditor>
                    <div class="code-editor"
                        v-else-if="isCodeEditor(form.body.type) && form.body.category === 'appearance'">
                        <VAceEditor :disabled="!form.body.available" :options="editorSettings"
                            v-model:value="(modelForm as any).settings[form.name].value" theme="monokai"
                            :lang="codeAttr(form.body.type)" style="height: 300px"></VAceEditor>
                        <div class="display-ordered">
                            <small class="text-muted" v-if="isArray(form.body.hint)" v-for="hint in form.body.hint">{{ hint
                            }}</small>
                            <small class="text-muted" v-else>{{ form.body.hint }}</small>
                        </div>
                    </div>
                    <div class="color-picker" v-else-if="isColor(form.body.type) && form.body.category === 'appearance'">
                        <label class="text-muted">{{ form.body.title }}</label>
                        <!-- <ColorPicker picker-type="chrome" :is-widget="true"
                            v-model="(modelForm as any).settings[form.name].value"></ColorPicker> -->
                        <input type="color" :disabled="!form.body.available"
                            v-model="(modelForm as any).settings[form.name].value">
                    </div>
                    <div v-else-if="isDimension(form.body.type) && form.body.category === 'appearance'">
                        <label class="text-muted">{{ form.body.title }}</label>
                        <Dimensions :disabled="!form.body.available" :data="modelForm" :form="form"
                            v-model:dimension-unit="(modelForm as any).settings[form.name].unit"
                            v-model:value="(modelForm as any).settings[form.name].value"></Dimensions>
                    </div>
                    <div v-else-if="isSelect(form.body.type) && form.body.category === 'appearance'">
                        <VSelect v-model:model-value="(modelForm as any).settings[form.name].value" :multiple="selectMultiple(form.body.type)" :items="form.body.options" :label="form.body.title" variant="filled" />
                    </div>
                    <hr class="mt-5 mb-5" :id="index.toString()" :class="getForms.length.toString()"
                        v-if="form.body.category === 'appearance'">

                </div>
            </VWindowItem>
            <VWindowItem value="Settings">
                <div v-for="form, index in getForms" :key="form.name" class="widget-setting-option">
                    <VTextField :disabled="!form.body.available" class="form-control" :label="form.body.title"
                        :placeholder="form.body.hint" v-if="isInput(form.body.type) && form.body.category === 'appearance'"
                        :type="inputAttr(form.body.type)" v-model="(modelForm as any).settings[form.name].value" />
                    <VTextarea :disabled="!form.body.available" :label="form.body.title" :placeholder="form.body.hint"
                        v-else-if="isTextarea(form.body.type) && form.body.category === 'appearance'"
                        v-model="(modelForm as any).settings[form.name].value"></VTextarea>
                    <QuillEditor :disabled="!form.body.available" theme="snow" class="qeditor" :options="QuillSettings"
                        v-else-if="isWswyig(form.body.type) && form.body.category === 'appearance'" content-type="html"
                        v-model:content="(modelForm as any).settings[form.name].value">
                    </QuillEditor>
                    <div class="code-editor"
                        v-else-if="isCodeEditor(form.body.type) && form.body.category === 'appearance'">
                        <VAceEditor :disabled="!form.body.available" :options="editorSettings"
                            v-model:value="(modelForm as any).settings[form.name].value" theme="monokai"
                            :lang="codeAttr(form.body.type)" style="height: 300px"></VAceEditor>
                        <div class="display-ordered">
                            <small class="text-muted" v-if="isArray(form.body.hint)" v-for="hint in form.body.hint">{{ hint
                            }}</small>
                            <small class="text-muted" v-else>{{ form.body.hint }}</small>
                        </div>
                    </div>
                    <div class="color-picker" v-else-if="isColor(form.body.type) && form.body.category === 'settings'">
                        <label class="text-muted">{{ form.body.title }}</label>
                        <!-- <ColorPicker picker-type="chrome" :is-widget="true"
                            v-model="(modelForm as any).settings[form.name].value"></ColorPicker> -->
                        <input type="color" :disabled="!form.body.available"
                            v-model="(modelForm as any).settings[form.name].value">
                    </div>
                    <div v-else-if="isDimension(form.body.type) && form.body.category === 'settings'">
                        <label class="text-muted">{{ form.body.title }}</label>
                        <Dimensions :disabled="!form.body.available" :data="modelForm" :form="form"
                            v-model:dimension-unit="(modelForm as any).settings[form.name].unit"
                            v-model:value="(modelForm as any).settings[form.name].value"></Dimensions>
                    </div>
                    <div v-else-if="isSelect(form.body.type) && form.body.category === 'settings'">
                        <VSelect v-model:model-value="(modelForm as any).settings[form.name].value" :multiple="selectMultiple(form.body.type)" :items="form.body.options" :label="form.body.title" variant="filled" />
                    </div>
                    <hr class="mt-5 mb-5" :id="index.toString()" :class="getForms.length.toString()"
                        v-if="form.body.category === 'settings'">

                </div>
            </VWindowItem>
        </VWindow>
    </div>
</template>

<script lang="ts" setup>
import { HolderData } from '@/views/webeditor';
import { QuillEditor } from '@vueup/vue-quill';

import Dimensions from './units/Dimensions.vue';
import "vue3-colorpicker/style.css";

// @ts-ignore
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import { isArray } from '@vue/shared';
import ace from "ace-builds";
import workerHtmlUrl from 'ace-builds/src-noconflict/worker-html?url';

ace.config.setModuleUrl('ace/mode/html_worker', workerHtmlUrl);


/* QuillSettings */
const QuillSettings = {
    debug: "info",
    placeholder: 'Edit your content...',
}

/* ACE Editor Settings */
const editorSettings = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    useWorker: true,
}

/* Tab Settings */
const tabOptions = ["Appearance", "Settings"];
const currentTab = ref('Appearance');


/* Emits & Props */
const props = defineProps<{
    id: string,
    modelForm: HolderData,
}>();
const emit = defineEmits(["update:modelForm"]);

/* Datas */

/* Methods */
const isInput = (type: string) => {
    return type.split(':')[0] === "input" || type.toLowerCase() === "input";
}
const isTextarea = (type: string) => {
    return type.toLowerCase() === "textarea";
}
const isWswyig = (type: string) => {
    return type.toLowerCase() === "wswyig"
}
const isCodeEditor = (type: string) => {
    return type.split(':')[0] === "code" || type.toLowerCase() === "code";
}
const isColor = (type: string) => {
    return type.toLowerCase() === "color";
}

const isDimension = (type: string) => {
    return type.split(':')[0] === "dimension" || type.toLowerCase() === "dimension";
}
const isSelect = (type: string) => {
    return type.split(':')[0] === "select" || type.toLowerCase() === "select";
}

const codeAttr = (type: string) => {
    if (!isCodeEditor(type)) {
        return;
    }
    if (type.search(":")) {
        return type.split(":")[1];
    }

    return "html";
}
const inputAttr = (type: string) => {
    if (!isInput(type)) {
        return;
    }
    if (type.search(":")) {
        return type.split(":")[1];
    }

    return "text";
}
const selectMultiple = (type: string) => {
    if (!isSelect(type)) {
        return false;
    }
    if (type.search(":")) {
        return type.split(":")[1] === "multiple" ? true : false;
    }

    return false;
}



/* Computeds */
const getForms = computed(() => {
    const returnValue = props.modelForm.widget.settings;
    let returnList = [];
    for (const val in returnValue) {
        returnList.push({
            name: val,
            // @ts-ignore
            body: returnValue[val],
        });
    }

    return returnList;
})

</script>

<style lang="scss">
.widget-settings {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    height: 100%;
}

.widget-setting-option {
    width: 100%;
}

.widget-settings-card {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    margin-top: 0;
    padding-top: 0.5rem;
}

.qeditor {
    min-height: 200px;
    width: 100%;
}

.v-theme--dark {
    color: white;

    .vc-colorpicker {
        background-color: rgb(var(--v-theme-background)) !important;
        color: white;

        .vc-chrome-colorPicker {
            background-color: rgb(var(--v-theme-background)) !important;
        }

        .vc-chrome-colorPicker-body {
            background-color: rgb(var(--v-theme-background)) !important;
        }
    }

    .vc-colorpicker * {
        color: white !important;
    }

    .ql-toolbar {
        span {
            color: white !important;
        }

        .ql-stroke {
            stroke: white;
        }

        button:hover {
            background-color: rgb(var(--v-theme-primary));
        }

        .ql-picker-options {
            background-color: rgb(var(--v-theme-background));
        }

        .ql-picker-item:hover {
            background-color: rgb(var(--v-theme-primary));
        }

        .ql-picker-label:hover {
            background-color: rgb(var(--v-theme-primary)) !important;
        }

        .ql-active {
            background-color: rgb(var(--v-theme-primary)) !important;

            .ql-stroke {
                stroke: white !important;
                ;
            }
        }

        .ql-selected {
            background-color: rgb(var(--v-theme-primary)) !important;
            color: white !important;
        }

        .ql-expanded {
            background-color: rgb(var(--v-theme-primary)) !important;
        }
    }
}

.display-ordered {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}

.color-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    flex-direction: column;
}</style>