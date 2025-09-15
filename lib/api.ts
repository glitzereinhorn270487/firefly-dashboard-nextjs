export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL!

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText} – ${text}`)
  }
  return res.json() as Promise<T>
}

export const endpoints = {
  capital: () => api<any>('/capital'),
  tradesOpen: () => api<any[]>('/trades?status=open'),
  tradesClosed: () => api<any[]>('/trades?status=closed'),
  pnlSummary: () => api<any>('/pnl/summary'),
  investmentLevel: () => api<any>('/settings/investment-level'),
  botStatus: () => api<{ status: 'running' | 'stopped' }>('/control/status'),
  botStart: () => api<{ ok: boolean }>('/control/start', { method: 'POST' }),
  botStop: () => api<{ ok: boolean }>('/control/stop', { method: 'POST' }),
}