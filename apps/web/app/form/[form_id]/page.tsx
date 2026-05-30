"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useGetFormById } from "~/hooks/api/form"
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
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Checkbox } from "~/components/ui/checkbox"
import { Loader2 } from "lucide-react"

export default function PublicFormPage() {
  const params = useParams()
  const formId = params.form_id as string
  const [submitted, setSubmitted] = useState(false)

  const { form: formData, isLoading, error } = useGetFormById(formId)

  // Build dynamic schema based on form fields
  const buildSchema = () => {
    if (!formData?.fields) return z.record(z.string(), z.any())

    const schemaShape: Record<string, z.ZodTypeAny> = {}

    formData.fields.forEach((field) => {
      let validator: z.ZodTypeAny = z.string().optional()

      switch (field.type) {
        case "email":
          validator = z.string().email("Invalid email address")
          break
        case "number":
          validator = z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid number")
          break
        case "password":
          validator = z.string().min(6, "Password must be at least 6 characters")
          break
        case "yes_no":
          validator = z.enum(["yes", "no"])
          break
        default:
          validator = z.string()
      }

      if (field.isRequired) {
        if (field.type === "yes_no") {
          validator = validator.refine((val) => val !== undefined, {
            message: `${field.label} is required`,
          })
        } else if (field.type === "password" || field.type === "email") {
          validator = (validator as any).min(1, `${field.label} is required`)
        } else {
          validator = (validator as any).min(1, `${field.label} is required`)
        }
      }

      schemaShape[field.labelKey] = validator
    })

    return z.object(schemaShape)
  }

  const formSchema = buildSchema()

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const onSubmit = async (values: Record<string, any>) => {
    // TODO: Send form submission to backend
    console.log("Form submitted:", values)
    setSubmitted(true)
    setTimeout(() => {
      form.reset()
      setSubmitted(false)
    }, 3000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin size-8 text-primary" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">
              {error?.message || "Form not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl">{formData.title}</CardTitle>
            {formData.description && (
              <CardDescription className="text-base">{formData.description}</CardDescription>
            )}
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="rounded-lg bg-green-50 border border-green-200 p-8 text-center">
                <p className="text-lg font-semibold text-green-900">Thank you!</p>
                <p className="text-sm text-green-700 mt-2">Your response has been recorded</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {formData.fields && formData.fields.length > 0 ? (
                    formData.fields.map((field) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={field.labelKey as any}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>
                              {field.label}
                              {field.isRequired && <span className="text-destructive ml-1">*</span>}
                            </FormLabel>

                            {field.type === "yes_no" ? (
                              <Select
                                onValueChange={formField.onChange}
                                defaultValue={formField.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an option" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : field.type === "password" ? (
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder={field.placeholder || "Enter your response"}
                                  {...formField}
                                />
                              </FormControl>
                            ) : (
                              <FormControl>
                                <Input
                                  type={field.type === "email" ? "email" : field.type === "number" ? "number" : "text"}
                                  placeholder={field.placeholder || "Enter your response"}
                                  {...formField}
                                />
                              </FormControl>
                            )}

                            {field.description && (
                              <FormDescription>{field.description}</FormDescription>
                            )}

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))
                  ) : (
                    <div className="rounded-lg bg-slate-50 p-8 text-center">
                      <p className="text-sm text-muted-foreground">No fields in this form</p>
                    </div>
                  )}

                  {formData.fields && formData.fields.length > 0 && (
                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={form.formState.isSubmitting}
                      size="lg"
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  )}
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
