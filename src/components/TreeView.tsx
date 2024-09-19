import React, { useEffect, useState } from 'react'
import { useFilterStore } from '../store/filterStore'
import TreeNode from './TreeNode'
import axios from 'axios'
import { useCompanyStore } from '../store/companyStore'

// Define the TreeNodeProps interface
interface TreeNodeProps {
  id: string
  name: string
  type: 'location' | 'asset' | 'component'
  children?: TreeNodeProps[]
  status?: 'operating' | 'critical' | null
  sensorType?: 'energy' | 'vibration' | null
  parentId?: string | null
  locationId?: string | null
}

// Define the component
const TreeView: React.FC = () => {
  // Local state for search query
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [treeData, setTreeData] = useState<TreeNodeProps[]>([]) // State for storing the tree data
  const [loading, setLoading] = useState<boolean>(true) // Loading state
  const [error, setError] = useState<string | null>(null) // Error state

  // Zustand for filter state
  const { showEnergySensors, showCriticalStatus } = useFilterStore()
  const { selectedCompany } = useCompanyStore() // Get the selected company from Zustand

  // Fetch locations and assets for the selected company
  useEffect(() => {
    if (!selectedCompany) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [locationsResponse, assetsResponse] = await Promise.all([
          axios.get(
            `https://fake-api.tractian.com/companies/${selectedCompany.id}/locations`
          ),
          axios.get(
            `https://fake-api.tractian.com/companies/${selectedCompany.id}/assets`
          ),
        ])

        const locations = locationsResponse.data
        const assets = assetsResponse.data

        const mappedTree = mapDataToTree(locations, assets) // Map and structure the data (same as before)
        setTreeData(mappedTree)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch data')
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCompany]) // Fetch new data when selected company changes

  // Function to map the data from API into TreeNodeProps structure
  const mapDataToTree = (locations: any[], assets: any[]): TreeNodeProps[] => {
    // Map locations into tree nodes
    const locationMap: { [key: string]: TreeNodeProps } = {}
    locations.forEach((location) => {
      locationMap[location.id] = {
        id: location.id,
        name: location.name,
        type: 'location',
        children: [],
      }
    })

    // Map assets into the corresponding locations
    assets.forEach((asset) => {
      const assetNode: TreeNodeProps = {
        id: asset.id,
        name: asset.name,
        type: asset.sensorType ? 'component' : 'asset',
        status: asset.status || null,
        sensorType: asset.sensorType || null,
        parentId: asset.parentId,
        locationId: asset.locationId,
        children: [],
      }

      if (asset.parentId) {
        // Asset is a sub-asset of another asset
        const parentAsset =
          locationMap[asset.parentId] ||
          assets.find((a) => a.id === asset.parentId)
        if (parentAsset) {
          parentAsset.children = parentAsset.children || []
          parentAsset.children.push(assetNode)
        }
      } else if (asset.locationId) {
        // Asset belongs to a location
        const parentLocation = locationMap[asset.locationId]
        if (parentLocation) {
          parentLocation.children = parentLocation.children || []
          parentLocation.children.push(assetNode)
        }
      }
    })

    // Return locations as the root nodes
    return Object.values(locationMap)
  }

  // Filter logic with fallback to full tree when no filters or search are applied
  const filterTree = (nodes: TreeNodeProps[]): TreeNodeProps[] => {
    if (!searchQuery && !showEnergySensors && !showCriticalStatus) {
      return nodes
    }

    return nodes
      .map((node: TreeNodeProps): TreeNodeProps | null => {
        const filteredChildren = node.children ? filterTree(node.children) : []

        const matchesSearch = node.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        const matchesEnergySensor =
          node.sensorType === 'energy' && showEnergySensors
        const matchesCriticalStatus =
          node.status === 'critical' && showCriticalStatus

        if (
          (searchQuery && matchesSearch) ||
          (showEnergySensors && matchesEnergySensor) ||
          (showCriticalStatus && matchesCriticalStatus) ||
          filteredChildren.length > 0
        ) {
          return { ...node, children: filteredChildren }
        }
        return null
      })
      .filter((node): node is TreeNodeProps => node !== null) // Type guard to filter out null values
  }

  const filteredTreeData = filterTree(treeData)

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="h-screen flex flex-col">
      {/* Search Bar */}
      <div className="border-b border-gray-300 p-2">
        <input
          type="text"
          placeholder="Buscar Ativo ou Local"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 w-full focus:outline-none"
        />
      </div>

      {/* Tree Structure */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredTreeData.map((node, index) => (
          <TreeNode key={index} {...(node as TreeNodeProps)} />
        ))}
      </div>
    </div>
  )
}

export default TreeView
