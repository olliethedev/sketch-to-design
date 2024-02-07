import { addLayersToFrame } from "html-to-figma-lib/figma";
const defaultFont = { family: "Roboto", style: "Regular" };

interface SvgNode extends DefaultShapeMixin, ConstraintMixin {
    type: "SVG";
    svg: string;
}
type LayerNode = Partial<RectangleNode | TextNode | FrameNode | SvgNode | GroupNode | ComponentNode>;

type PlainLayerNode = Partial<LayerNode> & {
    fontFamily?: string
};


interface MsgData {
    json: {
        layers: PlainLayerNode;
    },
    useAutoLayout: boolean;
}

export const RenderController = () => {
    return {
        handleMessage: (msg: any) => {
            switch (msg.type) {
                case "import": {
                    figma.loadFontAsync(defaultFont).then(() => {
                        const { data } = msg;

                        const { json, useAutoLayout } = data as MsgData;
                        const { layers } = json;

                        const baseFrame: PageNode | FrameNode = figma.currentPage;
                        let frameRoot: SceneNode = baseFrame as any;

                        const x = 0, y = 0;


                        layers.x = x;
                        layers.y = y;

                        addLayersToFrame([layers], baseFrame, ({ node, parent }) => {
                            if (!parent) {
                                frameRoot = node;
                                // node.name = "Imported";
                            }
                        }, useAutoLayout).then(() => {
                            if (frameRoot.type === "FRAME") {
                                figma.currentPage.selection = [frameRoot];
                            }

                            figma.ui.postMessage({
                                type: "doneLoading",
                                rootId: frameRoot.id,
                            });

                            figma.viewport.scrollAndZoomIntoView([frameRoot]);
                            figma.closePlugin();
                        });
                    });
                    break;
                }
            }

        }
    }
}