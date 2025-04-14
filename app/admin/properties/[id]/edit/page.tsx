import { notFound } from "next/navigation"
import Link from "next/link"
import { getPropertyById } from "@/lib/properties"
import { PropertyForm } from "@/components/property-form"
import { ArrowLeft } from "lucide-react"

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  try {
    const property = await getPropertyById(params.id)

    if (!property) {
      return notFound()
    }

    // Remove images from property for the form
    const { images, ...propertyWithoutImages } = property

    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/admin" className="flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to properties
        </Link>

        <h1 className="text-3xl font-bold mb-8">Edit Property</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <PropertyForm property={propertyWithoutImages} mode="edit" />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in EditPropertyPage:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Property</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>There was an error loading this property. Please try again later.</p>
        </div>
      </div>
    )
  }
}
