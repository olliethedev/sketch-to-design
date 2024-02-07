import * as React from "react";
import { useEffect } from "react";
import * as ReactDOM from "react-dom";
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

const exampleHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GroupHEALTH Landing Page</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
<style>
  body {
    font-family: 'Open+Sans', sans-serif;
  }
  .benefit-icon {
    background-color: #189faa;
    color: #ffffff;
  }
</style>
</head>
<body class="bg-white">
  <section class="bg-f2f2f2">
    <div class="container mx-auto px-4 py-20">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-333333 mb-4">Benefits and Features</h2>
        <p class="text-md text-333333 mb-8">Explore the comprehensive range of benefits and features we offer</p>
      </div>
      <div class="flex flex-wrap -mx-4">
        <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
          <div class="p-6 text-center">
            <div class="benefit-icon p-4 rounded-full inline-block mb-4">
                <i>Icon</i>
            </div>
            <h3 class="text-xl font-semibold text-333333 mb-3">Extended Health Care</h3>
            <p class="text-md text-333333">Covering prescriptions, vision care, and more for comprehensive health support.</p>
          </div>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
          <div class="p-6 text-center">
            <div class="benefit-icon p-4 rounded-full inline-block mb-4">
                <i>Icon</i>
            </div>
            <h3 class="text-xl font-semibold text-333333 mb-3">Dental Care</h3>
            <p class="text-md text-333333">Dental plans that keep your smile bright and your dental health top-notch.</p>
          </div>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
          <div class="p-6 text-center">
            <div class="benefit-icon p-4 rounded-full inline-block mb-4">
            <i>Icon</i>
            </div>
            <h3 class="text-xl font-semibold text-333333 mb-3">Vision Care</h3>
            <p class="text-md text-333333">Benefits to ensure your vision is always protected with regular check-ups and eyewear coverage.</p>
          </div>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
          <div class="p-6 text-center">
            <div class="benefit-icon p-4 rounded-full inline-block mb-4">
              <i>Icon</i>
            </div>
            <h3 class="text-xl font-semibold text-333333 mb-3">Disability Coverage</h3>
            <p class="text-md text-333333">Providing financial security and peace of mind for employees facing disabilities.</p>
          </div>
        </div>
        <!-- Repeat for additional benefits and features as needed -->
      </div>
    </div>
  </section>
</body>
</html>
`;

const Layout = () => {
  const [message] = useWidgetBinding();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("App mounted");
    //send message to figma widget to proceed
    parent.postMessage(
      {
        pluginMessage: {
          type: "started",
        },
      },
      "*"
    );
  }, []);

  useEffect(() => {
    if (message?.data?.pluginMessage?.type === "navigate") {
      const { screen } = message.data.pluginMessage.data;
      navigate(screen);
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

const Canvas = () => {
  return (
    <div>
      <h1>Canvas</h1>
    </div>
  );
};

const Preview = () => {
  const [doc, setDocument] = React.useState<HTMLIFrameElement>();
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
      <HtmlPreview gotElement={setDocumentCallback} html={exampleHtml} />
      <button onClick={() => onImport(doc, false)}>Export</button>
    </div>
  );
};

const loadJson = async (text: string, useAutoLayout: boolean) => {
  const json = JSON.parse(text);
  parent.postMessage(
    {
      pluginMessage: {
        type: "import",
        data: { json, useAutoLayout },
      },
    },
    "*"
  );
};

const NoPage = () => {
  return <h1>404</h1>;
};

const handleScreenRouting = (message:WidgetMessageEvent) => {};

ReactDOM.render(<App />, document.getElementById("react-page"));
