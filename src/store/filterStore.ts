import { create } from 'zustand'

interface FilterState {
  showEnergySensors: boolean
  showCriticalStatus: boolean
  toggleEnergySensors: () => void
  toggleCriticalStatus: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  showEnergySensors: false,
  showCriticalStatus: false,

  // Toggle energy sensors, ensure critical status is off if energy sensors are being turned on
  toggleEnergySensors: () =>
    set((state) => ({
      showEnergySensors: !state.showEnergySensors,
      showCriticalStatus: state.showEnergySensors
        ? state.showCriticalStatus
        : false, // Only deactivate the other if activating this
    })),

  // Toggle critical status, ensure energy sensors are off if critical status is being turned on
  toggleCriticalStatus: () =>
    set((state) => ({
      showCriticalStatus: !state.showCriticalStatus,
      showEnergySensors: state.showCriticalStatus
        ? state.showEnergySensors
        : false, // Only deactivate the other if activating this
    })),
}))
