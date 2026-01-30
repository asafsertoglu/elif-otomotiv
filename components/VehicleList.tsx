'use client'

import { useState, useEffect } from 'react'
import type { Vehicle } from '@/lib/db'
import { Car, Phone, Calendar, Gauge, Fuel, Filter } from 'lucide-react'
import Image from 'next/image'

export default function VehicleList({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [vehicles] = useState<Vehicle[]>(initialVehicles)
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(initialVehicles)
  const [filters, setFilters] = useState({
    brand: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
  })

  useEffect(() => {
    applyFilters()
  }, [filters])

  function applyFilters() {
    let filtered = [...vehicles]

    if (filters.brand) {
      filtered = filtered.filter(v => 
        v.brand.toLowerCase().includes(filters.brand.toLowerCase()) ||
        v.title.toLowerCase().includes(filters.brand.toLowerCase())
      )
    }

    if (filters.priceMin) {
      filtered = filtered.filter(v => v.price >= Number(filters.priceMin))
    }

    if (filters.priceMax) {
      filtered = filtered.filter(v => v.price <= Number(filters.priceMax))
    }

    if (filters.yearMin) {
      filtered = filtered.filter(v => v.year >= Number(filters.yearMin))
    }

    setFilteredVehicles(filtered)
  }

  const whatsappMessage = (vehicle: Vehicle) => {
    const message = `Merhaba, ${vehicle.title} hakkında bilgi almak istiyorum.`
    return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-semibold text-white">Filtreler</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Marka veya model ara..."
            className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
            value={filters.brand}
            onChange={(e) => setFilters({...filters, brand: e.target.value})}
          />
          
          <input
            type="number"
            placeholder="Min fiyat"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
            value={filters.priceMin}
            onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
          />
          
          <input
            type="number"
            placeholder="Max fiyat"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-amber-500"
            value={filters.priceMax}
            onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
          />
          
          <input
            type="number"
            placeholder="Min yıl"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-amber-500"
            value={filters.yearMin}
            onChange={(e) => setFilters({...filters, yearMin: e.target.value})}
          />
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Toplam {filteredVehicles.length} araç bulundu
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div 
            key={vehicle.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all"
          >
            <div className="relative h-56 bg-gray-900">
              {vehicle.images && vehicle.images.length > 0 ? (
                <Image
                  src={vehicle.images[0]}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Car className="w-20 h-20 text-gray-700" />
                </div>
              )}
              
              {vehicle.status === 'sold' && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-red-500 text-3xl font-bold transform -rotate-12">SATILDI</span>
                </div>
              )}

              <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-amber-400">
                {vehicle.source === 'sahibinden' ? 'Otomatik' : 'Manuel'}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{vehicle.title}</h3>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-amber-500">
                  {vehicle.price.toLocaleString('tr-TR')} ₺
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{vehicle.year}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Gauge className="w-4 h-4" />
                  <span>{vehicle.km.toLocaleString('tr-TR')} km</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Fuel className="w-4 h-4" />
                  <span>{vehicle.fuel}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Car className="w-4 h-4" />
                  <span>{vehicle.brand}</span>
                </div>
              </div>

              {vehicle.status === 'active' && (
                <a
                  href={whatsappMessage(vehicle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp ile Bilgi Al
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-20">
          <Car className="w-20 h-20 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">Araç bulunamadı</p>
        </div>
      )}
    </div>
  )
}
