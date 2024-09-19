import { useSelectedItemStore } from '../store/itemStore'
import motor1 from '../assets/images/motor1.png'
import sensor from '../assets/icons/sensor.svg'
import receptor from '../assets/icons/receptor.svg'
import greenSpark from '../assets/icons/greenSpark.svg'
import failure from '../assets/icons/failure.svg'
import success from '../assets/icons/success.svg'

const Dashboard: React.FC = () => {
  const { selectedItem } = useSelectedItemStore()

  const getStatusIcon = () => {
    if (selectedItem?.status === 'critical') return <img src={failure} alt="" />
    if (selectedItem?.status === 'operating')
      return <img src={success} alt="" />
    if (selectedItem?.status === 'alert') return <img src={greenSpark} alt="" />
    return null
  }

  if (!selectedItem) {
    return (
      <div className="p-5">
        <p>
          No asset or component selected. Please select one from the tree view.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col font-inter divide-y">
      <div className="py-2 px-5 space-x-2 text-xl font-semibold items-center flex">
        <span>{selectedItem.name}</span>
        <span>{getStatusIcon()}</span>
      </div>
      <div className="p-5">
        <section className="grid grid-cols-2 pb-4 border-b border-gray-300 gap-5 items-center justify-center">
          <div className="col-span-2 md:col-span-1">
            <img src={motor1} className="h-52 w-full object-fill" alt="" />
          </div>
          <div className="col-span-2 md:col-span-1 divide-y divide-gray-300">
            <div className="pb-5">
              <p className="font-bold text-base">Tipo de Equipamento</p>
              <p className="text-[#88929C] font-bold text-base">
                Motor Elétrico (Trifásico)
              </p>
            </div>
            <div className="pt-5 space-y-3">
              <p className="font-bold text-base">Responsáveis</p>
              <p className="text-[#88929C] font-bold text-base">
                <span className="px-3 py-2 mb-2 bg-[#2188FF] text-white rounded-full">
                  E
                </span>{' '}
                Elétrica
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 pt-5">
          <div className="space-y-2">
            <h2 className="font-semibold text-base">Sensor</h2>
            <div className="col-span-2 md:col-span-1 space-x-3 flex items-center">
              <img src={sensor} alt="sensor" className="w-5 h-5" />
              <p className="text-[#88929C]">{selectedItem.sensorId || 'N/A'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold  text-base">Receptor</h2>
            <div className="col-span-2 md:col-span-1 space-x-3 flex items-center">
              <img src={receptor} alt="receptor" className="w-5 h-5" />
              <p className="text-[#88929C]">EUH4R27</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
