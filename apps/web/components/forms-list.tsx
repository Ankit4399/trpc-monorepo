"use client"

import Link from "next/link"
import { useListForms } from "~/hooks/api/form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import { Loader2 } from "lucide-react"

export function FormsList() {
  const { forms, isLoading, error } = useListForms()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load forms: {error.message}
      </div>
    )
  }

  if (!forms || forms.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No forms yet. Create one to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow key={form.id}>
              <TableCell className="font-medium">{form.title}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {form.description || "-"}
              </TableCell>
              <TableCell className="text-sm">
                {new Date(form.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/dashboard/forms/${form.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
