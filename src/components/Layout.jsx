import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  // If the page loads with a hash (e.g. someone shares /#contact), jump to it
  // once the content has rendered.
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView();
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">Skip to Content</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
