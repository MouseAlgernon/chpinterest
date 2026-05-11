import React, { useState, useRef, useEffect } from "react";
import DockLayout from 'rc-dock';
import 'rc-dock/dist/rc-dock.css';
import { AppContext } from "../AppContext";
import Header from "./components/Header";
import GalleryTab from "./components/GalleryTab";
import PinDetailTab from "./components/PinDetailTab";
import UploadModal from "./components/UploadModal";
import { usePins } from "./hooks/usePins";
import { themes, Theme } from './themes';
import SettingsTab from "./components/SettingsTab";





const availableTabs = [
  { id: 'main',      title: 'gallery'       },
  { id: 'pinDetail', title: 'view pin' },
  { id: 'profile',   title: 'profile'       },
  { id: 'settings',  title: 'settings'     },
];

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const setTheme = (theme: Theme) => {
  setCurrentTheme(theme);
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPin, setSelectedPin] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [tabMenuOpen, setTabMenuOpen] = useState(false);
  const dockRef = useRef<DockLayout>(null);

  const { pins, loading, error, refetch } = usePins();

  const categories = ["All", "Nature", "Food", "Architecture", "Fashion", "Other"];

  const filteredPins = pins.filter((pin) => {
    const matchesSearch =
      pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || pin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const tabContent: Record<string, React.ReactElement> = {

    header:    <Header />,
    main:      <GalleryTab />,
    pinDetail: <PinDetailTab />,
    profile:   <div className="p-6 text-gray-500">Profile — coming soon</div>,
    settings: <div className="p-6 text-gray-500">Settings — coming soon</div>,
  };

const openTab = (tabId: string) => {
  const existing = dockRef.current?.find(tabId);
  if (existing) {
    setTabMenuOpen(false);
    return;
  }
  const tab = availableTabs.find(t => t.id === tabId);

  dockRef.current?.dockMove(
    {
      id: tabId,
      title: tab?.title ?? tabId,
      content: tabContent[tabId],
      closable: true,
    },
    null,
    'float',
  );
  setTabMenuOpen(false);
};

  const openPinDetail = (pin: any) => {
    setSelectedPin(pin);
    const existing = dockRef.current?.find('pinDetail');
    if (!existing) {
      dockRef.current?.dockMove(
        { id: 'pinDetail', title: 'pin details', content: <PinDetailTab />, closable: true },
        'main',
        'after-tab'
      );
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        setTabMenuOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const defaultLayout = {
    dockbox: {
      mode: 'horizontal' as const,
      children: [{
        tabs: [
          { id: 'header', title: 'header',   content: <Header />,    closable: false },
          { id: 'main',   title: 'gallery', content: <GalleryTab />, closable: true },
        ]
      }]
    }
  };

  return (
    <AppContext.Provider value={{
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      categories, filteredPins,
      loading, error,
      selectedPin, setSelectedPin: openPinDetail,
      uploadOpen, setUploadOpen,
      refetchPins: refetch,
      tabMenuOpen, setTabMenuOpen,
      openTab,
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>

        {/* подсказка на фоне */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <p className="text-gray-300 text-sm">Ctrl+T — open tab</p>
        </div>

        <DockLayout
          ref={dockRef}
          defaultLayout={defaultLayout}
          style={{ position: 'absolute', inset: 0 }}
        />

        <UploadModal />

        {/* меню выбора таба */}
        {tabMenuOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            onClick={() => setTabMenuOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-4 w-72"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="font-semibold text-gray-700">open tab </span>
                <kbd className="text-xs bg-gray-100 px-2 py-1 rounded">Ctrl+T</kbd>
              </div>
              <div className="flex flex-col gap-1">
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => openTab(tab.id)}
                    className="text-left px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all text-sm"
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}