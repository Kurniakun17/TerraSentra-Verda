import { create } from "zustand";
import { APIURL } from "../constant/type";

const usePotentialRegion = create((set) => ({
  // State
  regions: [],
  provinces: [],
  regionDetail: {},
  loading: true,
  error: null,

  // Actions
  fetchRegion: async (name) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${APIURL}/get-infrastructure/${name}`);

      if (!response.ok) {
        throw new Error("Failed to fetch green credits");
      }

      const data = await response.json();

      set({ loading: false, regionDetail: data });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchProvinceCity: async (province) => {
    try {
      set({ loading: true, error: null });
      const url = `${APIURL}/get-city-score/${province
        .toLowerCase()
        .replace(" ", "-")}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch green credits");
      }

      const data = await response.json();

      set({ regions: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAllProvince: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${APIURL}/get-infrastructure/all-province`);

      if (!response.ok) {
        throw new Error("Failed to fetch green credits");
      }

      const data = await response.json();

      set({ loading: false, provinces: data });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTopFive: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${APIURL}/get-top-five`);

      if (!response.ok) {
        throw new Error("Failed to fetch green credits");
      }

      const data = await response.json();

      set({ loading: false, regions: data });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default usePotentialRegion;
