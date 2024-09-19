import React, { useEffect, useState } from 'react'
import { useFilterStore } from '../store/filterStore'
import TreeNode from './TreeNode'
import axios from 'axios'
import { useCompanyStore } from '../store/companyStore'

interface TreeNodeProps {
  id: string
  name: string
  type: 'location' | 'asset' | 'component'
  children?: TreeNodeProps[]
  status?: 'operating' | 'critical' | 'alert' | null
  sensorType?: 'energy' | 'vibration' | null
  sensorId?: string | null
  parentId?: string | null
  locationId?: string | null
}

const TreeView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [treeData, setTreeData] = useState<TreeNodeProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { showEnergySensors, showCriticalStatus } = useFilterStore()
  const { selectedCompany } = useCompanyStore()

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

        const mappedTree = mapDataToTree(locations, assets)
        setTreeData(mappedTree)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch data')
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCompany])

  const mapDataToTree = (locations: any[], assets: any[]): TreeNodeProps[] => {
    const locationMap: { [key: string]: TreeNodeProps } = {}
    locations.forEach((location) => {
      locationMap[location.id] = {
        id: location.id,
        name: location.name,
        type: 'location',
        children: [],
      }
    })

    assets.forEach((asset) => {
      const assetNode: TreeNodeProps = {
        id: asset.id,
        name: asset.name,
        type: asset.sensorType ? 'component' : 'asset',
        status: asset.status || null,
        sensorType: asset.sensorType || null,
        sensorId: asset.sensorId || undefined, // Ensure null becomes undefined
        parentId: asset.parentId,
        locationId: asset.locationId,
        children: [],
      }

      // Add the asset node to either the parent location or another asset
      if (asset.parentId) {
        const parentAsset =
          locationMap[asset.parentId] ||
          assets.find((a) => a.id === asset.parentId)
        if (parentAsset) {
          parentAsset.children = parentAsset.children || []
          parentAsset.children.push(assetNode)
        }
      } else if (asset.locationId) {
        const parentLocation = locationMap[asset.locationId]
        if (parentLocation) {
          parentLocation.children = parentLocation.children || []
          parentLocation.children.push(assetNode)
        }
      }
    })

    return Object.values(locationMap)
  }

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
      .filter((node): node is TreeNodeProps => node !== null)
  }

  const filteredTreeData = filterTree(treeData)

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-gray-300 p-2">
        <input
          type="text"
          placeholder="Search Asset or Location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 w-full focus:outline-none"
        />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {filteredTreeData.map((node, index) => (
          <TreeNode key={index} {...node} />
        ))}
      </div>
    </div>
  )
}

export default TreeView
