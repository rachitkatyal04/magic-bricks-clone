"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Check, Database, Loader2, Code, AlertTriangle } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [tablesExist, setTablesExist] = useState<boolean | null>(null)

  // Check if tables exist
  const checkTables = async () => {
    setIsLoading(true)
    setStatus("checking")
    setErrorMessage("")

    try {
      const supabase = createClientSupabaseClient()

      // Check if properties table exists
      const { error: propertiesError } = await supabase.from("properties").select("id").limit(1)

      if (propertiesError && propertiesError.message.includes("does not exist")) {
        setTablesExist(false)
      } else {
        setTablesExist(true)
      }

      setStatus("success")
    } catch (error: any) {
      console.error("Check error:", error)
      setStatus("error")
      setErrorMessage(error.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Run the check when the component mounts
  useState(() => {
    checkTables()
  })

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Link href="/" className="flex items-center text-primary mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Setup
          </CardTitle>
          <CardDescription>
            Set up the database tables and sample data for the MagicBricks clone application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {status === "checking" && (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Checking database status...</span>
              </div>
            )}

            {status === "error" && (
              <Alert className="bg-red-50 border-red-200">
                <AlertTitle className="text-red-600">Error</AlertTitle>
                <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <>
                {tablesExist === false && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Database Tables Not Found</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Your database tables need to be created before you can use the application. Please use the SQL
                      setup method below.
                    </AlertDescription>
                  </Alert>
                )}

                {tablesExist === true && (
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600">Database Tables Found</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your database tables already exist. You can insert sample data or start using the application.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Option 1: SQL Setup {tablesExist === false && "(Recommended)"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Copy the SQL script and run it in your Supabase SQL Editor. This will create all necessary tables
                      and insert sample data.
                    </p>
                    <Link href="/setup/sql">
                      <Button variant="outline" className="w-full">
                        View SQL Setup Script
                      </Button>
                    </Link>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Option 2: Direct Data Setup {tablesExist === true && "(Recommended)"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tablesExist === true
                        ? "Insert sample data into your existing database tables."
                        : "This option only works if your database tables already exist."}
                    </p>
                    <Link href="/setup/direct">
                      <Button variant="outline" className="w-full" disabled={tablesExist === false}>
                        {tablesExist === true ? "Insert Sample Data" : "Tables Required"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={checkTables} disabled={isLoading} variant="outline">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Refresh Database Status"
          )}
        </Button>
      </div>
    </div>
  )
}
