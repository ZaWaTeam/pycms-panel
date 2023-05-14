interface Groups {
    id: string,
    label: string,
    active: boolean,
}
interface WidgetData {
    id: string,
    props: object,
    settings: object,
    content: object,
    editables: string[],
    widget: Widget,
}
interface HolderData {
    id?: string,
    contents: WidgetData[] | ColumnData[],
    settings: object,
    widget: Container | Column
}

interface ColumnData {
    id: string,
    contents: WidgetData[] | HolderData[],
    settings: object,
    widget: Widget,
}

interface Widget {
    id?: string,
    name: string,
    description?: string,
    icon: string,
    groups?: Groups[],
    renderContent: (data: any) => string,
    appearanceContent?: (data: any) => string,
    settingTypes: object,
    isEditable: boolean,
    allowEditables: boolean,
}

interface Container {
    id?: string,
    groups?: Groups[],
    renderContent: (data: any) => string[],
    appearanceContent?: (data: any) => string,
    settings: object,
}

interface Column {
    id?: string,
    groups?: Groups[],
    renderContent: (data: any) => string[],
    appearanceContent?: (data: any) => string,
    settings: object,
}

export type {
    Widget,
    WidgetData,
    Container,
    Column,
    HolderData,
    ColumnData
};