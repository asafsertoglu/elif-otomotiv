import mysql from 'mysql2/promise'

// MySQL bağlantı havuzu
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
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
  const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC')
  return parseVehicles(rows as any[])
}

// Aktif araçları getir
export async function getActiveVehicles(): Promise<Vehicle[]> {
  const [rows] = await pool.query(
    'SELECT * FROM vehicles WHERE status = ? ORDER BY created_at DESC',
    ['active']
  )
  return parseVehicles(rows as any[])
}

// Tek araç getir
export async function getVehicleById(id: number): Promise<Vehicle | null> {
  const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id])
  const vehicles = parseVehicles(rows as any[])
  return vehicles[0] || null
}

// Araç ekle
export async function createVehicle(data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const [result] = await pool.query(
    `INSERT INTO vehicles (title, price, year, km, fuel, brand, model, images, whatsapp, source, status, scrape_id, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
  return (result as any).insertId
}

// Araç güncelle
export async function updateVehicle(id: number, data: Partial<Vehicle>): Promise<boolean> {
  const fields: string[] = []
  const values: any[] = []

  Object.keys(data).forEach((key) => {
    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
      fields.push(`${key} = ?`)
      if (key === 'images' && Array.isArray(data[key as keyof Vehicle])) {
        values.push(JSON.stringify(data[key as keyof Vehicle]))
      } else {
        values.push(data[key as keyof Vehicle])
      }
    }
  })

  if (fields.length === 0) return false

  values.push(id)
  await pool.query(
    `UPDATE vehicles SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
  return true
}

// Araç sil
export async function deleteVehicle(id: number): Promise<boolean> {
  const [result] = await pool.query('DELETE FROM vehicles WHERE id = ?', [id])
  return (result as any).affectedRows > 0
}

// JSON parse yardımcı fonksiyonu
function parseVehicles(rows: any[]): Vehicle[] {
  return rows.map(row => ({
    ...row,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images
  }))
}