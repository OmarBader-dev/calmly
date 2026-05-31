import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TabBar from "./components/TabBar.jsx";
import MobileTop from "./components/MobileTop.jsx";
import { PAGE_IDS } from "./components/nav.js";
import { useStore } from "./data/store.js";
import { useTheme } from "./data/theme.js";
import { computeGPA } from "./data/gpa.js";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import Calculator from "./pages/Calculator.jsx";
import Calendar from "./pages/Calendar.jsx";
import Swap from "./pages/Swap.jsx";
import About from "./pages/About.jsx";

export default function App() {
  const store = useStore();
  const { theme, serif, setTheme, setSerif } = useTheme();
  const [route, setRoute] = useState(
    () => window.location.hash.slice(1) || "home"
  );

  useEffect(() => {
    const onHash = () =>
      setRoute(window.location.hash.slice(1) || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (r) => {
    window.location.hash = r;
    setRoute(r);
    window.scrollTo({ top: 0 });
  };

  const active = PAGE_IDS.includes(route) ? route : "home";
  const gpa = computeGPA(store.data.courses);

  const renderPage = () => {
    switch (active) {
      case "home":
        return <Home store={store} setRoute={go} />;
      case "courses":
        return <Courses store={store} />;
      case "calculator":
        return <Calculator store={store} />;
      case "calendar":
        return <Calendar store={store} />;
      case "swap":
        return <Swap store={store} />;
      case "about":
        return (
          <About
            store={store}
            theme={theme}
            serif={serif}
            setTheme={setTheme}
            setSerif={setSerif}
          />
        );
      default:
        return <Home store={store} setRoute={go} />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        route={active}
        setRoute={go}
        gpa={gpa}
        theme={theme}
        serif={serif}
        setTheme={setTheme}
        setSerif={setSerif}
      />
      <main className="main">
        <MobileTop gpa={gpa} />
        <div className="main-inner">
          <div key={active}>{renderPage()}</div>
        </div>
      </main>
      <TabBar route={active} setRoute={go} />
    </div>
  );
}
