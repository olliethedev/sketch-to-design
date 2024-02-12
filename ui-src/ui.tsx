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

import { messageOnStart } from "./helpers/widget-helper";
import { useWidgetBinding } from "./hooks/useWidgetBinding";
import { Canvas } from "./componenets/Canvas";
import { Preview } from "./componenets/Preview";



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



const NoPage = () => {
  return <h1>404</h1>;
};


ReactDOM.render(<App />, document.getElementById("react-page"));
