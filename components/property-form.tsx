"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { type Property, createProperty, updateProperty, addPropertyImage } from "@/lib/properties"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface PropertyFormProps {
  property?: Omit<Property, "images">
  mode: "create" | "edit"
}

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      const propertyData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        bedrooms: Number.parseInt(formData.get("bedrooms") as string),
        bathrooms: Number.parseInt(formData.get("bathrooms") as string),
        area: Number.parseFloat(formData.get("area") as string),
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zip_code: formData.get("zip_code") as string,
        property_type: formData.get("property_type") as string,
        listing_type: formData.get("listing_type") as string,
        is_featured: formData.get("is_featured") === "on",
      }

      let savedProperty

      if (mode === "create") {
        savedProperty = await createProperty(propertyData)
      } else if (property?.id) {
        savedProperty = await updateProperty(property.id, propertyData)
      }

      // Handle image upload (simplified for this example)
      const imageUrl = formData.get("image_url") as string
      if (imageUrl && savedProperty?.id) {
        await addPropertyImage(savedProperty.id, imageUrl, true)
      }

      router.push("/admin")
      router.refresh()
    } catch (error) {
      console.error("Error saving property:", error)
      alert("Failed to save property. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Property Title</Label>
          <Input id="title" name="title" defaultValue={property?.title || ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" defaultValue={property?.price || ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="property_type">Property Type</Label>
          <Select name="property_type" defaultValue={property?.property_type || "apartment"}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="listing_type">Listing Type</Label>
          <Select name="listing_type" defaultValue={property?.listing_type || "sale"}>
            <SelectTrigger>
              <SelectValue placeholder="Select listing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" name="bedrooms" type="number" defaultValue={property?.bedrooms || ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" name="bathrooms" type="number" defaultValue={property?.bathrooms || ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Area (sq.ft)</Label>
          <Input id="area" name="area" type="number" defaultValue={property?.area || ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" defaultValue={property?.address || ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={property?.city || ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" defaultValue={property?.state || ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input id="zip_code" name="zip_code" defaultValue={property?.zip_code || ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input id="image_url" name="image_url" placeholder="https://example.com/image.jpg" />
          <p className="text-xs text-gray-500">
            Enter a URL for the property image. For a real app, you would upload images.
          </p>
        </div>

        <div className="space-y-2 flex items-center">
          <div className="flex items-center space-x-2">
            <Input
              id="is_featured"
              name="is_featured"
              type="checkbox"
              className="w-4 h-4"
              defaultChecked={property?.is_featured || false}
            />
            <Label htmlFor="is_featured">Featured Property</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={6} defaultValue={property?.description || ""} required />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Property" : "Update Property"}
        </Button>
      </div>
    </form>
  )
}
