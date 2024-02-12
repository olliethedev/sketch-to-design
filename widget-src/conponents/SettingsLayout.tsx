import { API_KEY_STORAGE_KEY } from "../helpers/Constants";
import { ApiKeyInput } from "./ApiKeyInput";
import { ChildRouteProps } from "./LayoutRouter";

const { widget } = figma;
const { AutoLayout, Text, useSyncedState, useEffect } = widget;



export const SettingsLayout = ({setRoute}:ChildRouteProps) => {
  const [apiKey, setApiKey] = useSyncedState<string | boolean>(
    API_KEY_STORAGE_KEY,
    false
  );


  useEffect(() => {
    const key = figma.root.getPluginData(API_KEY_STORAGE_KEY);
    if (key) {
      setApiKey(key);
    }
  });

  const onSaveApiKey = (apiKey: string) => {
    figma.root.setPluginData(API_KEY_STORAGE_KEY, apiKey);
    setApiKey(apiKey);
  };
  return (
    <AutoLayout
      direction="horizontal"
      width="hug-contents"
      height="hug-contents"
    >
      <AutoLayout
          direction="vertical"
          padding={10}
          spacing={10}
          fill="#f0f0f0"
        >
          <Text>Update OpenAI API key:</Text>
          <ApiKeyInput onApiKeyChange={onSaveApiKey} />
        </AutoLayout>
    </AutoLayout>
  );
};
