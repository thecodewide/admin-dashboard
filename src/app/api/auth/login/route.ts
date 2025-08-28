import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

// Простые credentials (в продакшене использовать переменные окружения)
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'AdminSecurePass2024!@#'
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Проверка credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      )
    }

    // Создание JWT токена
    const token = jwt.sign(
      {
        username: ADMIN_USERNAME,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 часа
      },
      JWT_SECRET
    )

    // Создание cookie с токеном
    const cookie = serialize('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 часа
      path: '/'
    })

    const response = NextResponse.json({
      success: true,
      message: 'Успешный вход в систему',
      user: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    })

    response.headers.set('Set-Cookie', cookie)

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
