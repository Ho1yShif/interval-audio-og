import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes.jsx";
import "./styles/global.css";

// Match react-router's basename to Vite's base so in-app links resolve under
// the GitHub Pages project subpath (no trailing slash; "/" stays undefined).
const base = import.meta.env.BASE_URL;
const basename = base === "/" ? undefined : base.replace(/\/$/, "");

export const createRoot = ViteReactSSG({ routes, basename });
