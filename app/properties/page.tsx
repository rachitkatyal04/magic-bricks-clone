import { createServerSupabaseClient } from "@/lib/supabase";
import type { Property } from "@/types";
import PropertyCard from "@/components/property-card";
import { SiteHeader } from "@/components/site-header";
import { Building } from "lucide-react";

interface SearchParamsType {
  location?: string;
  propertyType?: string;
  listingType?: string;
  page?: string;
}

interface PropertiesPageProps {
  searchParams: Promise<{
    location?: string;
    propertyType?: string;
    listingType?: string;
    page?: string;
  }>;
}

async function getProperties(
  searchParams: PropertiesPageProps["searchParams"]
): Promise<Property[]> {
  try {
    const supabase = createServerSupabaseClient();

    // Check if the properties table exists
    const { error: checkError } = await supabase
      .from("properties")
      .select("id")
      .limit(1);

    if (checkError && checkError.message.includes("does not exist")) {
      console.log(
        "Properties table does not exist yet. Returning empty array."
      );
      return [];
    }

    let query = supabase.from("properties").select(`
      *,
      images:property_images(*)
    `);

    // Apply filters - safely access and await searchParams
    const params = await searchParams;

    if (params?.location) {
      query = query.or(
        `city.ilike.%${params.location}%,address.ilike.%${params.location}%`
      );
    }

    if (params?.propertyType) {
      query = query.eq("property_type", params.propertyType);
    }

    if (params?.listingType) {
      query = query.eq("listing_type", params.listingType);
    }

    const { data: properties, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }

    // Process properties to include primary_image
    return properties.map((property: any) => {
      const primaryImage = property.images?.find((img: any) => img.is_primary);
      return {
        ...property,
        primary_image:
          primaryImage?.image_url ||
          (property.property_type === "apartment"
            ? `/apartment-${Math.floor(Math.random() * 2) + 1}.jpg`
            : property.property_type === "villa"
            ? `/villa-${Math.floor(Math.random() * 2) + 1}.jpg`
            : property.property_type === "studio"
            ? `/studio-${Math.floor(Math.random() * 2) + 1}.jpg`
            : "/placeholder.svg?height=300&width=400"),
      };
    });
  } catch (error) {
    console.error("Error in getProperties:", error);
    return [];
  }
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const properties = await getProperties(searchParams);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Properties</h1>

        <AppliedFilters searchParams={searchParams} />

        {/* Properties grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-60 bg-muted rounded-lg border border-dashed p-8 text-center">
              <Building className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No properties found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search filters or set up the database first.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function AppliedFilters({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const params = await searchParams;

  if (!params?.location && !params?.propertyType && !params?.listingType) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-2">Filters applied:</h2>
      <div className="flex flex-wrap gap-2">
        {params.location && (
          <div className="bg-muted px-3 py-1 rounded-full text-sm">
            Location: {params.location}
          </div>
        )}
        {params.propertyType && (
          <div className="bg-muted px-3 py-1 rounded-full text-sm">
            Type: {params.propertyType}
          </div>
        )}
        {params.listingType && (
          <div className="bg-muted px-3 py-1 rounded-full text-sm">
            {params.listingType === "rent" ? "For Rent" : "For Sale"}
          </div>
        )}
      </div>
    </div>
  );
}
