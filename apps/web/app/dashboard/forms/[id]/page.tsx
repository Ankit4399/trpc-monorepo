"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function FormEditPage() {
  const params = useParams()
  const formId = params.id as string

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center gap-4">
                  <Link href="/dashboard/forms">
                    <Button variant="ghost" size="icon">
                      <ArrowLeft className="size-4" />
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Form</h1>
                    <p className="text-muted-foreground">
                      Form ID: {formId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <div className="rounded-md border p-6">
                  <p className="text-muted-foreground">
                    Form builder coming soon...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
