import { createServerSupabaseClient } from "./supabase";
import type { Property, PropertyImage } from "@/types";

export async function getProperties(): Promise<Property[]> {
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

    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        images:property_images(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((property: any) => ({
      ...property,
      images: property.images || [],
      primary_image:
        property.images?.find((img: any) => img.is_primary)?.image_url ||
        (property.property_type === "apartment"
          ? `/apartment-${Math.floor(Math.random() * 2) + 1}.jpg`
          : property.property_type === "villa"
          ? `/villa-${Math.floor(Math.random() * 2) + 1}.jpg`
          : property.property_type === "studio"
          ? `/studio-${Math.floor(Math.random() * 2) + 1}.jpg`
          : "/placeholder.jpg"),
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const supabase = createServerSupabaseClient();

    // Check if the properties table exists
    const { error: checkError } = await supabase
      .from("properties")
      .select("id")
      .limit(1);

    if (checkError && checkError.message.includes("does not exist")) {
      console.log("Properties table does not exist yet. Returning null.");
      return null;
    }

    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        images:property_images(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return {
      ...data,
      images: data.images || [],
      primary_image:
        data.images?.find((img: any) => img.is_primary)?.image_url ||
        (data.property_type === "apartment"
          ? `/apartment-${Math.floor(Math.random() * 2) + 1}.jpg`
          : data.property_type === "villa"
          ? `/villa-${Math.floor(Math.random() * 2) + 1}.jpg`
          : data.property_type === "studio"
          ? `/studio-${Math.floor(Math.random() * 2) + 1}.jpg`
          : "/placeholder.jpg"),
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

export async function createProperty(
  propertyData: Partial<Property>
): Promise<Property | null> {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("properties")
      .insert(propertyData)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error creating property:", error);
    return null;
  }
}

export async function updateProperty(
  id: string,
  propertyData: Partial<Property>
): Promise<Property | null> {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("properties")
      .update(propertyData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating property:", error);
    return null;
  }
}

export async function deleteProperty(id: string): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error deleting property:", error);
    return false;
  }
}

export async function addPropertyImage(
  propertyId: string,
  imageUrl: string,
  isPrimary = false
): Promise<PropertyImage | null> {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("property_images")
      .insert({
        property_id: propertyId,
        image_url: imageUrl,
        is_primary: isPrimary,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error adding property image:", error);
    return null;
  }
}
