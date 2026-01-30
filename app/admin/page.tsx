'use client'

import { useState, useEffect } from 'react'
import type { Vehicle } from '@/lib/db'
import { Plus, Edit, Trash2, Save, X, Home } from 'lucide-react'

export default function AdminPanel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    year: '',
    km: '',
    fuel: 'Benzin',
    brand: '',
    model: '',
    images: '',
    description: '',
    whatsapp: ''
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

  async function fetchVehicles() {
    const res = await fetch('/api/vehicles')
    const data = await res.json()
    setVehicles(data.filter((v: Vehicle) => v.source === 'manuel'))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const vehicleData = {
      title: formData.title,
      price: Number(formData.price),
      year: Number(formData.year),
      km: Number(formData.km),
      fuel: formData.fuel,
      brand: formData.brand,
      model: formData.model,
      images: formData.images.split(',').map(url => url.trim()).filter(Boolean),
      description: formData.description,
      whatsapp: formData.whatsapp,
      source: 'manuel' as const,
      status: 'active' as const
    }

    if (editingId) {
      await fetch('/api/vehicles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...vehicleData })
      })
      alert('Araç güncellendi!')
    } else {
      await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      })
      alert('Araç eklendi!')
    }

    resetForm()
    fetchVehicles()
  }

  async function handleDelete(id: number) {
    if (confirm('Bu aracı silmek istediğinize emin misiniz?')) {
      await fetch(`/api/vehicles?id=${id}`, { method: 'DELETE' })
      fetchVehicles()
    }
  }

  async function toggleSold(vehicle: Vehicle) {
    const newStatus = vehicle.status === 'active' ? 'sold' : 'active'
    await fetch('/api/vehicles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vehicle.id, status: newStatus })
    })
    fetchVehicles()
  }

  function editVehicle(vehicle: Vehicle) {
    setEditingId(vehicle.id)
    setFormData({
      title: vehicle.title,
      price: vehicle.price.toString(),
      year: vehicle.year.toString(),
      km: vehicle.km.toString(),
      fuel: vehicle.fuel,
      brand: vehicle.brand,
      model: vehicle.model,
      images: vehicle.images.join(', '),
      description: vehicle.description || '',
      whatsapp: vehicle.whatsapp
    })
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: '',
      price: '',
      year: '',
      km: '',
      fuel: 'Benzin',
      brand: '',
      model: '',
      images: '',
      description: '',
      whatsapp: ''
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Yönetim <span className="text-amber-500">Paneli</span>
          </h1>
          <div className="flex gap-3">
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              <Home className="w-4 h-4" />
              Ana Sayfa
            </a>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Yeni İlan Ekle
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-amber-500/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? 'İlan Düzenle' : 'Yeni İlan Ekle'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Başlık (örn: 2020 BMW 3.20i)"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />

              <input
                required
                type="text"
                placeholder="Marka (örn: BMW)"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />

              <input
                required
                type="text"
                placeholder="Model (örn: 3.20i)"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
              />

              <input
                required
                type="number"
                placeholder="Fiyat (₺)"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />

              <input
                required
                type="number"
                placeholder="Yıl"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
              />

              <input
                required
                type="number"
                placeholder="KM"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                value={formData.km}
                onChange={(e) => setFormData({...formData, km: e.target.value})}
              />

              <select
                className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                value={formData.fuel}
                onChange={(e) => setFormData({...formData, fuel: e.target.value})}
              >
                <option>Benzin</option>
                <option>Dizel</option>
                <option>LPG Benzin</option>
                <option>Hybrid</option>
                <option>Elektrik</option>
              </select>

              <input
                type="text"
                placeholder="WhatsApp (5XXXXXXXXX)"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              />

              <input
                type="text"
                placeholder="Fotoğraf URL'leri (virgülle ayır)"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none md:col-span-2"
                value={formData.images}
                onChange={(e) => setFormData({...formData, images: e.target.value})}
              />

              <textarea
                placeholder="Açıklama (opsiyonel)"
                rows={3}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none md:col-span-2"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />

              <button
                type="submit"
                className="md:col-span-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Güncelle' : 'Kaydet'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            Manuel İlanlar ({vehicles.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead className="text-amber-500 border-b border-gray-700">
                <tr>
                  <th className="pb-3 px-2">Başlık</th>
                  <th className="pb-3 px-2">Fiyat</th>
                  <th className="pb-3 px-2">Yıl</th>
                  <th className="pb-3 px-2">Durum</th>
                  <th className="pb-3 px-2">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="py-3 px-2">{vehicle.title}</td>
                    <td className="py-3 px-2">{vehicle.price.toLocaleString('tr-TR')} ₺</td>
                    <td className="py-3 px-2">{vehicle.year}</td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => toggleSold(vehicle)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          vehicle.status === 'active' 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-red-600/20 text-red-400'
                        }`}
                      >
                        {vehicle.status === 'active' ? 'Aktif' : 'Satıldı'}
                      </button>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editVehicle(vehicle)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {vehicles.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                Henüz manuel ilan eklenmemiş
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
