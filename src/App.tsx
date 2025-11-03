import { useEffect, useState } from 'react'
import './App.css'
import { fetchHouses, updateCandy } from './api'
import HousesTable from './components/HousesTable'
import type { House } from './types'

function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [houses, setHouses] = useState<House[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const loadHouses = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchHouses()
      setHouses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load houses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHouses()
  }, [])

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpdateCandy = async (houseId: number, inStock: boolean) => {
    try {
      await updateCandy(houseId, inStock)
      await loadHouses()
      showToast(`Candy ${inStock ? 'filled' : 'emptied'}`)
    } catch (err) {
      showToast('Failed to update candy')
      throw err
    }
  }

  const handleBulkUpdate = async (inStock: boolean) => {
    showToast(`${inStock ? 'Filling' : 'Emptying'} all candy...`)
    try {
      await Promise.all(houses.map(h => updateCandy(h.id, inStock)))
      await loadHouses()
      showToast(`All candy ${inStock ? 'filled' : 'emptied'}`)
    } catch (err) {
      showToast('Bulk update failed')
    }
  }

  return (
    <div className="App">
      <div style={{ padding: '16px', background: '#fef3c7', borderBottom: '2px solid #f59e0b' }}>
        <strong>Debug Controls:</strong>
        <button onClick={() => handleBulkUpdate(true)} style={{ marginLeft: 8 }}>
          Fill All
        </button>
        <button onClick={() => handleBulkUpdate(false)} style={{ marginLeft: 8 }}>
          Empty All
        </button>
        <button onClick={loadHouses} style={{ marginLeft: 8 }}>
          Refresh
        </button>
      </div>
      
      <HousesTable 
        loading={loading} 
        error={error} 
        houses={houses} 
        onUpdateCandy={handleUpdateCandy}
      />
      
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            background: '#1f2937',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 6,
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
          }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
