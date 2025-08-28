'use client'

import { useState, useEffect } from 'react'
import { CasesTable } from '@/components/dashboard/cases-table'
import { UserMenu } from '@/components/auth/user-menu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface User {
  username: string
  role: string
}

interface CaseStats {
  total: number
  active: number
  completed: number
  visible: number
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<CaseStats>({ total: 0, active: 0, completed: 0, visible: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    loadStats()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        const cases = data.data || []

        const stats = {
          total: cases.length,
          active: cases.filter((c: any) => c.status === 'active').length,
          completed: cases.filter((c: any) => c.status === 'archived').length,
          visible: cases.filter((c: any) => c.is_visible).length
        }
        setStats(stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Панель управления кейсами</h1>
          <p className="text-muted-foreground">
            {user
              ? "Управляйте кейсами строительных проектов и отслеживайте портфолио."
              : "Просматривайте кейсы строительных проектов."
            }
          </p>
        </div>
        <UserMenu />
      </div>

      {user && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего кейсов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.total}</div>
              <p className="text-xs text-muted-foreground">
                +0 за последний месяц
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активные кейсы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.active}</div>
              <p className="text-xs text-muted-foreground">
                +0 за последний месяц
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Завершенные проекты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                +0% уровень завершения
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Видимые кейсы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.visible}</div>
              <p className="text-xs text-muted-foreground">
                Отображаются сейчас
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Кейсы строительства</CardTitle>
          <CardDescription>
            {user
              ? "Управляйте строительными проектами и кейс-стади."
              : "Просматривайте строительные проекты и кейс-стади."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CasesTable />
        </CardContent>
      </Card>
    </div>
  )
}
