import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production'

// Маршруты, которые не требуют авторизации
const publicPaths = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/me',
  '/login',
  '/' // Главная страница доступна всем
]

// Маршруты API, которые требуют авторизации для изменения данных
const protectedApiPaths = [
  '/api/products', // Только POST, PUT, DELETE операции
  '/api/upload',
  '/api/seed'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем публичные маршруты
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Проверяем авторизацию для защищенных API маршрутов
  if (protectedApiPaths.some(path => pathname.startsWith(path))) {
    // Для GET запросов разрешаем без авторизации
    if (request.method === 'GET') {
      return NextResponse.next()
    }

    // Получаем токен из cookies
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    try {
      jwt.verify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
