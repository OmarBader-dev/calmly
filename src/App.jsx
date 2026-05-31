import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TabBar from "./components/TabBar.jsx";
import MobileTop from "./components/MobileTop.jsx";
import PageHead from "./components/PageHead.jsx";
import Empty from "./components/Empty.jsx";
import { PAGE_IDS } from "./components/nav.js";
import { useStore } from "./data/store.js";
import { computeGPA } from "./data/gpa.js";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";

const PAGE_META = {
  home: { kicker: "Dashboard", title: "Home" },
  courses: { kicker: "Your term", title: "Courses" },
  calculator: { kicker: "The numbers", title: "GPA Calculator" },
  calendar: { kicker: "Stay ahead", title: "Calendar" },
  swap: { kicker: "Campus exchange", title: "Skill Swap" },
  about: { kicker: "The basics", title: "About & Help" },
};

function PlaceholderPage({ kicker, title }) {
  return (
    <div className="fade-in">
      <PageHead
        kicker={kicker}
        title={title}
        desc="This page is being built"
      />
      <Empty
        icon="leaf"
        title="in the making"
      />
    </div>
  );
}

export default function App() {
  const store = useStore();
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
  const meta = PAGE_META[active];
  const gpa = computeGPA(store.data.courses);

  const renderPage = () => {
    switch (active) {
      case "home":
        return <Home store={store} setRoute={go} />;
      case "courses":
        return <Courses store={store} />;
      default:
        return <PlaceholderPage kicker={meta.kicker} title={meta.title} />;
    }
  };

  return (
    <div className="app">
      <Sidebar route={active} setRoute={go} gpa={gpa} />
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
