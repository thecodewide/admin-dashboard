import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  try {
    // Создание cookie для удаления токена
    const cookie = serialize('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Удаление cookie
      path: '/'
    })

    const response = NextResponse.json({
      success: true,
      message: 'Успешный выход из системы'
    })

    response.headers.set('Set-Cookie', cookie)

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
