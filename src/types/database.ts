export type CaseStatus = 'active' | 'inactive' | 'archived'

export interface Case {
  id: number
  case_name: string
  company_name: string
  company_logo: string
  case_title: string
  description: string
  status: CaseStatus
  is_visible: boolean
  address: string
  object_type: string
  images: string[]
  available_at: string
  created_at?: string
  updated_at?: string
}

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: Case
        Insert: Omit<Case, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Case, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Enums: {
      status: CaseStatus
    }
  }
}
