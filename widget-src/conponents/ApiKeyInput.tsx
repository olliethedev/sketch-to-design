import { Save } from "./Icons";

const { widget } = figma;
const { AutoLayout, Input, useSyncedState, SVG, Frame, Text } = widget;

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

export const ApiKeyInput = ({ onApiKeyChange }: ApiKeyInputProps) => {
  const [text, setText] = useSyncedState<string>("text", "");

  const saveApiKey = (apiKey: string) => {
    onApiKeyChange(apiKey);
  };
  return (
    <AutoLayout width="fill-parent" direction="horizontal" verticalAlignItems="center" spacing={10}>
      <Input
        fill="#000"
        fontSize={12}
        height="hug-contents"
        width="fill-parent"
        horizontalAlignText="left"
        inputBehavior="multiline"
        inputFrameProps={{
          fill: "#FFFFFF",
          horizontalAlignItems: "center",
          padding: 8,
          verticalAlignItems: "center",
        }}
        onTextEditEnd={(e) => setText(e.characters)}
        value={text}
      />
      {/* figma widget button for saving */}
      <AutoLayout
        fill="#fff"
        height={30}
        width="hug-contents"
        direction="horizontal"
        verticalAlignItems="center"
        spacing={2}
        cornerRadius={8}
        padding={4}
        onClick={() => saveApiKey(text)}
      >
        <SVG width={10} height={10} src={Save()} />
        <Text
          fill="#000"
          fontSize={12}
          horizontalAlignText="center"
          verticalAlignText="center"
        >
          Save
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
};
