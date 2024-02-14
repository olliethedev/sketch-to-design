import * as React from "react";
import { IconCursorLarge } from "./Icons";
import { getBase64Format, toBase64} from "../helpers/utils";

interface FigmaNodeSelectorProps {
  onSelectionConfirmed: (url: string) => void;
}

export const FigmaNodeSelector = ({
  onSelectionConfirmed
}: FigmaNodeSelectorProps) => {
  const [imageSrc, setImageSrc] = React.useState(""); // State to store the image source

  React.useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "getSelection" } }, "*");
    const handleMessage = (event) => {
      if (event.data.pluginMessage.type === "selectionChange") {
        const buffer = event.data.pluginMessage.data;
        setImageSrc(`${getBase64Format("png")}${toBase64(buffer)}`);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      parent.postMessage({ pluginMessage: { type: "setItem", key: "listenToSelectionChange", value: false } }, "*");
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div>
      {imageSrc && (
        <div className="relative w-[90vw] h-[80vh] flex flex-col">
          <div className="overflow-y-scroll flex-grow">
            <img src={imageSrc} alt="Figma Selection" />
          </div>
          <div className="divider"></div>
          <SelectNodeButton
            base64Data={imageSrc}
            onSelectionConfirmed={onSelectionConfirmed}
          />
        </div>
      )}
      {!imageSrc && (
        <div className="flex flex-col justify-center items-center rounded p-4 space-y-4">
          <IconCursorLarge className="w-32 h-32" />
          <div className="text-2xl font-bold">Select a Figma Element</div>
          <div className="text-base-content max-w-md text-center">
            Select any element in Figma to use it as input to the AI assistant.
          </div>
        </div>
      )}
    </div>
  );
};

const SelectNodeButton = ({
  base64Data,
  onSelectionConfirmed
}: { base64Data?: string } & FigmaNodeSelectorProps) => {
  const [uploading, setUploading] = React.useState(false);
  const uploadToS3 = async (base64Data) => {
    setUploading(true);
    if (base64Data) {
      try {
        onSelectionConfirmed(base64Data);
      } catch (error) {
        console.error("Error selecting node: ", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <button
        className="btn btn-primary"
        disabled={!base64Data || uploading}
        onClick={() => uploadToS3(base64Data)}
      >
        Select
      </button>
    </div>
  );
};

