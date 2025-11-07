/**
 * API Modul
 * 
 * Ez a modul kezeli a backend API-val való kommunikációt.
 * Tartalmazza a házak lekérdezését, frissítését és új házak hozzáadását.
 */

// API alap URL - környezeti változóból töltődik be
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Általános JSON fetch segédfüggvény timeout kezeléssel
 * 
 * @param url - A lekérdezendő URL cím
 * @param timeout - Időtúllépés milliszekundumban (alapértelmezett: 8000ms)
 * @returns Promise a JSON válasszal
 * @throws Error ha a kérés sikertelen vagy időtúllépés történik
 */
async function fetchJson<T>(url: string, timeout = 8000): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) {
      throw new Error(`Kérés sikertelen: ${res.status} ${res.statusText}`)
    }
    return await res.json()
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('Időtúllépés a kérés során')
    throw err
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Lekérdezi az összes házat a szerverről
 * 
 * @returns Promise tömbbel, amely tartalmazza az összes házat
 * @throws Error ha a lekérdezés sikertelen
 */
export async function fetchHouses(): Promise<any[]> {
  return fetchJson(API_BASE_URL)
}

/**
 * Frissíti egy ház édesség készlet állapotát
 * 
 * @param houseId - A frissítendő ház egyedi azonosítója
 * @param inStock - Az új készlet állapot (igaz = van édesség, hamis = nincs)
 * @throws Error ha a frissítés sikertelen
 */
export async function updateCandy(houseId: number, inStock: boolean): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/${houseId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candy_in_stock: inStock }),
  })
  
  if (!res.ok) {
    throw new Error(`Frissítés sikertelen: ${res.status} ${res.statusText}`)
  }
}

/**
 * Új ház hozzáadása a rendszerhez
 * 
 * Az új háznak alapértelmezetten lesz édesség készlete (candy_in_stock: true)
 * 
 * @param name - A ház/család neve
 * @param address - A ház címe
 * @param allergenFree - Allergén-mentes információ
 * @throws Error ha a hozzáadás sikertelen
 */
export async function addHouse(name: string, address: string, allergenFree: string): Promise<void> {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      address,
      candy_in_stock: true, // Alapértelmezett: van édesség
      allergen_free: allergenFree
    }),
  })
  
  if (!res.ok) {
    throw new Error(`Ház hozzáadása sikertelen: ${res.status} ${res.statusText}`)
  }
}
