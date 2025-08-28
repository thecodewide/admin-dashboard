import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        username: string
        role: string
        exp: number
      }

      // Проверка истечения токена
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.json(
          { error: 'Токен истек' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        user: {
          username: decoded.username,
          role: decoded.role
        }
      })

    } catch (error) {
      return NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
