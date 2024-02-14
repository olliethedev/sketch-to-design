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
            case "getSelection": {
                postSelection();
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
            figma.on("selectionchange", async () => {
                postSelection();
            });
        },

    };
};

const postSelection = async () => {
    const selection = figma.currentPage.selection;

    if (selection.length > 0) {
        await sleep(1);
        const node = selection[0];

        node.exportAsync({ format: "PNG" }).then(data => {

            figma.ui.postMessage({
                type: "selectionChange",
                data: data
            });

        }).catch(err => {
            console.error("Error exporting image:", err);
        });
    }
};

const sleep = (ms: number) => {
    return new Promise((r) => setTimeout(r, ms));
};
