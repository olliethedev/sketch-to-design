export const UIController = (screen: "canvas" | "preview") => {
    return {
        show: () => {
            figma.showUI(__html__, {
                width: 720,
                height: 720,
              });
        },
        handleMessage: (msg: any) => {
            switch (msg.type) {
                case "started": {
                    figma.ui.postMessage({
                        type: "navigate",
                        data: {
                            screen,
                        }
                    });
                    break;
                }
                case "close": {
                    figma.closePlugin();
                    break;
                }
            }

        }
    };
};
