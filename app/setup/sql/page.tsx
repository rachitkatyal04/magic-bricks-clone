"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Database, Copy, Check, ExternalLink } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { setupSQL } from "../sql-script"

export default function SQLSetupPage() {
  const [sql, setSql] = useState(setupSQL)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/setup" className="flex items-center text-primary mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to setup
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            SQL Setup Script
          </CardTitle>
          <CardDescription>
            Copy this SQL script and run it in your Supabase SQL editor to set up the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-800 mb-2">How to use this script:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-700 space-y-2">
                <li>Copy the SQL script below using the "Copy SQL" button</li>
                <li>
                  Go to your{" "}
                  <a
                    href="https://app.supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    Supabase dashboard <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
                <li>Select your project</li>
                <li>Click on "SQL Editor" in the left sidebar</li>
                <li>Click "New query"</li>
                <li>Paste the SQL script into the editor</li>
                <li>Click "Run" to execute the script</li>
                <li>Return to this application after successful execution</li>
              </ol>
            </div>

            <div className="relative">
              <Textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                className="font-mono text-sm h-96"
                spellCheck={false}
              />
              <Button onClick={copyToClipboard} className="absolute top-2 right-2 h-8 px-3 gap-1" size="sm">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="font-medium mb-2">What this script does:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>
                  Creates the <code>properties</code> table
                </li>
                <li>
                  Creates the <code>property_images</code> table
                </li>
                <li>
                  Creates the <code>users</code> table
                </li>
                <li>
                  Creates the <code>saved_properties</code> table
                </li>
                <li>Inserts sample property data</li>
                <li>Inserts sample property images</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={copyToClipboard} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy SQL to Clipboard"}
          </Button>
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          After running the SQL script in Supabase, check if your database is ready:
        </p>
        <Link href="/setup">
          <Button>Check Database Status</Button>
        </Link>
      </div>
    </div>
  )
}
