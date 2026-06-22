import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";

// Single-page site: every section (hero, services, portfolio, about, contact)
// lives on the index route and is reached via in-page anchor links.
export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, Component: Home }],
  },
];
