import { create } from 'zustand'

// Define the interface for the store state
interface Company {
  id: string
  name: string
}

interface CompanyStore {
  selectedCompany: Company | null
  setSelectedCompany: (company: Company) => void
}

// Create the Zustand store
export const useCompanyStore = create<CompanyStore>((set) => ({
  selectedCompany: null,
  setSelectedCompany: (company) => set({ selectedCompany: company }),
}))
