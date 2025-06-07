// useDialogStore.js
import { create } from "zustand";
import { nanoid } from "nanoid"; // npm install nanoid

const useDialogStore = create((set) => ({
  dialogs: [],

  openDialog: (type, props = {}) =>
    set((state) => {
      // 이미 같은 type의 모달이 열려 있으면 무시
      const exists = state.dialogs.some((d) => d.type === type);
      if (exists) {
        return {};
      }
      // 없었으면 새로 추가
      return {
        dialogs: [...state.dialogs, { id: nanoid(), type, props }],
      };
    }),

  closeDialog: (id) =>
    set((state) => ({
      dialogs: state.dialogs.filter((d) => d.id !== id),
    })),

  closeAll: () => set({ dialogs: [] }),
}));

export default useDialogStore;
