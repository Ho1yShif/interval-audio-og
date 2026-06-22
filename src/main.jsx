import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes.jsx";
import "./styles/global.css";

// Strip the trailing slash from Vite's BASE_URL ("/interval-audio/") so React
// Router resolves links relative to the GitHub Pages project subpath.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export const createRoot = ViteReactSSG({ routes, basename });
