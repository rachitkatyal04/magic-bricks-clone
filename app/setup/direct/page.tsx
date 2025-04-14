"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Check, Database, Loader2, AlertTriangle } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"

export default function DirectSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [setupLog, setSetupLog] = useState<string[]>([])

  const addToLog = (message: string) => {
    setSetupLog((prev) => [...prev, message])
  }

  const checkAndInsertData = async () => {
    setIsLoading(true)
    setStatus("idle")
    setErrorMessage("")
    setSetupLog([])

    try {
      const supabase = createClientSupabaseClient()
      addToLog("Starting database check...")

      // Check if properties table exists
      addToLog("Checking if properties table exists...")
      const { error: propertiesError } = await supabase.from("properties").select("id").limit(1)

      if (propertiesError && propertiesError.message.includes("does not exist")) {
        addToLog("Properties table doesn't exist. Please create tables using the SQL setup method.")
        throw new Error("Tables don't exist. Please use the SQL setup method.")
      }

      addToLog("Properties table exists. Proceeding with data insertion.")

      // Check if there's already data in the properties table
      const { data: existingProperties, error: countError } = await supabase.from("properties").select("id")

      if (countError) {
        addToLog(`Error checking existing properties: ${countError.message}`)
        throw countError
      }

      if (existingProperties && existingProperties.length > 0) {
        addToLog(`Found ${existingProperties.length} existing properties. Skipping sample data insertion.`)
        setStatus("success")
        return
      }

      // Insert sample properties
      addToLog("Inserting sample properties...")
      const { data: properties, error: insertError } = await supabase
        .from("properties")
        .insert([
          {
            title: "Modern Apartment in Downtown",
            description:
              "This beautiful modern apartment features high ceilings, large windows, and an open floor plan. Perfect for young professionals or small families.",
            price: 250000,
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            address: "123 Main St",
            city: "New York",
            state: "NY",
            zip_code: "10001",
            property_type: "apartment",
            listing_type: "sale",
            is_featured: true,
          },
          {
            title: "Luxury Villa with Pool",
            description:
              "Stunning luxury villa with private pool, garden, and panoramic views. This property offers the perfect blend of comfort and elegance.",
            price: 1200000,
            bedrooms: 4,
            bathrooms: 3,
            area: 3500,
            address: "456 Ocean Ave",
            city: "Miami",
            state: "FL",
            zip_code: "33139",
            property_type: "villa",
            listing_type: "sale",
            is_featured: true,
          },
          {
            title: "Cozy Studio for Rent",
            description: "Fully furnished studio apartment in a quiet neighborhood. All utilities included.",
            price: 1500,
            bedrooms: 0,
            bathrooms: 1,
            area: 500,
            address: "789 Park Rd",
            city: "Boston",
            state: "MA",
            zip_code: "02115",
            property_type: "apartment",
            listing_type: "rent",
            is_featured: false,
          },
        ])
        .select()

      if (insertError) {
        addToLog(`Error inserting properties: ${insertError.message}`)
        throw insertError
      }

      addToLog(`Successfully inserted ${properties.length} properties.`)

      // Add images for each property
      addToLog("Adding property images...")
      for (const property of properties) {
        const { error: imageError } = await supabase.from("property_images").insert({
          property_id: property.id,
          image_url: "/placeholder.svg?height=600&width=800",
          is_primary: true,
        })

        if (imageError) {
          addToLog(`Error adding image for property ${property.title}: ${imageError.message}`)
        } else {
          addToLog(`Added image for property ${property.title}`)
        }
      }

      addToLog("Sample data inserted successfully!")
      setStatus("success")
    } catch (error: any) {
      console.error("Setup error:", error)
      setStatus("error")
      setErrorMessage(error.message || "An unknown error occurred")
      addToLog(`Error: ${error.message || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Link href="/setup" className="flex items-center text-primary mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to setup
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Direct Data Setup
          </CardTitle>
          <CardDescription>Insert sample data into existing database tables.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Important Note</AlertTitle>
            <AlertDescription className="text-amber-700">
              This method only works if your database tables already exist. If tables don't exist, please use the SQL
              setup method instead.
            </AlertDescription>
          </Alert>

          <p className="text-sm text-muted-foreground mb-4">
            This will check if your database tables exist and insert sample data if the tables are empty.
          </p>

          {status === "success" && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Database check completed. Your database is ready to use.
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertTitle className="text-red-600">Error</AlertTitle>
              <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
            </Alert>
          )}

          {setupLog.length > 0 && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm font-mono h-64 overflow-y-auto">
              {setupLog.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={checkAndInsertData} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking database...
              </>
            ) : (
              "Check and Setup Data"
            )}
          </Button>
        </CardFooter>
      </Card>

      {status === "success" && (
        <div className="mt-4 text-center">
          <Link href="/">
            <Button>Go to Home Page</Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 text-center">
          <Link href="/setup/sql">
            <Button variant="outline">Go to SQL Setup</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
