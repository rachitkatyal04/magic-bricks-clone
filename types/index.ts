export type Property = {
  id: string
  title: string
  description: string | null
  price: number
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  address: string
  city: string
  state: string | null
  zip_code: string | null
  property_type: string
  listing_type: string
  is_featured: boolean
  created_at: string
  updated_at: string
  images?: PropertyImage[]
  primary_image?: string
}

export type PropertyImage = {
  id: string
  property_id: string
  image_url: string
  is_primary: boolean
  created_at: string
}

export type User = {
  id: string
  email: string
  name: string | null
  role: string
  created_at: string
}

export type SavedProperty = {
  id: string
  user_id: string
  property_id: string
  created_at: string
}

export type PropertyFormData = Omit<Property, "id" | "created_at" | "updated_at" | "images" | "primary_image"> & {
  images: string[]
}
