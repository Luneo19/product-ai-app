export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          prompt: string
          description: string
          image_url: string
          user_id: string
          slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          prompt: string
          description: string
          image_url: string
          user_id: string
          slug: string
        }
        Update: {
          id?: string
          created_at?: string
          prompt?: string
          description?: string
          image_url?: string
          user_id?: string
          slug?: string
        }
      }
    }
  }
}
