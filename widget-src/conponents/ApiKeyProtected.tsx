import { API_KEY_STORAGE_KEY } from "../helpers/Constants";
import { ApiKeyInput } from "./ApiKeyInput";

const { widget } = figma;
const { AutoLayout, SVG, Text, useSyncedState, useEffect, Input } = widget;

interface ApiKeyProtectedProps {
  children: JSX.ElementChildrenAttribute;
}

export const ApiKeyProtected = ({ children }: ApiKeyProtectedProps) => {
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
      {apiKey ? (
        children
      ) : (
        <AutoLayout
          direction="vertical"
          padding={10}
          spacing={10}
          fill="#f0f0f0"
        >
          <Text>To get started, please enter your OpenAI API key:</Text>
          <ApiKeyInput onApiKeyChange={onSaveApiKey} />
        </AutoLayout>
      )}
    </AutoLayout>
  );
};
