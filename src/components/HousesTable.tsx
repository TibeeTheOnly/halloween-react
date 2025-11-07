import { useState, useEffect } from 'react'
import type { House } from '../types'

interface Props {
  loading: boolean
  error: string | null
  houses: House[]
  onUpdateCandy: (id: number, inStock: boolean) => Promise<void>
  isDarkMode: boolean
}

export default function HousesTable({ loading, error, houses, onUpdateCandy, isDarkMode }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [localHouses, setLocalHouses] = useState<House[]>(houses)

  useEffect(() => {
    setLocalHouses(houses)
  }, [houses])
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-white mt-3">Loading houses...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="alert alert-danger shadow-sm" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        <strong>Error:</strong> {error}
      </div>
    )
  }
  
  if (localHouses.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-inbox text-white" style={{ fontSize: '3rem' }}></i>
        <p className="text-white mt-3">No houses found</p>
      </div>
    )
  }

  const handleAction = async (id: number, inStock: boolean) => {
    if (loadingId !== null) return
    setLoadingId(id)

    // Optimistic update
    setLocalHouses(prev => prev.map(h => 
      h.id === id ? { ...h, candy_in_stock: inStock } : h
    ))

    try {
      await onUpdateCandy(id, inStock)
    } catch (err) {
      console.error(err)
      // Revert on failure
      setLocalHouses(houses)
    } finally {
      setLoadingId(null)
    }
  }

  const totalHouses = localHouses.length
  const housesWithCandy = localHouses.filter(h => h.candy_in_stock).length
  const housesEmpty = totalHouses - housesWithCandy
  const percentageWithCandy = totalHouses > 0 ? Math.round((housesWithCandy / totalHouses) * 100) : 0

  const summaryCardBg = isDarkMode ? 'rgba(40, 40, 60, 0.95)' : 'rgba(255,255,255,0.95)'
  const summaryTextClass = isDarkMode ? 'text-light' : 'text-primary'
  const summaryMutedClass = isDarkMode ? 'text-white-50' : 'text-muted'

  return (
    <div>
      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm" style={{ background: summaryCardBg, transition: 'background 0.3s ease' }}>
            <div className="card-body text-center py-3">
              <div className={`display-6 fw-bold ${summaryTextClass} mb-1`}>{totalHouses}</div>
              <div className={`small ${summaryMutedClass}`}>
                <i className="bi bi-house-door me-1"></i>Total Houses
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm" style={{ background: summaryCardBg, transition: 'background 0.3s ease' }}>
            <div className="card-body text-center py-3">
              <div className="display-6 fw-bold text-success mb-1">{housesWithCandy}</div>
              <div className={`small ${summaryMutedClass}`}>
                <i className="bi bi-check-circle me-1"></i>Has Candy
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm" style={{ background: summaryCardBg, transition: 'background 0.3s ease' }}>
            <div className="card-body text-center py-3">
              <div className="display-6 fw-bold text-danger mb-1">{housesEmpty}</div>
              <div className={`small ${summaryMutedClass}`}>
                <i className="bi bi-x-circle me-1"></i>Empty
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm" style={{ background: summaryCardBg, transition: 'background 0.3s ease' }}>
            <div className="card-body text-center py-3">
              <div className="display-6 fw-bold text-info mb-1">{percentageWithCandy}%</div>
              <div className={`small ${summaryMutedClass}`}>
                <i className="bi bi-pie-chart me-1"></i>Stocked
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <h2 className="text-white fw-bold mb-1">
          <i className="bi bi-house-heart-fill me-2 text-warning"></i>
          All Houses
        </h2>
        <p className="text-white-50 small mb-0">
          <i className="bi bi-phone me-1"></i>
          Swipe to see more • Tap to update
        </p>
      </div>

      <div className="row g-3">
        {localHouses.map((h) => {
          const isLoading = loadingId === h.id
          const hasCandy = h.candy_in_stock
          
          const cardBg = isDarkMode
            ? (hasCandy 
                ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'  // Dark blue for candy in dark mode
                : 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)') // Dark red for empty in dark mode
            : (hasCandy 
                ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'  // Light blue for candy in light mode
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)') // Light pink for empty in light mode
          
          return (
            <div key={h.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className={`card h-100 shadow-sm border-0 ${isLoading ? 'opacity-75' : ''}`}
                   style={{ 
                     transition: 'all 0.3s ease',
                     background: cardBg
                   }}>
                <div className="card-body d-flex flex-column">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title text-white fw-bold mb-0 flex-grow-1">
                      {h.name}
                    </h5>
                    <span className={`badge ${hasCandy ? 'bg-success' : 'bg-secondary'} shadow-sm`}>
                      {hasCandy ? (
                        <><i className="bi bi-check-circle-fill me-1"></i>Has Candy</>
                      ) : (
                        <><i className="bi bi-x-circle-fill me-1"></i>Empty</>
                      )}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-grow-1 mb-3">
                    <div className="d-flex align-items-center text-white mb-2 small">
                      <i className="bi bi-geo-alt-fill me-2 text-warning"></i>
                      <span className="text-truncate">{h.address}</span>
                    </div>
                    <div className="d-flex align-items-center text-white mb-2 small">
                      <i className="bi bi-hash me-2 text-warning"></i>
                      <span>ID: {h.id}</span>
                    </div>
                    {h.allergen_free && (
                      <div className="d-flex align-items-center text-white small">
                        <i className="bi bi-shield-fill-check me-2 text-success"></i>
                        <span>{h.allergen_free}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    disabled={isLoading}
                    onClick={() => handleAction(h.id, !hasCandy)}
                    className={`btn w-100 shadow-sm ${hasCandy ? 'btn-danger' : 'btn-success'}`}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : hasCandy ? (
                      <>
                        <i className="bi bi-dash-circle me-2"></i>
                        Empty Candy
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Fill Candy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
