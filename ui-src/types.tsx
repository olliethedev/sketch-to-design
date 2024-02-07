export interface WidgetMessageEvent {
    data: {
        pluginMessage: {
            type: string;
            data: any;
        }
    }
}