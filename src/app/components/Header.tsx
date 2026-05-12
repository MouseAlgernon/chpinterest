import logo from '../assets/logo.png';
import { Search, Bell, MessageCircle, LogOut, Plus } from "lucide-react";
import { useAppContext } from "../../AppContext";

const Header = () => {
  const {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    categories, setTabMenuOpen,
    onLogout,
  } = useAppContext();

  return (
    <>
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-gray-600 text-white rounded-full p-2">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
          </div>
          <span className="font-semibold text-xl">Chpinterest</span>
        </div>

        <div className="flex-1 max-w-3xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 hover:bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTabMenuOpen(true)}
            title="Открыть таб (Ctrl+T)"
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <Plus className="w-6 h-6 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <Bell className="w-6 h-6 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
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
    </>
  );
};

export default Header;