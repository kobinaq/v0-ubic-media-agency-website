import { Pool } from "@neondatabase/serverless"

let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  const pool = getPool()
  return pool.query(text, params)
}
