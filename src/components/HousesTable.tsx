import { useState } from 'react'
import type { House } from '../types'

interface Props {
  loading: boolean
  error: string | null
  houses: House[]
  onUpdateCandy: (id: number, inStock: boolean) => Promise<void>
}

export default function HousesTable({ loading, error, houses, onUpdateCandy }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  
  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>
  if (houses.length === 0) return <p>No data</p>

  const handleAction = async (id: number, inStock: boolean) => {
    if (loadingId !== null) return
    
    setLoadingId(id)
    try {
      await onUpdateCandy(id, inStock)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  const isLoading = (id: number) => loadingId === id
  
  return (
    <div>
      <h2>Houses / Candy List</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7fafc' }}>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Address</th>
              <th style={cellStyle}>Candy</th>
              <th style={cellStyle}>Allergen Free</th>
              <th style={cellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {houses.map((h) => (
              <tr key={h.id}>
                <td style={cellStyle}>{h.id}</td>
                <td style={cellStyle}>{h.name}</td>
                <td style={cellStyle}>{h.address}</td>
                <td style={cellStyle}>{h.candy_in_stock ? '✓ Yes' : '✗ No'}</td>
                <td style={cellStyle}>{h.allergen_free || 'None'}</td>
                <td style={cellStyle}>
                  {h.candy_in_stock ? (
                    <button
                      disabled={isLoading(h.id)}
                      onClick={() => handleAction(h.id, false)}
                    >
                      {isLoading(h.id) ? '...' : 'Empty'}
                    </button>
                  ) : (
                    <button
                      disabled={isLoading(h.id)}
                      onClick={() => handleAction(h.id, true)}
                    >
                      {isLoading(h.id) ? '...' : 'Fill'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const cellStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  padding: '8px 12px',
  textAlign: 'left',
}
