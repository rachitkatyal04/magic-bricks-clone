import Link from "next/link"
import { getProperties } from "@/lib/properties"
import { Button } from "@/components/ui/button"
import { AdminPropertyList } from "@/components/admin-property-list"

export default async function AdminPage() {
  try {
    const properties = await getProperties()

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Property Management</h1>
          <Link href="/admin/properties/new">
            <Button>Add New Property</Button>
          </Link>
        </div>

        <AdminPropertyList properties={properties} />
      </div>
    )
  } catch (error) {
    console.error("Error in AdminPage:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Property Management</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>There was an error loading properties. Please try again later.</p>
        </div>
      </div>
    )
  }
}
