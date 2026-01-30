import { getActiveVehicles } from '@/lib/db'
import VehicleList from '@/components/VehicleList'
import { Car } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const vehicles = await getActiveVehicles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <header className="bg-black/40 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-10 h-10 text-amber-500" />
              <h1 className="text-3xl font-bold text-white">
                Elif <span className="text-amber-500">Otomotiv</span>
              </h1>
            </div>
            <a 
              href="/admin" 
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
            >
              Yönetim Paneli
            </a>
          </div>
        </div>
      </header>

      <VehicleList initialVehicles={vehicles} />
    </div>
  )
}
