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


function Counter() {
  const openUI = async () => {
    await new Promise((resolve) => {
      figma.showUI(__html__);
      figma.ui.on("message", (msg) => {
        if (msg === "hello") {
          figma.notify(`Hello Widgets`);
        }
        if (msg === "close") {
          figma.closePlugin();
        }
      });
    });
  };

  return (
    <AutoLayout
      verticalAlignItems="center"
      padding={{ left: 16, right: 8, top: 8, bottom: 8 }}
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

widget.register(Counter);
