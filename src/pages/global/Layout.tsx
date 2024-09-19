import { Outlet } from 'react-router-dom'
import Header from './Header'
import Dashboard from '../Dashboard'
import { useCompanyStore } from '../../store/companyStore'
import { useFilterStore } from '../../store/filterStore'
import TreeView from '../../components/TreeView'
import spark from '../../assets/icons/spark.svg'
import critical from '../../assets/icons/critical.svg'
import activeSpark from '../../assets/icons/activeSpark.svg'
import activeCritical from '../../assets/icons/activeCritical.svg'

const Layout = () => {
  const {
    toggleEnergySensors,
    toggleCriticalStatus,
    showEnergySensors,
    showCriticalStatus,
  } = useFilterStore()
  const { selectedCompany } = useCompanyStore()

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#E3EAEF]">
      <Header />
      <div className="m-2 flex-1 flex flex-col pt-5 px-3 py-3 bg-white rounded">
        {/* Sub Heading */}
        <div className="flex justify-between items-center mb-2">
          <div className="">
            <p className="font-semibold text-xl">
              Ativos{' '}
              <span className="text-gray-400 text-sm">
                / {selectedCompany?.name} Unit
              </span>
            </p>
          </div>
          <div className="flex space-x-4">
            {/* Energy Sensor Button */}
            <button
              onClick={toggleEnergySensors}
              className={`flex items-center border px-4 py-2 space-x-2 rounded ${
                showEnergySensors
                  ? 'bg-blue-500 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {showEnergySensors ? (
                <img src={activeSpark} alt="" />
              ) : (
                <img src={spark} alt="" />
              )}
              <span>Sensor de Energia</span>
            </button>

            {/* Critical Status Button */}
            <button
              onClick={toggleCriticalStatus}
              className={`flex items-center border px-4 py-2 space-x-2 rounded ${
                showCriticalStatus
                  ? 'bg-blue-500 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {showCriticalStatus ? (
                <img src={activeCritical} alt="" />
              ) : (
                <img src={critical} alt="" />
              )}
              <span>Crítico</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 flex-1">
          {/* Sidebar is in the first column */}
          <div className="col-span-1 h-full border border-gray-300">
            <TreeView />
          </div>

          {/* Main content */}
          <main className="col-span-2 h-full max-w-screen-2xl border border-gray-300">
            <Dashboard />
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout
