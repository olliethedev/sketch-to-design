import * as React from "react";
import { useEffect } from "react";
import * as ReactDOM from "react-dom";
import { useLocation } from "react-router-dom";
import {
  MemoryRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
} from "react-router-dom";
import "./ui.css";
import { ErrorBoundary } from "react-error-boundary";
import { HtmlPreview } from "./componenets/HtmlPreview";
import { htmlToFigma, setContext } from "html-to-figma-lib/browser";
import { useWidgetBinding } from "./hooks/useWidgetBinding";
import { WidgetMessageEvent } from "./types";
import { Canvas } from "./componenets/Canvas";
import { messageOnImportFrames, messageOnStart } from "./helpers/widget-helper";



const Layout = () => {
  const [message] = useWidgetBinding();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("UI mounted");
    //send message to figma widget to proceed
    messageOnStart();
  }, []);

  useEffect(() => {
    if (message?.data?.pluginMessage?.type === "navigate") {
      const { screen, screenParams } = message.data.pluginMessage.data;
      if(screenParams){
      const queryParams = new URLSearchParams(screenParams).toString();
        navigate(`${screen}?${queryParams}`);
      } else {
        navigate(screen);
      }
    }
  }, [message]);

  return (
    <ErrorBoundary
      fallback={
        <div>
          <h1>Something went wrong</h1>
        </div>
      }
    >
      <Outlet />
    </ErrorBoundary>
  );
};

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="canvas" element={<Canvas />} />
          <Route path="preview" element={<Preview />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

const Home = () => {
  return (
    <div>
      <span>Waiting for widget to respond...</span>
    </div>
  );
};

const Preview = () => {
  const [doc, setDocument] = React.useState<HTMLIFrameElement>();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  console.log({queryParams});
   const htmlParam = queryParams.get('html');
   console.log({htmlParam});
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
      <h1 className="text-4xl font-bold text-center text-blue-600">Home</h1>
      <HtmlPreview gotElement={setDocumentCallback} html={htmlParam} />
      <button onClick={() => onImport(doc, false)}>Export</button>
    </div>
  );
};

const loadJson = async (text: string, useAutoLayout: boolean) => {
  const json = JSON.parse(text);
  messageOnImportFrames({json, useAutoLayout});
};

const NoPage = () => {
  return <h1>404</h1>;
};


ReactDOM.render(<App />, document.getElementById("react-page"));
