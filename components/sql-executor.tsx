"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"

interface SqlExecutorProps {
  defaultSql?: string
}

export function SqlExecutor({ defaultSql = "" }: SqlExecutorProps) {
  const [sql, setSql] = useState(defaultSql)
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const executeSql = async () => {
    if (!sql.trim()) return

    setIsExecuting(true)
    setResult(null)
    setError(null)

    try {
      const supabase = createClientSupabaseClient()

      // This is a simplified approach - in a real app, you'd need to handle
      // different types of SQL statements differently
      const { data, error: queryError } = await supabase.rpc("run_sql", { query: sql })

      if (queryError) throw queryError

      setResult(data)
    } catch (err: any) {
      console.error("SQL execution error:", err)
      setError(err.message || "An error occurred while executing the SQL")
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        placeholder="Enter SQL statement..."
        className="font-mono text-sm h-64"
        spellCheck={false}
      />

      <div className="flex justify-end">
        <Button onClick={executeSql} disabled={isExecuting || !sql.trim()}>
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executing...
            </>
          ) : (
            "Execute SQL"
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted p-2 font-medium text-sm">Result</div>
          <pre className="p-4 overflow-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
