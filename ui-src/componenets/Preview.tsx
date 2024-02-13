import * as React from "react";
import { useLocation } from "react-router-dom";
import { HtmlIFrame } from "./HTMLIFrame";
import { htmlToFigma, setContext } from "html-to-figma-lib/browser";
import { messageOnImportFrames } from "../helpers/widget-helper";
import { ViewPortPickerLayout } from "./ViewPortPickerLayout";
import { SCREEN_SIZES } from "../helpers/html-helper";
export const Preview = () => {
  const [doc, setDocument] = React.useState<HTMLIFrameElement>();
  const [selectedViewPort, setSelectedViewPort] =
    React.useState<keyof typeof SCREEN_SIZES>("lg");

  const onPortSelectionChange = (size: keyof typeof SCREEN_SIZES) => {
    setSelectedViewPort(size);
  };

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  console.log({ queryParams });
  const htmlParam = queryParams.get("html");
  console.log({ htmlParam });
  const setDocumentCallback = React.useCallback(
    (newDoc: HTMLIFrameElement) => {
      if (newDoc !== doc) setDocument(newDoc);
    },
    [doc]
  );
  const onImport = async (frame: HTMLIFrameElement, useAutoLayout: boolean) => {
    setContext(frame.contentWindow as Window);

    const htmlLayers = await htmlToFigma(
      frame.contentDocument.body,
      useAutoLayout
    );

    const inputStr = JSON.stringify({ layers: htmlLayers });

    loadJson(inputStr, useAutoLayout);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center space-x-1">
        <ViewPortPickerLayout selected={selectedViewPort} onChange={onPortSelectionChange} />
        <div className="border-r border-base-content h-8 mx-2" />
        <button
          className="btn btn-xs btn-success"
          onClick={() => onImport(doc, false)}
        >
          Export as Frames
        </button>
        <button
          className="btn btn-xs btn-success"
          onClick={() => onImport(doc, true)}
        >
          Export as Auto-Layouts <span className="text-xs text-orange-600">(beta)</span>
        </button>
      </div>
      <HtmlIFrame
        viewport={selectedViewPort}
        gotElement={setDocumentCallback}
        html={htmlParam}
      />
    </div>
  );
};

const loadJson = async (text: string, useAutoLayout: boolean) => {
  const json = JSON.parse(text);
  messageOnImportFrames({ json, useAutoLayout });
};
