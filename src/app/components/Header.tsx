import { useState, useEffect, useRef } from "react";
import { Search, Bell, MessageCircle, LogOut, Plus, Users } from "lucide-react";
import logo from "../assets/logo.png";
import { useAppContext } from "../../AppContext";
import { FriendUser } from "../hooks/useFriends";

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    setTabMenuOpen,
    openTab,
    openUserProfile,
    onLogout,
    currentUser,
  } = useAppContext();

  // ── People search (@ prefix) ─────────────────────────────────────────────
  const [userResults, setUserResults] = useState<FriendUser[]>([]);
  const [userSearching, setUserSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPeopleSearch = searchQuery.startsWith("@");
  const peopleQuery = isPeopleSearch ? searchQuery.slice(1) : "";

  useEffect(() => {
    if (!isPeopleSearch || !peopleQuery.trim()) {
      setUserResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setUserSearching(true);
      try {
        const res = await fetch(
          `/api/users.php?action=search&q=${encodeURIComponent(peopleQuery)}&exclude_id=${currentUser?.user_id ?? 0}`,
          { credentials: "include" },
        );
        const data = await res.json();
        setUserResults(Array.isArray(data) ? data : []);
        setShowDropdown(true);
      } catch {
        /* ignore */
      } finally {
        setUserSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isPeopleSearch, peopleQuery, currentUser?.user_id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleUserClick = (user: FriendUser) => {
    openUserProfile(user.user_id, user.username);
    setShowDropdown(false);
    setSearchQuery("");
  };

  return (
    <>
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-gray-600 text-white rounded-full p-2">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
          </div>
          <span className="font-semibold text-xl">Chpinterest</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-3xl relative" ref={dropdownRef}>
          <div className="relative">
            {isPeopleSearch ? (
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            )}
            <input
              type="text"
              placeholder="Search for ideas… or type @name to find people"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                isPeopleSearch &&
                userResults.length > 0 &&
                setShowDropdown(true)
              }
              className={`w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 hover:bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                isPeopleSearch ? "focus:ring-blue-400" : "focus:ring-blue-500"
              }`}
            />
            {isPeopleSearch && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-blue-400 font-medium">
                People
              </span>
            )}
          </div>

          {/* User search dropdown */}
          {showDropdown && isPeopleSearch && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {userSearching ? (
                <div className="flex justify-center py-4">
                  <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-400 rounded-full animate-spin" />
                </div>
              ) : userResults.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">
                  No users found
                </p>
              ) : (
                userResults.map((user) => {
                  const avatar =
                    user.profile_picture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&size=36&background=random`;
                  return (
                    <button
                      key={user.user_id}
                      onClick={() => handleUserClick(user)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-all text-left"
                    >
                      <img
                        src={avatar}
                        alt={user.username}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-400">View profile →</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setTabMenuOpen(true)}
            title="Open tab (Ctrl+T)"
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <Plus className="w-6 h-6 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <Bell className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={() => openTab("chats")}
            title="Messages"
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <MessageCircle className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={onLogout}
            title="Logout"
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <LogOut className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Category pills — hidden during people search */}
      {!isPeopleSearch && (
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
