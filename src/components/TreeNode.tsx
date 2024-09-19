import React, { useState } from 'react'
import downArrow from '../assets/icons/downArrow.svg'
import locationIcon from '../assets/icons/location.svg'
import assetIcon from '../assets/icons/asset.svg'
import componentIcon from '../assets/icons/components.svg'
import success from '../assets/icons/success.svg'
import failure from '../assets/icons/failure.svg'
import greenSpark from '../assets/icons/greenSpark.svg'

interface TreeNodeProps {
  name: string
  type: 'location' | 'asset' | 'component'
  children?: TreeNodeProps[]
  status?: 'operating' | 'critical' | 'idle' | null
}

const TreeNode: React.FC<TreeNodeProps> = ({
  name,
  type,
  children,
  status,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const getIcon = () => {
    if (type === 'location')
      return <img src={locationIcon} alt="location icon" />
    if (type === 'asset') return <img src={assetIcon} alt="asset icon" />
    if (type === 'component')
      return <img src={componentIcon} alt="component icon" />
    return null
  }

  const getStatusIcon = () => {
    if (status === 'critical') return <img src={failure} alt="" /> // Critical status (red)
    if (status === 'operating') return <img src={success} alt="" /> // Operating status (green)
    if (status === 'idle') return <img src={greenSpark} alt="" /> // Idle status (white)
    return null
  }

  return (
    <div className="mb-2">
      <div
        onClick={toggleOpen}
        className="cursor-pointer flex items-center space-x-2 mb-2"
      >
        {children && children.length > 0 ? (
          <button className="ml-2 text-xs text-gray-500">
            {isOpen ? (
              <img src={downArrow} alt="collapse" />
            ) : (
              <img src={downArrow} alt="expand" />
            )}
          </button>
        ) : (
          <div className="ml-2 w-2.5" /> // Empty placeholder for alignment
        )}
        {getIcon()}
        <span className="ml-2">{name}</span>
        {status && <span>{getStatusIcon()}</span>}
      </div>

      {isOpen && children && (
        <div className="ml-3.5 border-l-2 pl-3">
          {children.map((child, index) => (
            <TreeNode key={index} {...child} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TreeNode
