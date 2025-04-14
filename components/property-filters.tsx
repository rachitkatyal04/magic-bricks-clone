"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PropertyFilters() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [listingType, setListingType] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (location) params.append("location", location)
    if (propertyType) params.append("propertyType", propertyType)
    if (listingType) params.append("listingType", listingType)

    router.push(`/properties?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 w-full max-w-4xl mx-auto">
      <Input
        placeholder="Enter location..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="md:flex-1"
      />
      <Select value={propertyType} onValueChange={setPropertyType}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Property Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apartment">Apartment</SelectItem>
          <SelectItem value="house">House</SelectItem>
          <SelectItem value="villa">Villa</SelectItem>
          <SelectItem value="commercial">Commercial</SelectItem>
        </SelectContent>
      </Select>
      <Select value={listingType} onValueChange={setListingType}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="For Sale/Rent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sale">For Sale</SelectItem>
          <SelectItem value="rent">For Rent</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full md:w-auto">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  )
}
