import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Find the primary image or use the first one
  const primaryImage =
    property.images?.find((img: any) => img.is_primary) || property.images?.[0];
  const imageUrl = primaryImage?.image_url || "/placeholder.jpg";

  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 truncate">
            {property.title}
          </h3>
          <p className="text-gray-600 mb-2 truncate">
            {property.address}, {property.city}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-primary">
              ${property.price.toLocaleString()}
              {property.listing_type === "rent" && (
                <span className="text-sm">/mo</span>
              )}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{property.bedrooms} beds</span>
              <span>•</span>
              <span>{property.bathrooms} baths</span>
              <span>•</span>
              <span>{property.area} sq.ft</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
              {property.property_type}
            </span>
            <span className="inline-block bg-primary/10 rounded-full px-3 py-1 text-xs font-semibold text-primary">
              {property.listing_type === "rent" ? "For Rent" : "For Sale"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
