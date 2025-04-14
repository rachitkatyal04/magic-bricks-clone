import Link from "next/link"
import { PropertyForm } from "@/components/property-form"
import { ArrowLeft } from "lucide-react"

export default function NewPropertyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin" className="flex items-center text-primary mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to properties
      </Link>

      <h1 className="text-3xl font-bold mb-8">Add New Property</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <PropertyForm mode="create" />
      </div>
    </div>
  )
}
