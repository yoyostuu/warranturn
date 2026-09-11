"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Stethoscope, Menu, X, LogOut, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const logout = useStore(state => state.logout)
  const user = useStore(state => state.user)

  if (!user) {
    return <>{children}</>
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Cases", href: "/cases", icon: Stethoscope },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--color-border-subtle)] bg-[var(--color-surface)] transition-transform duration-300 md:static md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
              <Stethoscope size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Warranturn</span>
          </Link>
          <button 
            className="ml-auto text-[var(--color-text-secondary)] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
            Demo Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-[var(--color-surface-soft)] text-white" 
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-white"
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-[var(--color-border-subtle)]">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3" 
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 shadow-sm">
          <button
            className="text-[var(--color-text-secondary)] md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex flex-1 items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <span className="hidden sm:inline-block">Workspace</span>
            <ChevronRight size={14} className="hidden sm:inline-block" />
            <span className="text-[var(--color-text-main)] font-medium">
              {navItems.find(i => pathname.startsWith(i.href))?.name || "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-white">{user.name}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{user.email}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-[var(--color-surface-soft)] border border-[var(--color-border-strong)]" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
