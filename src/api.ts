const cache = new Map<string, any>();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchJson<T = any>(url: string, timeout = 8000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchHouses(): Promise<any[]> {
  return fetchJson(API_BASE_URL);
}

export async function updateCandy(houseId: number, inStock: boolean): Promise<void> {
  await fetch(`${API_BASE_URL}/${houseId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candy_in_stock: inStock }),
  });
}

export function clearCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}
