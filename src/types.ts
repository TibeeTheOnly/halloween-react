/**
 * Ház típusdefiníció
 * 
 * Reprezentálja egy házat a Halloween édesség nyilvántartó alkalmazásban.
 * Minden ház tartalmazza a nevét, címét, az édesség készlet állapotát,
 * valamint az allergén-mentes információkat.
 */
export type House = {
  /** Egyedi azonosító szám */
  id: number
  
  /** A ház/család neve (pl. "Kovács család") */
  name: string
  
  /** A ház pontos címe (pl. "Fő utca 123") */
  address: string
  
  /** Van-e még édesség készleten (igaz/hamis) */
  candy_in_stock: boolean
  
  /** Allergén-mentes információ (pl. "Gluténmentes", "Diómentes", stb.) */
  allergen_free: string
}
