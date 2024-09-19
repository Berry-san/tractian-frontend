import React, { useState, useEffect } from 'react'
import axios from 'axios'
import tracLogo from '../../assets/images/LOGO TRACTIAN.png'
import unit from '../../assets/icons/unit.svg'
import { useCompanyStore } from '../../store/companyStore'

interface Company {
  id: string
  name: string
}

const Header: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Get the selected company and setter from Zustand store
  const { selectedCompany, setSelectedCompany } = useCompanyStore()
  console.log(selectedCompany)

  // Fetch companies from the API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          'https://fake-api.tractian.com/companies'
        )
        setCompanies(response.data)
        console.log(response.data)
        setSelectedCompany(response.data[0]) // Select the first company by default
        setLoading(false)
      } catch (error) {
        setError('Failed to fetch companies')
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [setSelectedCompany])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="flex flex-col items-center justify-between bg-[#17192D] mx-auto w-full">
      <div className="flex items-center justify-between w-full px-4 py-2">
        <img src={tracLogo} alt="Logo" />

        {/* Tabs for each company */}
        <div className="hidden md:flex space-x-3">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => setSelectedCompany(company)}
              className={`font-semibold text-white rounded-md px-4 py-2 flex items-center space-x-2 cursor-pointer capitalize ${
                selectedCompany?.id === company.id
                  ? 'border-gray-300 bg-[#2188FF] text-white'
                  : 'bg-[#023B78] text-white'
              }`}
            >
              <img src={unit} className="w-5 h-5" alt="Unit Icon" />
              <p>{company.name} unit</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Header
