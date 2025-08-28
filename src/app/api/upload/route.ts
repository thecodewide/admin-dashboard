import { createAdminClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called')

    const formData = await request.formData()
    const file = formData.get('file') as File

    console.log('File received:', file?.name, file?.size, file?.type)

    if (!file) {
      console.log('No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type)
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Check file size (max 2MB for better compatibility)
    if (file.size > 2 * 1024 * 1024) {
      console.log('File too large:', file.size)
      return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 })
    }

    const supabase = createAdminClient()
    console.log('Supabase client created')

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `cases/${fileName}`

    console.log('Generated file path:', filePath)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('File converted to buffer, size:', buffer.length)

    // Upload file to Supabase Storage
    console.log('Starting upload to Supabase Storage...')
    const { data, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    console.log('Upload result:', { data, error: uploadError })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: `Failed to upload file: ${uploadError.message}` }, { status: 500 })
    }

    // Get public URL
    console.log('Getting public URL...')
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    console.log('Public URL generated:', publicUrl)

    return NextResponse.json({
      url: publicUrl,
      path: filePath,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Unexpected error in upload API:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
