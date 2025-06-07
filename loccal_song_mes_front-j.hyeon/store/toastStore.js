import { create } from "zustand";

const useToastStore = create((set) => ({
  toastRef: null,
  setToastRef: (ref) => set({ toastRef: ref }),
  showToast: (message) =>
    set((state) => {
      if (state.toastRef) {
        state.toastRef.show(message);
      }
      return {};
    }),
}));

export default useToastStore;
