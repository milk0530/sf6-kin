import { useState, useEffect } from "react";
import { useFavorites }    from "./hooks/useFavorites";
import { useDefaultMode }  from "./hooks/useDefaultMode";
import { CHARACTERS, CHAR_DATA, TABS } from "./data";

import Header     from "./components/Header";
import Sidebar    from "./components/Sidebar";
import CharHeader from "./components/CharHeader";

import TopPage     from "./pages/TopPage";
import MovePage    from "./pages/MovePage";
import ComboPage   from "./pages/ComboPage";
import SetplayPage from "./pages/SetplayPage";
import FramePage   from "./pages/FramePage";
import MatchupPage from "./pages/MatchupPage";
import WipPage     from "./pages/WipPage";
import StatsPage   from "./pages/StatsPage";
import HelpPage    from "./pages/HelpPage";
import TweetPage   from "./pages/TweetPage";

const PAGE_COMPONENTS = {
  top:     TopPage,
  move:    MovePage,
  combo:   ComboPage,
  setplay: SetplayPage,
  frame:   FramePage,
  matchup: MatchupPage,
  tweet:   TweetPage,
};

const VALID_TABS = ["top", "move", "combo", "setplay", "frame", "matchup", "tweet"];

export default function App() {
  const [activeChar, setActiveChar] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("char");
    if (c && CHARACTERS.find(ch => ch.id === c)) return c;
    return localStorage.getItem("sf6_last_char") ?? "kimberly";
  });
  const [activeTab, setActiveTab] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("tab");
    return t && VALID_TABS.includes(t) ? t : "top";
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showStats,   setShowStats]   = useState(false);
  const [showHelp,    setShowHelp]    = useState(false);
  const [darkMode,    setDarkMode]    = useState(() => {
    return localStorage.getItem("sf6_theme") !== "light";
  });
  const { favorites, toggle: toggleFav } = useFavorites();
  const { defaultMode, toggle: toggleDefaultMode } = useDefaultMode();

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "" : "light";
    localStorage.setItem("sf6_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("char", activeChar);
    if (activeTab !== "top") params.set("tab", activeTab);
    history.replaceState(null, "", "?" + params.toString());
  }, [activeChar, activeTab]);

  const char = CHARACTERS.find(c => c.id === activeChar);
  const data = CHAR_DATA[activeChar];

  const handleCharChange = id => {
    setActiveChar(id);
    localStorage.setItem("sf6_last_char", id);
    setActiveTab("top");
    setShowStats(false);
    setShowHelp(false);
  };

  const pageTitle = () => {
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? `【スト6】${char.name}の${tab.label.replace(/^.\s/, "")}` : "";
  };

  const PageComponent = PAGE_COMPONENTS[activeTab] ?? null;

  // WIPキャラはすべてのページでWipPageを表示
  const isWip = data?.wip === true;

  return (
    <div style={{
      fontFamily: "sans-serif",
      background: "var(--bg)",
      color: "var(--text)",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <Header
        char={char}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(v => !v)}
        showHelp={showHelp}
        onToggleHelp={() => { setShowHelp(v => !v); setShowStats(false); }}
        defaultMode={defaultMode}
        onToggleDefaultMode={toggleDefaultMode}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          open={sidebarOpen}
          activeChar={activeChar}
          onCharChange={handleCharChange}
          showStats={showStats}
          onShowStats={() => { setShowStats(v => !v); setShowHelp(false); }}
          favorites={favorites}
          onToggleFav={toggleFav}
        />

        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "24px 28px" }}>
          {showHelp ? (
            <div className="page-fade" key="help">
              <HelpPage />
            </div>
          ) : showStats ? (
            <div className="page-fade" key="stats">
              <StatsPage />
            </div>
          ) : (
            <>
              <CharHeader
                char={char}
                activeTab={activeTab}
                onTabChange={tab => { setActiveTab(tab); setShowHelp(false); }}
                isFav={favorites.includes(activeChar)}
                onToggleFav={() => toggleFav(activeChar)}
              />

              {!isWip && (
                <div style={{ marginBottom: 16 }}>
                  <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-white)", marginBottom: 3 }}>
                    {pageTitle()}
                  </h1>
                  <p style={{ fontSize: 11, color: "var(--text-dim)" }}>Street Fighter 6 攻略情報</p>
                </div>
              )}

              <div className="page-fade" key={`${activeChar}-${activeTab}`}>
                {isWip
                  ? <WipPage char={char} />
                  : PageComponent && <PageComponent data={data} char={char} defaultMode={defaultMode} />
                }
              </div>
            </>
          )}
        </main>
      </div>

      <footer style={{
        background: "var(--bg-deep)",
        borderTop: "1px solid var(--bg-active)",
        padding: "11px 28px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 11, color: "var(--text-dim)" }}>🚬 喫煙所 ~SF6支部~</div>
        <div style={{ fontSize: 11, color: "var(--text-dim)" }}>© 2026 ミルク All rights reserved.</div>
      </footer>
    </div>
  );
}
