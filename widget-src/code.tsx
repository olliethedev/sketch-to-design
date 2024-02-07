import { UIController } from "./controllers/UIController";
import { RenderController } from "./controllers/RenderController";
import { Logo } from "./conponents/icons";
const { widget } = figma;
const {
  AutoLayout,
  SVG,
  Text,
  useSyncedState,
  usePropertyMenu,
  useEffect,
  waitForTask,
} = widget;

function Widget() {
  const openUI = async () => {
    await new Promise((resolve) => {
      const uiController = UIController("canvas");
      const renderController = RenderController();
      uiController.show();
      figma.ui.on("message", (msg) => {
        uiController.handleMessage(msg);
        renderController.handleMessage(msg);
      });
    });
  };

  return (
    <AutoLayout
      verticalAlignItems="center"
      padding={{ left: 0, right: 8, top: 0, bottom: 0 }}
      fill="#FFFFFF"
      cornerRadius={8}
      spacing={12}
      stroke={{
        type: "solid",
        color: "#123456",
      }}
      effect={{
        type: "drop-shadow",
        color: { r: 0, g: 0, b: 0, a: 0.2 },
        offset: { x: 0, y: 0 },
        blur: 2,
        spread: 2,
      }}
    >
      <SVG 
      src={Logo()}
      cornerRadius={100}
      width={64}
      height={64}
      />
      <AutoLayout
        verticalAlignItems="center"
        height="hug-contents"
        padding={{ left: 24, right: 24, top: 12, bottom: 12 }}
        fill="#E6E6E6"
        cornerRadius={8}
        onClick={openUI}
        hoverStyle={{
          fill: "#D9D9D9",
        }}
      >
        <Text>Open UI</Text>
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
