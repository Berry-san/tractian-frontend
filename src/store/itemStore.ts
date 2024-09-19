import { create } from 'zustand'

interface SelectedItem {
  id: string
  name: string
  type: 'location' | 'asset' | 'component'
  status?: 'operating' | 'critical' | 'alert' | null
  sensorType?: 'energy' | 'vibration' | null
  sensorId?: string | null // Change from `string | null` to just `string | undefined`
}

interface SelectedItemStore {
  selectedItem: SelectedItem | null
  setSelectedItem: (item: SelectedItem) => void
}

export const useSelectedItemStore = create<SelectedItemStore>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
}))
