import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import type { Property } from "@/types"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bath, Bed, Calendar, Heart, MapPin, Ruler, Share2, ArrowLeft } from "lucide-react"

interface PropertyPageProps {
  params: {
    id: string
  }
}

async function getProperty(id: string): Promise<Property | null> {
  try {
    const supabase = createServerSupabaseClient()

    // Check if the properties table exists
    const { error: checkError } = await supabase.from("properties").select("id").limit(1)

    if (checkError && checkError.message.includes("does not exist")) {
      console.log("Properties table does not exist yet. Returning null.")
      return null
    }

    const { data: property, error } = await supabase
      .from("properties")
      .select(`
        *,
        images:property_images(*)
      `)
      .eq("id", id)
      .single()

    if (error || !property) {
      console.error("Error fetching property:", error)
      return null
    }

    // Process property to include primary_image
    const primaryImage = property.images?.find((img: any) => img.is_primary)
    return {
      ...property,
      primary_image: primaryImage?.image_url || "/placeholder.svg?height=600&width=800",
    }
  } catch (error) {
    console.error("Error in getProperty:", error)
    return null
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  const {
    title,
    description,
    price,
    bedrooms,
    bathrooms,
    area,
    address,
    city,
    state,
    zip_code,
    property_type,
    listing_type,
    created_at,
    images,
    primary_image,
  } = property

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <Link href="/properties" className="flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={listing_type === "rent" ? "secondary" : "default"}>
                    {listing_type === "rent" ? "For Rent" : "For Sale"}
                  </Badge>
                  <Badge variant="outline">{property_type}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {address}, {city}
                    {state && `, ${state}`}
                    {zip_code && ` ${zip_code}`}
                  </span>
                </div>
              </div>

              {/* Main image */}
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={primary_image || "/placeholder.svg?height=600&width=800"}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
                  priority
                />
              </div>

              {/* Image gallery */}
              {images && images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((image) => (
                    <div key={image.id} className="aspect-video relative rounded-lg overflow-hidden">
                      <Image
                        src={image.image_url || "/placeholder.svg?height=150&width=200"}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 16vw"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Property details */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                {bedrooms !== null && (
                  <div className="flex flex-col items-center justify-center p-4 bg-background rounded-md">
                    <Bed className="h-6 w-6 mb-2" />
                    <span className="text-lg font-medium">{bedrooms}</span>
                    <span className="text-sm text-muted-foreground">Bedrooms</span>
                  </div>
                )}
                {bathrooms !== null && (
                  <div className="flex flex-col items-center justify-center p-4 bg-background rounded-md">
                    <Bath className="h-6 w-6 mb-2" />
                    <span className="text-lg font-medium">{bathrooms}</span>
                    <span className="text-sm text-muted-foreground">Bathrooms</span>
                  </div>
                )}
                {area !== null && (
                  <div className="flex flex-col items-center justify-center p-4 bg-background rounded-md">
                    <Ruler className="h-6 w-6 mb-2" />
                    <span className="text-lg font-medium">{area}</span>
                    <span className="text-sm text-muted-foreground">Sq Ft</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">{description}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-muted p-6 rounded-lg mb-6">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{formatPrice(price)}</span>
                  {listing_type === "rent" && <span className="text-lg">/month</span>}
                </div>

                <div className="space-y-4">
                  <Button className="w-full">Contact Agent</Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Save Property
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property ID</span>
                    <span>{params.id.slice(0, 8)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="capitalize">{property_type}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listed</span>
                    <span>{formatDate(created_at)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center text-muted-foreground mt-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Listed on {formatDate(created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
