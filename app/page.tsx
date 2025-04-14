import Link from "next/link"
import { getProperties } from "@/lib/properties"
import { SiteHeader } from "@/components/site-header"
import PropertyCard from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Search, MapPin, User, Database } from "lucide-react"

export default async function Home() {
  // Fetch properties, but handle the case when tables don't exist
  const properties = await getProperties()

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Property</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the perfect home with our extensive collection of properties for sale and rent.
          </p>

          <div className="bg-white p-4 rounded-lg shadow-md max-w-3xl mx-auto flex items-center">
            <div className="flex-1 flex items-center border-r pr-4">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <input type="text" placeholder="Enter location" className="w-full focus:outline-none" />
            </div>
            <div className="px-4">
              <select className="focus:outline-none">
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <Link href="/properties">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed p-8">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Database Setup Required</h3>
            <p className="text-gray-500 mb-6">No properties found. You need to set up the database first.</p>
            <div className="flex justify-center">
              <Link href="/setup">
                <Button>
                  <Database className="h-4 w-4 mr-2" />
                  Set Up Database
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best property dealing experience with our expert services and extensive property listings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Range of Properties</h3>
              <p className="text-gray-600">
                Explore our extensive collection of properties to find your perfect match.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-600">
                Our experienced agents provide expert advice throughout your property journey.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
              <p className="text-gray-600">Find properties in the most sought-after locations for the best value.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
