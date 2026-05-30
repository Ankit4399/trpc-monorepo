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
    <div className="space-y-8 py-2">
      {/* Premium Header Section */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-start gap-4 flex-1">
          <Link href={`/dashboard/forms/${formId}`}>
            <Button 
              variant="ghost" 
              size="icon"
              className="mt-1 hover:bg-primary/10 text-foreground transition-all duration-200"
            >
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-end gap-3 mb-4">
              <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Submissions
              </h1>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/40 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="text-2xl font-bold text-primary">
                  {submissions?.length || 0}
                </span>
                <span className="text-sm font-medium text-primary/80 ml-3">
                  {submissions?.length === 1 ? "response" : "responses"}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                received
              </p>
            </div>
          </div>
        </div>
      </div>

      {!submissions || submissions.length === 0 ? (
        <Card className="border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent shadow-lg rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-xl font-semibold text-foreground">
                No submissions yet
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Responses will appear here when users submit your form
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-card to-card/98 dark:from-card/95 dark:to-card/80 rounded-xl">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-0 bg-gradient-to-r from-primary/15 via-primary/8 to-background hover:from-primary/20 hover:via-primary/10 transition-all duration-200">
                    <TableHead className="font-bold text-foreground py-5 px-7 text-base uppercase tracking-wider">
                      Submission Date
                    </TableHead>
                    {sortedFields.map((field) => (
                      <TableHead
                        key={field.id}
                        className="font-bold text-foreground py-5 px-7 text-base uppercase tracking-wider"
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
                      className={`transition-all duration-200 border-b border-primary/8 last:border-0 group hover:bg-primary/8 ${
                        idx % 2 === 0 ? "bg-background/40" : "bg-background/60"
                      }`}
                    >
                      <TableCell className="text-sm py-6 px-7 font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-200 whitespace-nowrap">
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
                          <TableCell key={field.id} className="text-sm py-6 px-7">
                            <span
                              className={`inline-flex px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-xs whitespace-nowrap ${
                                isEmpty
                                  ? "bg-muted/30 text-muted-foreground/70 border border-muted/40"
                                  : "bg-gradient-to-r from-primary/20 to-primary/15 text-primary border border-primary/30 shadow-md hover:shadow-lg hover:from-primary/25 hover:to-primary/20 group-hover:scale-105"
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
        </div>
      )}
    </div>
  )
}
