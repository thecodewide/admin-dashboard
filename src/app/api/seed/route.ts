import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Clear existing data
    const { error: deleteError } = await supabase
      .from('cases')
      .delete()
      .neq('id', 0)

    if (deleteError) {
      console.error('Error deleting existing data:', deleteError)
    }

    // Insert sample data
    const { data, error } = await supabase
      .from('cases')
      .insert([
        {
          case_name: 'Elite Apartments',
          company_name: 'Elite Construction',
          company_logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
          case_title: 'Luxury Apartment Complex',
          description: 'Modern luxury apartment complex featuring state-of-the-art amenities, sustainable design, and premium finishes.',
          status: 'active',
          is_visible: true,
          address: '123 Luxury Ave, Downtown City',
          object_type: 'Apartments',
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
          ],
          available_at: '2024-01-15T10:00:00Z'
        },
        {
          case_name: 'Modern Office Tower',
          company_name: 'Urban Development Corp',
          company_logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop',
          case_title: 'Skyline Business Center',
          description: 'Contemporary office tower with innovative workspace design, advanced building systems, and LEED certification.',
          status: 'active',
          is_visible: true,
          address: '456 Business Blvd, Financial District',
          object_type: 'Office Building',
          images: [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop'
          ],
          available_at: '2024-01-16T11:00:00Z'
        },
        {
          case_name: 'Eco Resort',
          company_name: 'Green Builders',
          company_logo: 'https://images.unsplash.com/photo-1444927714506-8492d94d9dbc?w=200&h=200&fit=crop',
          case_title: 'Sustainable Resort Complex',
          description: 'Eco-friendly resort development combining luxury hospitality with environmental responsibility.',
          status: 'active',
          is_visible: true,
          address: '789 Paradise Road, Coastal Area',
          object_type: 'Resort',
          images: [
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
          ],
          available_at: '2024-01-17T12:00:00Z'
        },
        {
          case_name: 'Urban Mixed-Use',
          company_name: 'Metro Properties',
          company_logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop',
          case_title: 'City Center Development',
          description: 'Mixed-use development combining residential, retail, and office spaces in the heart of the city.',
          status: 'active',
          is_visible: true,
          address: '321 Main Street, City Center',
          object_type: 'Mixed-Use',
          images: [
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop'
          ],
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
