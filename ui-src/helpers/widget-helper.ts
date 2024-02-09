export const messageOnStart = () => {
    parent?.postMessage(
        {
            pluginMessage: {
                type: "started",
            },
        },
        "*"
    );
}

export const messageOnImportImage = (data: any) => {
    parent?.postMessage(
        {
            pluginMessage: {
                type: "importImage",
                data,
            },
        },
        "*"
    );
}

export const messageOnImportFrames = (data: { json: any, useAutoLayout: boolean }) => {
    parent.postMessage(
        {
            pluginMessage: {
                type: "importUI",
                data,
            },
        },
        "*"
    );
}