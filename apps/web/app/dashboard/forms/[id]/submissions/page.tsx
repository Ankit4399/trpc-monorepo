"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useGetFields, useGetFormSubmissions } from "~/hooks/api/form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function FormSubmissionsPage() {
  const params = useParams()
  const formId = params.id as string

  const { fields, isLoading: fieldsLoading } = useGetFields(formId)
  const { submissions, isLoading: submissionsLoading } = useGetFormSubmissions(formId)

  const isLoading = fieldsLoading || submissionsLoading

  // Sort fields by index
  const sortedFields = fields ? [...fields].sort((a, b) => {
    const indexA = parseFloat(a.index)
    const indexB = parseFloat(b.index)
    return indexA - indexB
  }) : []

  // Helper function to get value for a specific field in a submission
  const getFieldValue = (submission: any, fieldId: string) => {
    const fieldValue = submission.values?.find((v: any) => v.formFieldId === fieldId)
    return fieldValue?.value || "-"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin size-6" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <Link href={`/dashboard/forms/${formId}`}>
            <Button 
              variant="ghost" 
              size="icon"
              className="mt-1 hover:bg-primary/10"
            >
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Form Submissions
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/15 border border-primary/30">
                <span className="text-lg font-semibold text-primary">
                  {submissions?.length || 0}
                </span>
                <span className="text-sm text-primary/70 ml-2">
                  {submissions?.length === 1 ? "response" : "responses"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                received
              </p>
            </div>
          </div>
        </div>
      </div>

      {!submissions || submissions.length === 0 ? (
        <Card className="border border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                No submissions yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Responses will appear here when users submit the form
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-card to-card/95 dark:from-card dark:to-card/80">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:bg-gradient-to-r hover:from-primary/15 hover:via-primary/10 hover:to-transparent transition-colors">
                  <TableHead className="font-semibold text-foreground py-4 px-6">
                    Submission Date
                  </TableHead>
                  {sortedFields.map((field) => (
                    <TableHead
                      key={field.id}
                      className="font-semibold text-foreground py-4 px-6"
                    >
                      <span className="flex items-center gap-2">
                        {field.label}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission, idx) => (
                  <TableRow
                    key={submission.id}
                    className={`transition-all duration-200 hover:bg-primary/5 border-b border-primary/10 last:border-0 ${
                      idx % 2 === 0 ? "bg-background/50" : "bg-background"
                    }`}
                  >
                    <TableCell className="text-sm py-5 px-6 font-medium whitespace-nowrap text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    {sortedFields.map((field) => {
                      const value = getFieldValue(submission, field.id)
                      const isEmpty = value === "-"
                      return (
                        <TableCell key={field.id} className="text-sm py-5 px-6">
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-lg font-medium transition-colors duration-150 text-xs ${
                              isEmpty
                                ? "bg-muted/40 text-muted-foreground/60"
                                : "bg-gradient-to-r from-primary/15 to-primary/10 text-primary border border-primary/20 font-semibold shadow-sm"
                            }`}
                          >
                            {value}
                          </span>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  )
}
