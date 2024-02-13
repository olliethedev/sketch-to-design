import { Button } from "./Button";
import { Save } from "./Icons";

const { widget } = figma;
const { AutoLayout, Input, useSyncedState, SVG, Frame, Text } = widget;

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

export const ApiKeyInput = ({ onApiKeyChange }: ApiKeyInputProps) => {
  const [text, setText] = useSyncedState<string>("text", "");

  const saveApiKey = (apiKey: string) => {
    //todo: validate key
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
      <Button text="Save" icon={Save()} onClick={() => saveApiKey(text)} />
    </AutoLayout>
  );
};
