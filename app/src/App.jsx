import { useEffect, useState } from 'react';
import TopBar from './components/layout/TopBar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Hero from './components/layout/Hero.jsx';
import Home from './components/home/Home.jsx';
import StagePanel from './components/StagePanel.jsx';
import FormatViewer from './components/FormatViewer.jsx';
import { ETAPAS } from './data/etapas.js';

export default function App() {
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = Inicio
  const [openFormat, setOpenFormat] = useState(null);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpenFormat(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const etapa = activeIndex >= 0 ? ETAPAS[activeIndex] : null;

  return (
    <>
      <TopBar />
      <div className="shell">
        <Sidebar etapas={ETAPAS} activeIndex={activeIndex} onSelect={setActiveIndex} />
        <main className="content">
          {etapa ? (
            <>
              <Hero />
              <StagePanel etapa={etapa} onOpenFormat={setOpenFormat} />
            </>
          ) : (
            <Home onSelectStage={setActiveIndex} />
          )}
        </main>
      </div>
      <FormatViewer formato={openFormat} onClose={() => setOpenFormat(null)} />
    </>
  );
}
