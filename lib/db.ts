import { Pool } from 'pg'

// PostgreSQL bağlantı havuzu
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export default pool

// Tip tanımları
export type Vehicle = {
  id: number
  created_at: string
  updated_at: string
  title: string
  price: number
  year: number
  km: number
  fuel: string
  brand: string
  model: string
  images: string[]
  whatsapp: string
  source: 'sahibinden' | 'manuel'
  status: 'active' | 'sold'
  scrape_id?: string
  description?: string
}

// Tüm araçları getir
export async function getAllVehicles(): Promise<Vehicle[]> {
  const result = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC')
  return parseVehicles(result.rows)
}

// Aktif araçları getir
export async function getActiveVehicles(): Promise<Vehicle[]> {
  const result = await pool.query(
    'SELECT * FROM vehicles WHERE status = $1 ORDER BY created_at DESC',
    ['active']
  )
  return parseVehicles(result.rows)
}

// Tek araç getir
export async function getVehicleById(id: number): Promise<Vehicle | null> {
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id])
  const vehicles = parseVehicles(result.rows)
  return vehicles[0] || null
}

// Araç ekle
export async function createVehicle(data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const result = await pool.query(
    `INSERT INTO vehicles (title, price, year, km, fuel, brand, model, images, whatsapp, source, status, scrape_id, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING id`,
    [
      data.title,
      data.price,
      data.year,
      data.km,
      data.fuel,
      data.brand,
      data.model,
      JSON.stringify(data.images),
      data.whatsapp,
      data.source,
      data.status,
      data.scrape_id || null,
      data.description || null
    ]
  )
  return result.rows[0].id
}

// Araç güncelle
export async function updateVehicle(id: number, data: Partial<Vehicle>): Promise<boolean> {
  const fields: string[] = []
  const values: any[] = []
  let paramCount = 1

  Object.keys(data).forEach((key) => {
    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
      fields.push(`${key} = $${paramCount}`)
      if (key === 'images' && Array.isArray(data[key as keyof Vehicle])) {
        values.push(JSON.stringify(data[key as keyof Vehicle]))
      } else {
        values.push(data[key as keyof Vehicle])
      }
      paramCount++
    }
  })

  if (fields.length === 0) return false

  values.push(id)
  await pool.query(
    `UPDATE vehicles SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount}`,
    values
  )
  return true
}

// Araç sil
export async function deleteVehicle(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM vehicles WHERE id = $1', [id])
  return result.rowCount !== null && result.rowCount > 0
}

// JSON parse yardımcı fonksiyonu
function parseVehicles(rows: any[]): Vehicle[] {
  return rows.map(row => ({
    ...row,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images
  }))
}