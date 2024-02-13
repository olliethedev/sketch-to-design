import * as React from "react";
import { SCREEN_SIZES, blockAllClicks, fontAwesomeToImage, patchAllBackgroundImages, patchAllImages } from "../helpers/html-helper";

interface HtmlPreviewProps {
  html: string;
  gotElement: (frame: HTMLIFrameElement) => void;
  viewport: keyof typeof SCREEN_SIZES;
}
export const HtmlIFrame = ({ html, gotElement, viewport }: HtmlPreviewProps) => {
  const w = SCREEN_SIZES[viewport].width;
  const h = SCREEN_SIZES[viewport].height;

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const handleIFrameLoad = React.useCallback(async () => {
    const iframe = iframeRef.current;
    if (iframe) {
      const iframeContentDocument = iframe.contentDocument;

      await fontAwesomeToImage(iframeContentDocument);
      await patchAllBackgroundImages(iframeContentDocument);
      await patchAllImages(iframeContentDocument);
      await blockAllClicks(iframeContentDocument);

      gotElement && gotElement(iframe);
    }
  }, [iframeRef, gotElement]);

  return (
    <div className="w-full h-full overflow-scroll border-1 rounded-sm border-dashed border-primary-focus">
      <iframe
        srcDoc={html}
        ref={iframeRef}
        onLoad={handleIFrameLoad}
        sandbox="allow-same-origin allow-scripts allow-popups"
        title="HtmlPreview"
        width={`${w}px`}
        height={`${h}px`}
      />
    </div>
  );
};
