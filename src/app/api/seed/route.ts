import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Clear existing data
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0)

    if (deleteError) {
      console.error('Error deleting existing data:', deleteError)
    }

    // Insert sample data
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
          name: 'Wireless Headphones',
          status: 'active',
          price: 199.99,
          stock: 50,
          available_at: '2024-01-15T10:00:00Z'
        },
        {
          image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
          name: 'Smart Watch',
          status: 'active',
          price: 299.99,
          stock: 30,
          available_at: '2024-01-16T11:00:00Z'
        },
        {
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
          name: 'Running Shoes',
          status: 'active',
          price: 129.99,
          stock: 75,
          available_at: '2024-01-17T12:00:00Z'
        },
        {
          image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop',
          name: 'Laptop Stand',
          status: 'active',
          price: 49.99,
          stock: 100,
          available_at: '2024-01-18T13:00:00Z'
        }
      ])
      .select()

    if (error) {
      console.error('Error seeding data:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      data: data
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
