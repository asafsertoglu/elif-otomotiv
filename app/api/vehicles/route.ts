import { NextResponse } from 'next/server'
import { createVehicle, getAllVehicles, updateVehicle, deleteVehicle } from '@/lib/db'

export async function GET() {
  try {
    const vehicles = await getAllVehicles()
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Veritabanı hatası:', error)
    return NextResponse.json({ error: 'Araçlar yüklenemedi' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const id = await createVehicle(data)
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Araç ekleme hatası:', error)
    return NextResponse.json({ error: 'Araç eklenemedi' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json()
    await updateVehicle(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Araç güncelleme hatası:', error)
    return NextResponse.json({ error: 'Araç güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
    }
    await deleteVehicle(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Araç silme hatası:', error)
    return NextResponse.json({ error: 'Araç silinemedi' }, { status: 500 })
  }
}