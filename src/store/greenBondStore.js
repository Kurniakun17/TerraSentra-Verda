import { create } from "zustand";
import { APIURL } from "../constant/type";
import axios from "axios";

const useGreenBondStore = create((set) => ({
  bonds: [],
  bondDetail: {},
  insights: "",
  loading: false,
  error: null,

  fetchBonds: async ({ id }) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${APIURL}/green-bond/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch green bonds");
      }

      const datas = await response.json();

      set({ bondDetail: datas[0], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  generateInsights: async ({
    aqiScore,
    location,
    carbonAbsorbed,
    projectName,
  }) => {
    const apiKey = "AIzaSyD31L9QSRDJDhehutVdhmDrsdVidr-uhLQ";
    const input = `Buatkan ringkasan singkat dalam bentuk narasi analisis lingkungan berdasarkan 4 variabel berikut:
- Nilai AQI: ${aqiScore}
- Lokasi: ${location}
- Penyerapan karbon oleh proyek: ${carbonAbsorbed} ton/tahun
- Nama proyek: ${projectName}

Gunakan gaya bahasa profesional dan meyakinkan, serta akhiri dengan kesimpulan apakah proyek layak didanai dan potensial untuk carbon credit. Panjang output sekitar 50 kata.
`;
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: input,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res.data.candidates[0].content.parts[0].text);
      // setResponse(res.data.predictions[0].content);
    } catch (error) {
      console.error("Error:", error);
      // setResponse("An error occurred.");
    }
  },

  fetchFeaturedBonds: async ({ amount = 0 }) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${APIURL}/green-bond`);

      if (!response.ok) {
        throw new Error("Failed to fetch green bonds");
      }

      const data = await response.json();

      set({ bonds: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addBond: (bond) =>
    set((state) => ({
      bonds: [...state.bonds, bond],
    })),

  updateBond: (id, updatedBond) =>
    set((state) => ({
      bonds: state.bonds.map((bond) =>
        bond.id === id ? { ...bond, ...updatedBond } : bond
      ),
    })),

  deleteBond: (id) =>
    set((state) => ({
      bonds: state.bonds.filter((bond) => bond.id !== id),
    })),

  createBond: async (bondData) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${APIURL}/green-bond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bondData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create green bond");
      }

      const data = await response.json();

      set((state) => ({
        bonds: [...state.bonds, data],
        loading: false,
      }));

      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  resetStore: () => set({ bonds: [], loading: false, error: null }),
}));

export default useGreenBondStore;
