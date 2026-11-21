import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CarUiStore {
  searchTerm: string;
  showFavoritesOnly: boolean;
  favoriteCarIdsByUser: Record<string, string[]>;
  setSearchTerm: (value: string) => void;
  setShowFavoritesOnly: (value: boolean) => void;
  toggleFavorite: (userId: string, carId: string) => void;
  removeFavorite: (userId: string, carId: string) => void;
  clearFavorites: (userId: string) => void;
}

type PersistedCarUiState = Pick<CarUiStore, 'favoriteCarIdsByUser'>;

export const useCarUiStore = create<CarUiStore>()(
  persist(
    (set) => ({
      searchTerm: '',
      showFavoritesOnly: false,
      favoriteCarIdsByUser: {},

      setSearchTerm: (value) => set({ searchTerm: value }),
      setShowFavoritesOnly: (value) => set({ showFavoritesOnly: value }),

      toggleFavorite: (userId, carId) => set((state) => {
        const current = state.favoriteCarIdsByUser[userId] ?? [];
        const updated = current.includes(carId)
          ? current.filter((item) => item !== carId)
          : [...current, carId];
        return {
          favoriteCarIdsByUser: { ...state.favoriteCarIdsByUser, [userId]: updated },
        };
      }),

      removeFavorite: (userId, carId) => set((state) => ({
        favoriteCarIdsByUser: {
          ...state.favoriteCarIdsByUser,
          [userId]: (state.favoriteCarIdsByUser[userId] ?? []).filter((item) => item !== carId),
        },
      })),

      clearFavorites: (userId) => set((state) => ({
        favoriteCarIdsByUser: { ...state.favoriteCarIdsByUser, [userId]: [] },
      })),
    }),
    {
      name: 'cars-ui-store',
      partialize: (state): PersistedCarUiState => ({
        favoriteCarIdsByUser: state.favoriteCarIdsByUser,
      }),
    },
  ),
);
