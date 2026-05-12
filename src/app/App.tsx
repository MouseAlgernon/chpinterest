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
import { Eye, EyeOff } from "lucide-react";

const availableTabs = [
  { id: 'main',      title: 'Gallery',   label: 'Gallery'  },
  { id: 'pinDetail', title: 'View Pin',  label: 'View Pin' },
  { id: 'profile',   title: 'Profile',   label: 'Profile'  },
  { id: 'settings',  title: 'Settings',   label: 'Settings' },
];
interface AppProps {
  user: { user_id: number; username: string };
  onLogout: () => void;
}

export default function App({ user, onLogout }: AppProps) {
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
  const [defaultLayout, setDefaultLayout] = useState<any>(null);
  const [hiddenTabs, setHiddenTabs] = useState<Set<string>>(new Set());
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

  const tabContent: Record<string, React.ReactElement> = React.useMemo(() => ({
    header:    <Header />,
    main:      <GalleryTab />,
    pinDetail: <PinDetailTab />,
    profile:   <div className="p-6 text-gray-500">Profile — coming soon</div>,
    settings: <div className="p-6 text-gray-500">Settings — coming soon</div>,
  }), []);

  // Helper to clean saved layout and inject fresh components
  const cleanLayoutWithContent = (savedLayout: any) => {
    if (!savedLayout?.dockbox) return null;
    
    const processBox = (box: any): any => {
      if (box.tabs) {
        return {
          ...box,
          tabs: box.tabs.map((tab: any) => {
            const tabDef = availableTabs.find(t => t.id === tab.id);
            return {
              ...tab,
              title: tabDef?.title ?? tab.title,
              content: tabContent[tab.id] || <div>Unknown tab</div>
            };
          })
        };
      }
      if (box.children) {
        return {
          ...box,
          children: box.children.map(processBox)
        };
      }
      return box;
    };

    return {
      ...savedLayout,
      dockbox: processBox(savedLayout.dockbox)
    };
  };

  // Load layout from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('dock-layout');
    const savedSelectedPin = localStorage.getItem('selected-pin');
    const savedSearchQuery = localStorage.getItem('search-query');
    const savedSelectedCategory = localStorage.getItem('selected-category');
    const savedHiddenTabs = localStorage.getItem('hidden-tabs');
    
    if (savedHiddenTabs) {
      try {
        setHiddenTabs(new Set(JSON.parse(savedHiddenTabs)));
      } catch (e) {
        console.error('Failed to restore hidden tabs');
      }
    }
    
    if (savedSearchQuery) {
      try {
        setSearchQuery(JSON.parse(savedSearchQuery));
      } catch (e) {
        console.error('Failed to restore search query');
      }
    }

    if (savedSelectedCategory) {
      try {
        setSelectedCategory(JSON.parse(savedSelectedCategory));
      } catch (e) {
        console.error('Failed to restore selected category');
      }
    }
    
    if (savedSelectedPin) {
      try {
        setSelectedPin(JSON.parse(savedSelectedPin));
      } catch (e) {
        console.error('Failed to restore selected pin');
      }
    }

    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        const cleanedLayout = cleanLayoutWithContent(parsedLayout);
        if (cleanedLayout) {
          setDefaultLayout(cleanedLayout);
        } else {
          initializeDefaultLayout();
        }
      } catch (e) {
        console.log('No saved layout, using default');
        initializeDefaultLayout();
      }
    } else {
      initializeDefaultLayout();
    }
  }, [tabContent]);

  // Save layout and state to localStorage periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (dockRef.current) {
        try {
          const layout = dockRef.current.saveLayout();
          if (layout) {
            localStorage.setItem('dock-layout', JSON.stringify(layout));
          }
        } catch (e) {
          console.error('Failed to save layout');
        }
      }
      
      try {
        localStorage.setItem('search-query', JSON.stringify(searchQuery));
        localStorage.setItem('selected-category', JSON.stringify(selectedCategory));
        localStorage.setItem('hidden-tabs', JSON.stringify(Array.from(hiddenTabs)));
      } catch (e) {
        console.error('Failed to save filters');
      }
      
      if (selectedPin) {
        try {
          localStorage.setItem('selected-pin', JSON.stringify(selectedPin));
        } catch (e) {
          console.error('Failed to save selected pin');
        }
      }
    }, 2000);

    return () => clearInterval(saveInterval);
  }, [selectedPin, searchQuery, selectedCategory, hiddenTabs]);

  const toggleTabVisibility = (tabId: string) => {
    const newHiddenTabs = new Set(hiddenTabs);
    if (newHiddenTabs.has(tabId)) {
      newHiddenTabs.delete(tabId);
    } else {
      newHiddenTabs.add(tabId);
    }
    setHiddenTabs(newHiddenTabs);
  };

  const initializeDefaultLayout = () => {
    setDefaultLayout({
      dockbox: {
        mode: 'horizontal' as const,
        children: [{
          tabs: [
            { id: 'header', title: 'header', content: <Header />, closable: false },
          ]
        }]
      }
    });
  };

const openTab = (tabId: string) => {
  if (hiddenTabs.has(tabId)) {
    return;
  }
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
    if (hiddenTabs.has('pinDetail')) {
      return;
    }
    const existing = dockRef.current?.find('pinDetail');
    if (!existing) {
      const tab = availableTabs.find(t => t.id === 'pinDetail');
      dockRef.current?.dockMove(
        { id: 'pinDetail', title: tab?.title ?? 'pin details', content: <PinDetailTab />, closable: true },
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

  return (
    <AppContext.Provider value={{
      id: 0,
      currentTheme,
      setTheme,
      currentUser: user,
      onLogout,
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

        {defaultLayout && (
          <DockLayout
            ref={dockRef}
            defaultLayout={defaultLayout}
            style={{ position: 'absolute', inset: 0 }}
          />
        )}

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
                <span className="font-semibold text-gray-700">Manage Tabs</span>
                <kbd className="text-xs bg-gray-100 px-2 py-1 rounded">Ctrl+T</kbd>
              </div>
              <div className="flex flex-col gap-1">
                {availableTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all group"
                  >
                    <button
                      onClick={() => !hiddenTabs.has(tab.id) && openTab(tab.id)}
                      disabled={hiddenTabs.has(tab.id)}
                      className="flex-1 text-left text-sm disabled:text-gray-400"
                    >
                      {tab.title}
                    </button>
                    <button
                      onClick={() => toggleTabVisibility(tab.id)}
                      className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title={hiddenTabs.has(tab.id) ? 'Show tab' : 'Hide tab'}
                    >
                      {hiddenTabs.has(tab.id) ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}