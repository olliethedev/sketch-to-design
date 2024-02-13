import { UIController } from "../controllers/UIController";
import { Logo, Close } from "../conponents/Icons";
import { generateHtml } from "../helpers/OpenAIHelper";
import { handleUIImport } from "../helpers/LayersHelper";
import { ApiKeyProtected } from "../conponents/ApiKeyProtected";
import { API_KEY_STORAGE_KEY } from "../helpers/Constants";
import { ChildRouteProps } from "./LayoutRouter";
import { Button } from "./Button";
const { widget } = figma;
const { AutoLayout, SVG, Text, useSyncedState, Image } = widget;

export const HomeLayout = ({ setRoute }: ChildRouteProps) => {
  const [generating, setGenerating] = useSyncedState("generating", false);
  const [image, setImage] = useSyncedState<string | boolean>("image", false);

  const openCanvas = async () => {
    await new Promise((resolve) => {
      const uiController = UIController({
        screen: "canvas",
        onImportImage(data) {
          setImage(data);
        },
      });
      uiController.show();
    });
  };

  return (
    <ApiKeyProtected>
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
        <SVG src={Logo()} cornerRadius={100} width={64} height={64} />
        {!image && <Button text="Sketch" onClick={openCanvas} />}
        {image && (
          <GenerateLayout
            image={image}
            setImage={setImage}
            generating={generating}
            setGenerating={setGenerating}
          />
        )}
      </AutoLayout>
    </ApiKeyProtected>
  );
};

interface GenerateLayoutProps {
  image: string | boolean;
  setImage: (image: string | boolean) => void;
  generating: boolean;
  setGenerating: (generating: boolean) => void;
}

const GenerateLayout = ({
  image,
  setImage,
  generating,
  setGenerating,
}: GenerateLayoutProps) => {
  const openPreview = async (html: string) => {
    await new Promise((resolve) => {
      const uiConstroller = UIController({
        screen: "preview",
        screenParams: {
          html,
        },
        onImportUI(data) {
          setImage(false);
          handleUIImport(data);
          figma.notify("Design generated successfully");
        },
      });
      uiConstroller.show();
    });
  };

  const generate = async () => {
    const base64 = image as string;
    if (!generating) {
      setGenerating(true);

      const json = await generateHtml({
        apiKey: figma.root.getPluginData(API_KEY_STORAGE_KEY),
        image: base64,
      });

      //todo handle error
      const message = json.choices[0].message.content;
      const start = message.indexOf("<!DOCTYPE html>");
      const end = message.indexOf("</html>");
      let html = message.slice(start, end + "</html>".length);
      setGenerating(false);
      setImage(false);
      await openPreview(html);
    }
  };

  const cancelGeneration = () => {
    setGenerating(false);
    setImage(false);
  };

  return (
    <>
      {image && !generating && (
        <AutoLayout direction="horizontal" width="hug-contents" verticalAlignItems="center" spacing={6}>
          <Image src={image as string} width={64} height={64} />
          <Button text="Generate" onClick={generate} />
          <Button text="Cancel" onClick={cancelGeneration} />
        </AutoLayout>
      )}
      {generating && (
        <AutoLayout verticalAlignItems="center" spacing={8}>
          <Text>Generating Design...</Text>
          <SVG
            src={Close()}
            width={16}
            height={16}
            onClick={() => {
              cancelGeneration();
            }}
          />
        </AutoLayout>
      )}
    </>
  );
};
