'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Case } from '@/types/database'
import { createClientComponentClient } from '@/lib/supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'

export function ProductsTable() {
  const [products, setProducts] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('available_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setProducts(data || [])
      }
    } catch (err) {
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: Case['status']) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      archived: 'destructive',
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Загрузка кейсов...</div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-500 mb-2">Ошибка загрузки кейсов</div>
            <div className="text-sm text-muted-foreground">{error}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchProducts}
            >
              Попробовать снова
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="text-muted-foreground mb-4">Кейсы не найдены</div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Добавить кейс
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Показано {products.length} кейсов
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Добавить кейс
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Логотип компании</TableHead>
            <TableHead>Компания</TableHead>
            <TableHead>Название кейса</TableHead>
            <TableHead>Тип объекта</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Видимость</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead className="w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="relative w-12 h-12 rounded overflow-hidden">
                  <Image
                    src={product.company_logo}
                    alt={product.company_name}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.company_name}</TableCell>
              <TableCell className="font-medium">{product.case_title}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.object_type}</Badge>
              </TableCell>
              <TableCell>{getStatusBadge(product.status)}</TableCell>
              <TableCell>
                <span className={product.is_visible ? 'text-green-600' : 'text-gray-400'}>
                  {product.is_visible ? 'Виден' : 'Скрыт'}
                </span>
              </TableCell>
              <TableCell>{formatDate(product.available_at)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
