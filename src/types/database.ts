export type ProductStatus = 'active' | 'inactive' | 'archived'

export interface Product {
  id: number
  image_url: string
  name: string
  status: ProductStatus
  price: number
  stock: number
  available_at: string
  created_at?: string
  updated_at?: string
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Enums: {
      status: ProductStatus
    }
  }
}
