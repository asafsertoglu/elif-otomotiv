import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    // ÖNEMLİ: Bu basit bir örnek
    // Gerçek scraping için Puppeteer veya Sahibinden API gerekli
    
    // Örnek mock veri (test için)
    const mockVehicles = [
      {
        title: '2019 Volkswagen Passat 1.6 TDI Comfortline',
        price: 890000,
        year: 2019,
        km: 78000,
        fuel: 'Dizel',
        brand: 'Volkswagen',
        model: 'Passat',
        images: JSON.stringify(['https://images.unsplash.com/photo-1542362567-b07e54358753?w=800']),
        description: 'Sahibinden temiz araç',
        whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
        source: 'sahibinden',
        status: 'active',
        scrape_id: 'sahibinden_test_12345'
      }
    ]

    let addedCount = 0
    let updatedCount = 0

    for (const vehicle of mockVehicles) {
      // Bu scrape_id'ye sahip araç var mı kontrol et
      const [existing] = await pool.query(
        'SELECT id FROM vehicles WHERE scrape_id = ?',
        [vehicle.scrape_id]
      )

      if ((existing as any[]).length === 0) {
        // Yoksa ekle
        await pool.query(
          `INSERT INTO vehicles (title, price, year, km, fuel, brand, model, images, whatsapp, source, status, scrape_id, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            vehicle.title,
            vehicle.price,
            vehicle.year,
            vehicle.km,
            vehicle.fuel,
            vehicle.brand,
            vehicle.model,
            vehicle.images,
            vehicle.whatsapp,
            vehicle.source,
            vehicle.status,
            vehicle.scrape_id,
            vehicle.description
          ]
        )
        addedCount++
      } else {
        // Varsa güncelle (fiyat değişmiş olabilir)
        await pool.query(
          'UPDATE vehicles SET price = ?, km = ? WHERE scrape_id = ?',
          [vehicle.price, vehicle.km, vehicle.scrape_id]
        )
        updatedCount++
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `${addedCount} araç eklendi, ${updatedCount} araç güncellendi`,
      added: addedCount,
      updated: updatedCount
    })
  } catch (error) {
    console.error('Scraping hatası:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Bir hata oluştu' 
    }, { status: 500 })
  }
}