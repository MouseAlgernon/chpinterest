import React, { useState, useRef, useEffect, useCallback } from "react";
import DockLayout from "rc-dock";
import "rc-dock/dist/rc-dock.css";
import { AppContext } from "../AppContext";
import Header from "./components/Header";
import GalleryTab from "./components/GalleryTab";
import PinDetailTab from "./components/PinDetailTab";
import CreatePinTab from "./components/CreatePinTab";
import FriendsTab from "./components/FriendsTab";
import ChatsTab from "./components/ChatsTab";
import ChatTab from "./components/ChatTab";
import UserProfileTab from "./components/UserProfileTab";
import SettingsTab from "./components/SettingsTab";
import { usePins } from "./hooks/usePins";
import { themes, Theme } from "./themes";
import { Eye, EyeOff } from "lucide-react";

// Tabs shown in the tab picker.
const availableTabs = [
  { id: "main", title: "Gallery", label: "Gallery" },
  { id: "createPin", title: "Create Pin", label: "Create Pin" },
  { id: "pinDetail", title: "View Pin", label: "View Pin" },
  { id: "chats", title: "Messages", label: "Messages" },
  { id: "friends", title: "Friends", label: "Friends" },
  { id: "profile", title: "My Profile", label: "My Profile" },
  { id: "settings", title: "Settings", label: "Settings" },
];

// Static props for tabs restored from local storage.
const permanentTabProps: Record<string, { title: string; closable: boolean }> =
  {
    header: { title: "navbar", closable: false },
  };

interface AppProps {
  user: { user_id: number; username: string; profile_picture?: string | null };
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
  // Save dynamic titles so restored tabs keep readable names.
  const [tabTitles, setTabTitles] = useState<Record<string, string>>({});

  const dockRef = useRef<DockLayout>(null);

  const { pins, loading, error, refetch } = usePins();

  const categories = [
    "All",
    "Nature",
    "Food",
    "Architecture",
    "Fashion",
    "Other",
  ];

  const filteredPins = pins.filter((pin) => {
    const matchesSearch =
      pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || pin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Build content for static and dynamic tabs.
  const makeTabContent = useCallback(
    (tabId: string): React.ReactElement => {
      if (tabId === "header") return <Header />;
      if (tabId === "main") return <GalleryTab />;
      if (tabId === "createPin") return <CreatePinTab />;
      if (tabId === "pinDetail") return <PinDetailTab />;
      if (tabId === "chats") return <ChatsTab />;
      if (tabId === "friends") return <FriendsTab />;
      if (tabId === "settings") return <SettingsTab />;
      if (tabId === "profile")
        return <UserProfileTab userId={user.user_id} isOwnProfile />;
      if (tabId.startsWith("chat:")) {
        const toUserId = parseInt(tabId.split(":")[1], 10);
        return <ChatTab toUserId={toUserId} />;
      }
      if (tabId.startsWith("userprofile:")) {
        const uid = parseInt(tabId.split(":")[1], 10);
        return <UserProfileTab userId={uid} />;
      }
      return (
        <div className="p-4 text-gray-400 text-sm">Unknown tab: {tabId}</div>
      );
    },
    [user.user_id],
  );

  // Rebuild saved layout and inject live React nodes.
  const cleanLayoutWithContent = useCallback(
    (savedLayout: any, savedTitles: Record<string, string>) => {
      if (!savedLayout?.dockbox) return null;

      const processBox = (box: any): any => {
        if (box.tabs) {
          return {
            ...box,
            tabs: box.tabs.map((tab: any) => {
              const tabDef = availableTabs.find((t) => t.id === tab.id);
              const permProps = permanentTabProps[tab.id];
              const dynamicTitle = savedTitles[tab.id];
              return {
                ...tab,
                title:
                  tabDef?.title ??
                  permProps?.title ??
                  dynamicTitle ??
                  tab.title ??
                  tab.id,
                content: makeTabContent(tab.id),
                ...(permProps ? { closable: permProps.closable } : {}),
              };
            }),
          };
        }
        if (box.children) {
          return { ...box, children: box.children.map(processBox) };
        }
        return box;
      };

      return { ...savedLayout, dockbox: processBox(savedLayout.dockbox) };
    },
    [makeTabContent],
  );

  // Use a minimal layout on first load.
  const initializeDefaultLayout = () => {
    setDefaultLayout({
      dockbox: {
        mode: "horizontal" as const,
        children: [
          {
            tabs: [
              {
                id: "header",
                title: "navbar",
                content: <Header />,
                closable: false,
              },
            ],
          },
        ],
      },
    });
  };

  // Restore layout and UI state on mount.
  useEffect(() => {
    const savedLayout = localStorage.getItem("dock-layout");
    const savedPin = localStorage.getItem("selected-pin");
    const savedSearch = localStorage.getItem("search-query");
    const savedCategory = localStorage.getItem("selected-category");
    const savedHidden = localStorage.getItem("hidden-tabs");
    const savedTitleRaw = localStorage.getItem("tab-titles");

    let restoredTitles: Record<string, string> = {};
    if (savedTitleRaw) {
      try {
        restoredTitles = JSON.parse(savedTitleRaw);
      } catch {
        /* ignore */
      }
    }
    setTabTitles(restoredTitles);

    if (savedHidden) {
      try {
        setHiddenTabs(new Set(JSON.parse(savedHidden)));
      } catch {
        /* ignore */
      }
    }
    if (savedSearch) {
      try {
        setSearchQuery(JSON.parse(savedSearch));
      } catch {
        /* ignore */
      }
    }
    if (savedCategory) {
      try {
        setSelectedCategory(JSON.parse(savedCategory));
      } catch {
        /* ignore */
      }
    }
    if (savedPin) {
      try {
        setSelectedPin(JSON.parse(savedPin));
      } catch {
        /* ignore */
      }
    }

    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        const cleaned = cleanLayoutWithContent(parsed, restoredTitles);
        if (cleaned) {
          setDefaultLayout(cleaned);
        } else {
          initializeDefaultLayout();
        }
      } catch {
        initializeDefaultLayout();
      }
    } else {
      initializeDefaultLayout();
    }
    // This callback is stable here, so one mount pass is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save layout and small UI state in the background.
  useEffect(() => {
    const interval = setInterval(() => {
      if (dockRef.current) {
        try {
          const layout = dockRef.current.saveLayout();
          if (layout)
            localStorage.setItem("dock-layout", JSON.stringify(layout));
        } catch {
          /* ignore */
        }
      }
      try {
        localStorage.setItem("search-query", JSON.stringify(searchQuery));
        localStorage.setItem(
          "selected-category",
          JSON.stringify(selectedCategory),
        );
        localStorage.setItem(
          "hidden-tabs",
          JSON.stringify(Array.from(hiddenTabs)),
        );
        localStorage.setItem("tab-titles", JSON.stringify(tabTitles));
      } catch {
        /* ignore */
      }
      if (selectedPin) {
        try {
          localStorage.setItem("selected-pin", JSON.stringify(selectedPin));
        } catch {
          /* ignore */
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedPin, searchQuery, selectedCategory, hiddenTabs, tabTitles]);

  // Hide or show a tab in the picker.
  const toggleTabVisibility = (tabId: string) => {
    setHiddenTabs((prev) => {
      const next = new Set(prev);
      next.has(tabId) ? next.delete(tabId) : next.add(tabId);
      return next;
    });
  };

  // Open a static tab as a floating panel.
  const openTab = (tabId: string) => {
    if (hiddenTabs.has(tabId)) return;
    if (dockRef.current?.find(tabId)) {
      setTabMenuOpen(false);
      return;
    }
    const tabDef = availableTabs.find((t) => t.id === tabId);
    dockRef.current?.dockMove(
      {
        id: tabId,
        title: tabDef?.title ?? tabId,
        content: makeTabContent(tabId),
        closable: true,
      },
      null,
      "float",
    );
    setTabMenuOpen(false);
  };

  // Open one chat tab per target user.
  const openChat = useCallback((toUserId: number, toUsername: string) => {
    const tabId = `chat:${toUserId}`;
    const title = `💬 ${toUsername}`;
    setTabTitles((prev) => ({ ...prev, [tabId]: title }));
    if (dockRef.current?.find(tabId)) return;
    dockRef.current?.dockMove(
      {
        id: tabId,
        title,
        content: <ChatTab toUserId={toUserId} />,
        closable: true,
      },
      null,
      "float",
    );
  }, []);

  // Open one profile tab per target user.
  const openUserProfile = useCallback((userId: number, username: string) => {
    const tabId = `userprofile:${userId}`;
    const title = `@${username}`;
    setTabTitles((prev) => ({ ...prev, [tabId]: title }));
    if (dockRef.current?.find(tabId)) return;
    dockRef.current?.dockMove(
      {
        id: tabId,
        title,
        content: <UserProfileTab userId={userId} />,
        closable: true,
      },
      null,
      "float",
    );
  }, []);

  // Open the pin detail tab next to the gallery.
  const openPinDetail = (pin: any) => {
    setSelectedPin(pin);
    if (hiddenTabs.has("pinDetail")) return;
    if (!dockRef.current?.find("pinDetail")) {
      const tabDef = availableTabs.find((t) => t.id === "pinDetail");
      dockRef.current?.dockMove(
        {
          id: "pinDetail",
          title: tabDef?.title ?? "View Pin",
          content: <PinDetailTab />,
          closable: true,
        },
        "main",
        "after-tab",
      );
    }
  };

  // Ctrl+T toggles the tab picker.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "t") {
        e.preventDefault();
        setTabMenuOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <AppContext.Provider
      value={{
        id: 0,
        currentTheme,
        setTheme,
        currentUser: user,
        onLogout,
        openTab,
        openChat,
        openUserProfile,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        categories,
        filteredPins,
        loading,
        error,
        selectedPin,
        setSelectedPin: openPinDetail,
        uploadOpen,
        setUploadOpen,
        refetchPins: refetch,
        tabMenuOpen,
        setTabMenuOpen,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        {/* Soft hint shown behind floating panels. */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <p className="text-gray-300 text-sm">Ctrl+T — open tab</p>
        </div>

        {defaultLayout && (
          <DockLayout
            ref={dockRef}
            defaultLayout={defaultLayout}
            style={{ position: "absolute", inset: 0 }}
          />
        )}

        {/* Tab picker overlay. */}
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
                <kbd className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Ctrl+T
                </kbd>
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
                      title={hiddenTabs.has(tab.id) ? "Show tab" : "Hide tab"}
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
