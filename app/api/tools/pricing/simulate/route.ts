
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { sku, range } = await req.json()
  const min = Number(range?.min ?? 5), max = Number(range?.max ?? 15), step = Number(range?.step ?? 0.1)
  const grid = []
  const cost = 7.8
  for (let p = min; p <= max + 1e-9; p = Math.round((p + step)*100)/100) {
    const demand = Math.max(0, 100 - 8 * (p - cost)) // toy demand
    const revenue = p * demand
    const profit = (p - cost) * demand
    grid.push({ price: Number(p.toFixed(2)), revenue: Math.round(revenue), profit: Math.round(profit) })
  }
  const best = grid.reduce((a,b)=> b.profit > a.profit ? b : a, grid[0])
  return NextResponse.json({ grid, best })
}
