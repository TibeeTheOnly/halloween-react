import { useState } from 'react'

interface Props {
  onNewAddress: (name: string, address: string, allergenFree: string) => Promise<void>
  isDarkMode: boolean
}

export default function NewAddress({ onNewAddress, isDarkMode }: Props) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [allergenFree, setAllergenFree] = useState('Nincs')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allergenOptions = ['Nincs', 'Gluténmentes', 'Diómentes', 'Tejmentes', 'Vegán']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !address.trim()) {
      alert('Kérlek töltsd ki a nevet és a címet')
      return
    }

    setIsSubmitting(true)
    try {
      await onNewAddress(name, address, allergenFree)
      // Reset form on success
      setName('')
      setAddress('')
      setAllergenFree('None')
    } catch (err) {
      console.error('Failed to add address:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const cardBg = isDarkMode ? 'rgba(40, 40, 60, 0.95)' : 'rgba(255,255,255,0.95)'
  const textClass = isDarkMode ? 'text-light' : 'text-dark'
  const inputClass = isDarkMode ? 'bg-dark text-light border-secondary' : ''

  return (
    <div className="card border-0 shadow-sm mb-4" style={{ background: cardBg, transition: 'background 0.3s ease' }}>
      <div className="card-body">
        <h5 className={`card-title fw-bold mb-3 ${textClass}`}>
          <i className="bi bi-plus-circle me-2 text-success"></i>
          Új ház hozzáadása
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="houseName" className={`form-label small ${textClass}`}>
                <i className="bi bi-house me-1"></i>Ház neve
              </label>
              <input
                type="text"
                id="houseName"
                className={`form-control ${inputClass}`}
                placeholder="pl.: Kovács család"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="houseAddress" className={`form-label small ${textClass}`}>
                <i className="bi bi-geo-alt me-1"></i>Cím
              </label>
              <input
                type="text"
                id="houseAddress"
                className={`form-control ${inputClass}`}
                placeholder="pl.: Fő utca 123"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="allergenFree" className={`form-label small ${textClass}`}>
                <i className="bi bi-shield-check me-1"></i>Allergén-mentes
              </label>
              <select
                id="allergenFree"
                className={`form-select ${inputClass}`}
                value={allergenFree}
                onChange={(e) => setAllergenFree(e.target.value)}
                disabled={isSubmitting}
              >
                {allergenOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-plus-lg"></i>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
