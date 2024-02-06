import React from "react";

interface HtmlPreviewProps {
  html: string;
  gotElement: (frame: HTMLIFrameElement) => void;
}
export const HtmlPreview = ({ html, gotElement }: HtmlPreviewProps) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const handleIFrameLoad = React.useCallback(async () => {
    const iframe = iframeRef.current;
    if (iframe) {
      const iframeContentDocument = iframe.contentDocument;

      // logger.info("iframeContentDocument pre", iframeContentDocument.documentElement.innerHTML);

      // await fontAwesomeToImage(iframeContentDocument);
      // await patchS3Images(iframeContentDocument);
      // await patchAllBackgroundImages(iframeContentDocument);
      // await patchAllImages(iframeContentDocument);
      // await blockAllClicks(iframeContentDocument);

      // logger.info("iframeContentDocument post patching", iframeContentDocument.documentElement.innerHTML);

      gotElement && gotElement(iframe);
    }
  }, [iframeRef, gotElement]);

  return (
    <div>
      HtmlPreview:
      <iframe
        srcDoc={html}
        ref={iframeRef}
        onLoad={handleIFrameLoad}
        sandbox="allow-same-origin allow-scripts allow-popups"
        title="HtmlPreview"
        width="100%"
        height="100%"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
