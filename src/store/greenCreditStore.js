import { create } from "zustand";
import { APIURL } from "../constant/type";

const useGreenCreditStore = create((set) => ({
  credits: [],
  creditDetail: {},
  loading: true,
  error: null,

  fetchCredits: async (id = 0) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${APIURL}/green-credit/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch green credits");
      }

      const data = await response.json();

      set({ loading: false, creditDetail: data[0] });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchFeaturedCredits: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${APIURL}/green-credit`);

      if (!response.ok) {
        throw new Error("Failed to fetch green credits");
      }

      const datas = await response.json();

      set({ credits: datas, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addCredit: (credit) =>
    set((state) => ({
      credits: [...state.credits, credit],
    })),

  updateCredit: (id, updatedCredit) =>
    set((state) => ({
      credits: state.credits.map((credit) =>
        credit.id === id ? { ...credit, ...updatedCredit } : credit
      ),
    })),

  deleteCredit: (id) =>
    set((state) => ({
      credits: state.credits.filter((credit) => credit.id !== id),
    })),

  resetStore: () => set({ credits: [], loading: false, error: null }),
}));

export default useGreenCreditStore;
