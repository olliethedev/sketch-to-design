import * as React from "react";
import * as ReactDOM from "react-dom";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import "./ui.css";
import { ErrorBoundary } from "react-error-boundary";

const Layout = () => {
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
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

const Home = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-blue-600">Home</h1>
    </div>
  );
};

const NoPage = () => {
  return <h1>404</h1>;
};

ReactDOM.render(<App />, document.getElementById("react-page"));
