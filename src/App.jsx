import { useState } from "react";
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

const PAGE_COMPONENTS = {
  top:     TopPage,
  move:    MovePage,
  combo:   ComboPage,
  setplay: SetplayPage,
  frame:   FramePage,
  matchup: MatchupPage,
};

export default function App() {
  const [activeChar,  setActiveChar]  = useState("kimberly");
  const [activeTab,   setActiveTab]   = useState("top");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const char = CHARACTERS.find(c => c.id === activeChar);
  const data = CHAR_DATA[activeChar];

  const handleCharChange = id => {
    setActiveChar(id);
    setActiveTab("top");
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
      background: "#0e0e16",
      color: "#e8e8f0",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <Header
        char={char}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          open={sidebarOpen}
          activeChar={activeChar}
          onCharChange={handleCharChange}
        />

        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "24px 28px" }}>
          <CharHeader
            char={char}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {!isWip && (
            <div style={{ marginBottom: 16 }}>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 3 }}>
                {pageTitle()}
              </h1>
              <p style={{ fontSize: 11, color: "#2a2a3e" }}>Street Fighter 6 攻略情報</p>
            </div>
          )}

          <div className="page-fade" key={`${activeChar}-${activeTab}`}>
            {isWip
              ? <WipPage char={char} />
              : PageComponent && <PageComponent data={data} char={char} />
            }
          </div>
        </main>
      </div>

      <footer style={{
        background: "#0a0a12",
        borderTop: "1px solid #161626",
        padding: "11px 28px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 11, color: "#2a2a3e" }}>🚬 喫煙所 ~SF6支部~</div>
        <div style={{ fontSize: 11, color: "#2a2a3e" }}>© 2026 ミルク All rights reserved.</div>
      </footer>
    </div>
  );
}
