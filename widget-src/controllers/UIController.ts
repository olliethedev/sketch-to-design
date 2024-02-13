interface UIControllerParams {
    screen: "canvas" | "preview",
    screenParams?: any,
    onImportImage?: (data: any) => void,
    onImportUI?: (data: any) => void,

}
export const UIController = (params: UIControllerParams) => {
    const { screen, screenParams, onImportImage, onImportUI } = params;
    const handleMessage = (msg: any) => {
        switch (msg.type) {
            case "started": {
                figma.ui.postMessage({
                    type: "navigate",
                    data: {
                        screen,
                        screenParams
                    }
                });
                break;
            }
            case "importImage": {
                const { data } = msg;
                onImportImage?.(data);
                figma.closePlugin();
                break;
            }
            case "importUI": {
                const { data } = msg;
                onImportUI?.(data);
                break;
            }
        }

    }
    return {
        show: () => {
            figma.showUI(__html__, {
                width: 720,
                height: 720,
            });
            figma.ui.on("message", (msg) => {
                handleMessage(msg);
            });
        },

    };
};
