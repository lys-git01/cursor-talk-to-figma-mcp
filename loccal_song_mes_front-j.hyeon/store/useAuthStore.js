import { create } from "zustand";

export const useAuthStore = create((set) => ({
  userInfo: null,
  isAuthLoaded: false, // 추가됨
  setUserInfo: (user) => {
    localStorage.setItem("userInfo", JSON.stringify(user));
    set({ userInfo: user });
  },
  loadUserInfo: () => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      set({ userInfo: JSON.parse(storedUser), isAuthLoaded: true });
    } else {
      set({ isAuthLoaded: true }); // 로딩은 완료되었지만 사용자 없음
    }
  },
  logout: () => {
    localStorage.removeItem("userInfo");
    set({ userInfo: null });
  },
}));
