import { createContext, useContext } from "react";
import { Theme } from "./app/themes";

export interface PinImage {
  image_id: number;
  image_path: string;
  image_type: "url" | "upload";
  sort_order: number;
}

export interface Pin {
  pin_id: number;
  board_id: number;
  user_id: number;
  title: string;
  description: string;
  image_url: string; // первое фото для превью
  link_url: string | null;
  created_at: string;
  images: PinImage[]; // все медиа
  username?: string; // из JOIN с users
  author_picture?: string | null; // profile_picture автора
  likes_count?: number;
  category: string;
}

interface AppContextType {
  currentUser: {
    user_id: number;
    username: string;
    profile_picture?: string | null;
  };
  onLogout: () => void;
  id: number;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  openTab: (tabId: string) => void;
  openChat: (toUserId: number, toUsername: string) => void;
  openUserProfile: (userId: number, username: string) => void;
  refetchPins: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  categories: string[];
  filteredPins: Pin[];
  loading: boolean;
  error: string | null;
  selectedPin: Pin | null;
  setSelectedPin: (pin: Pin | null) => void;
  uploadOpen: boolean;
  setUploadOpen: (v: boolean) => void;
  tabMenuOpen: boolean;
  setTabMenuOpen: (v: boolean) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);
export const useAppContext = () => useContext(AppContext);
