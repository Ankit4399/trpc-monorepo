"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  useGetFields,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "~/hooks/api/form"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Checkbox } from "~/components/ui/checkbox"
import { Plus, Trash2, Loader2, LayoutList, Pencil } from "lucide-react"

const fieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  labelKey: z.string().min(1, "Field key is required"),
  type: z.enum(["text", "number", "email", "yes_no", "password"]),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  isRequired: z.boolean(),
})

type FieldFormInput = z.infer<typeof fieldSchema>

interface FormBuilderProps {
  formId: string
}

interface EditingField {
  id: string
  formId: string
  label: string
  labelKey: string
  type: "text" | "number" | "email" | "yes_no" | "password"
  placeholder?: string | null
  description?: string | null
  isRequired: boolean
}

export function FormBuilder({ formId }: FormBuilderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingField, setEditingField] = useState<EditingField | null>(null)
  const { fields, isLoading, error } = useGetFields(formId)
  const { createFieldAsync, isSuccess: createSuccess } = useCreateField()
  const { updateFieldAsync } = useUpdateField()
  const { deleteFieldAsync } = useDeleteField()

  const form = useForm<FieldFormInput>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      type: "text",
      isRequired: false,
      placeholder: "",
      description: "",
    },
  })

  const nextIndex =
    (fields && fields.length > 0)
      ? Math.max(...fields.map((f) => parseFloat(f.index))) + 1
      : 1

  const handleEditField = (field: EditingField) => {
    setEditingField(field)
    form.reset({
      label: field.label,
      labelKey: field.labelKey,
      type: field.type,
      placeholder: field.placeholder || "",
      description: field.description || "",
      isRequired: field.isRequired,
    })
    setIsOpen(true)
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setEditingField(null)
    form.reset({
      type: "text",
      isRequired: false,
      placeholder: "",
      description: "",
    })
  }

  async function onSubmit(values: FieldFormInput) {
    try {
      if (editingField) {
        // Update existing field
        await updateFieldAsync({
          id: editingField.id,
          ...values,
        })
      } else {
        // Create new field
        await createFieldAsync({
          formId,
          ...values,
          index: nextIndex,
        })
      }
      form.reset()
      handleCloseDialog()
    } catch (err) {
      console.error("Failed to save field:", err)
    }
  }

  async function handleDeleteField(fieldId: string) {
    if (confirm("Are you sure you want to delete this field?")) {
      try {
        await deleteFieldAsync({ id: fieldId })
      } catch (err) {
        console.error("Failed to delete field:", err)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">
            Failed to load fields: {error.message}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <LayoutList className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Form Fields</CardTitle>
                <CardDescription className="mt-1">
                  Manage and organize your form fields
                </CardDescription>
              </div>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer gap-2 shadow-lg" size="lg">
                  <Plus className="size-4" />
                  <span>Add Field</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {editingField ? "Edit Field" : "Create New Field"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingField
                      ? "Update field settings and configuration"
                      : "Add a new field to your form with customizable settings"}
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field Label</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter field label" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="labelKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field Key (Identifier)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., first_name"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Unique identifier for this field in form submissions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="password">Password</SelectItem>
                              <SelectItem value="yes_no">Yes/No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="placeholder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Placeholder Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter placeholder text (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter field description (optional)"
                              {...field}
                              className="resize-none"
                              rows={3}
                            />
                          </FormControl>
                          <FormDescription>
                            Help text displayed to users completing the form
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isRequired"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Mark as required field</FormLabel>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={handleCloseDialog}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="cursor-pointer gap-2"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            {editingField ? "Updating..." : "Adding..."}
                          </>
                        ) : (
                          <>
                            {editingField ? (
                              <>
                                <Pencil className="size-4" />
                                Update Field
                              </>
                            ) : (
                              <>
                                <Plus className="size-4" />
                                Add Field
                              </>
                            )}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {!fields || fields.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LayoutList className="size-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No fields yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Add Field" to create your first form field
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-0 bg-muted/50">
                  <TableHead className="font-semibold text-foreground">Field Label</TableHead>
                  <TableHead className="font-semibold text-foreground">Identifier</TableHead>
                  <TableHead className="font-semibold text-foreground">Type</TableHead>
                  <TableHead className="font-semibold text-foreground">Required</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Edit / Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow 
                    key={field.id}
                    className="hover:bg-muted/30 transition-colors border-b last:border-0"
                  >
                    <TableCell className="font-semibold py-4">{field.label}</TableCell>
                    <TableCell className="text-sm text-muted-foreground py-4">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                        {field.labelKey}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {field.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        field.isRequired 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {field.isRequired ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEditField(field)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteField(field.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
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
