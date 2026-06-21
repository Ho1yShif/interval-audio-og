import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import PortfolioItem from "./pages/PortfolioItem.jsx";
import portfolio from "./data/portfolio.json";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, Component: Home },
      { path: "about-2", Component: About },
      { path: "contact", Component: Contact },
      { path: "portfolio", Component: Portfolio },
      {
        path: "portfolio/:slug",
        Component: PortfolioItem,
        entry: "src/pages/PortfolioItem.jsx",
        getStaticPaths: () => portfolio.map((p) => `/portfolio/${p.slug}`),
      },
    ],
  },
];
