/**
 * Halloween Édesség Nyilvántartó Alkalmazás - Fő Komponens
 * 
 * Ez az alkalmazás fő komponense, amely kezeli:
 * - A házak listájának betöltését és tárolását
 * - Új házak hozzáadását
 * - Édesség készlet állapotának frissítését
 * - Sötét/világos téma váltást
 * - Toast értesítések megjelenítését
 */

import { useEffect, useState } from 'react'
import { fetchHouses, updateCandy, addHouse } from './api'
import HousesTable from './components/HousesTable'
import NewAddress from './components/NewAddress'
import type { House } from './types'

function App() {
  // === STATE KEZELÉS ===
  
  /** Betöltési állapot jelzése */
  const [loading, setLoading] = useState(true)
  
  /** Hibaüzenet tárolása (ha van) */
  const [error, setError] = useState<string | null>(null)
  
  /** A házak listája */
  const [houses, setHouses] = useState<House[]>([])
  
  /** Toast értesítés szövege (null = nincs értesítés) */
  const [toast, setToast] = useState<string | null>(null)
  
  /** Sötét mód állapota - localStorage-ból töltődik be, alapértelmezett: sötét */
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  // === SEGÉDFÜGGVÉNYEK ===
  
  /**
   * Házak betöltése a szerverről
   * Kezeli a betöltési állapotot és a hibakezelést
   */
  const loadHouses = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchHouses()
      setHouses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nem sikerült betölteni a házakat')
    } finally {
      setLoading(false)
    }
  }

  // Komponens betöltésekor egyszer lefut - lekéri a házakat
  useEffect(() => {
    loadHouses()
  }, [])

  // Téma változásakor menti a localStorage-ba és beállítja a body attribútumot
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  /**
   * Téma váltás sötét és világos mód között
   */
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  /**
   * Toast értesítés megjelenítése 3 másodpercre
   * @param message - A megjelenítendő üzenet
   */
  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  /**
   * Egy ház édesség készletének frissítése
   * Optimista UI frissítés: azonnal frissíti a local state-et
   * 
   * @param houseId - A frissítendő ház azonosítója
   * @param inStock - Az új készlet állapot
   */
  const handleUpdateCandy = async (houseId: number, inStock: boolean) => {
    try {
      await updateCandy(houseId, inStock)
      // Szinkronban tartjuk a parent state-et
      setHouses(prev => prev.map(h => 
        h.id === houseId ? { ...h, candy_in_stock: inStock } : h
      ))
      showToast(`Édesség ${inStock ? 'feltöltve' : 'kiürítve'}`)
    } catch (err) {
      showToast('Édesség frissítése sikertelen')
      throw err
    }
  }

  /**
   * Új ház hozzáadása a rendszerhez
   * Sikeres hozzáadás után újratölti a teljes listát a szerverről
   * 
   * @param name - A ház neve
   * @param address - A ház címe
   * @param allergenFree - Allergén-mentes információ
   */
  const handleNewAddress = async (name: string, address: string, allergenFree: string) => {
    try {
      await addHouse(name, address, allergenFree)
      // Újratöltjük a listát, hogy az új ház megjelenjen
      await loadHouses()
      showToast('Ház sikeresen hozzáadva!')
    } catch (err) {
      showToast('Ház hozzáadása sikertelen')
      throw err
    }
  }

  /* Debug function - commented out
  const handleBulkUpdate = async (inStock: boolean) => {
    const action = inStock ? 'filled' : 'emptied'
    const actionIng = inStock ? 'Filling' : 'Emptying'
    
    showToast(`${actionIng} all candy...`)
    try {
      // Send all API requests
      await Promise.all(houses.map(h => updateCandy(h.id, inStock)))
      // Reload from server to ensure we have the correct state
      await loadHouses()
      showToast(`All candy ${action}`)
    } catch (err) {
      showToast('Bulk update failed')
      // Reload to get correct state if bulk operation failed
      await loadHouses()
    }
  }
  */

  const theme = {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    navBg: isDarkMode
      ? 'rgba(0,0,0,0.4)'
      : 'rgba(0,0,0,0.2)'
  }

  return (
    <div className="min-vh-100" style={{ background: theme.background, transition: 'background 0.3s ease' }}>
      {/* Header */}
      <nav className="navbar navbar-dark shadow-sm" style={{ background: theme.navBg, backdropFilter: 'blur(10px)' }}>
        <div className="container-fluid px-3">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-gift-fill text-warning me-2"></i>
            🎃 Halloween Candy Tracker
          </span>
          <button 
            onClick={toggleTheme}
            className="btn btn-sm btn-outline-light"
            aria-label="Toggle theme"
          >
            <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
          </button>
        </div>
      </nav>

      {/* Debug Controls - Mobile Optimized */}
      {/* <div className="bg-warning bg-opacity-10 border-bottom border-warning py-3">
        <div className="container-fluid px-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <small className="text-white fw-bold me-2 d-none d-sm-inline">Debug:</small>
            <button 
              onClick={() => handleBulkUpdate(true)} 
              className="btn btn-success btn-sm shadow-sm"
            >
              <i className="bi bi-arrow-up-circle me-1"></i>Fill All
            </button>
            <button 
              onClick={() => handleBulkUpdate(false)} 
              className="btn btn-danger btn-sm shadow-sm"
            >
              <i className="bi bi-arrow-down-circle me-1"></i>Empty All
            </button>
            <button 
              onClick={loadHouses} 
              className="btn btn-light btn-sm shadow-sm"
            >
              <i className="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
          </div>
        </div>
      </div> */}
      
      {/* Main Content */}
      <div className="container-fluid px-3 py-4">
        <NewAddress 
          onNewAddress={handleNewAddress}
          isDarkMode={isDarkMode}
        />
        
        <HousesTable 
          loading={loading} 
          error={error} 
          houses={houses} 
          onUpdateCandy={handleUpdateCandy}
          isDarkMode={isDarkMode}
        />
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div 
          role="status" 
          aria-live="polite" 
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        >
          <div className="toast show" role="alert">
            <div className="toast-body bg-dark text-white rounded shadow-lg">
              <i className="bi bi-info-circle me-2"></i>
              {toast}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
