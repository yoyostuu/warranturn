"use client"

import Link from "next/link"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Stethoscope, Clock, ShieldCheck, ChevronRight, Activity, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const user = useStore(state => state.user)
  const products = useStore(state => state.products)
  const cases = useStore(state => state.cases)

  const activeCases = cases.filter(c => !["RESOLVED", "DRAFT"].includes(c.stage))
  const needsApproval = cases.filter(c => ["AWAITING_APPROVAL", "AWAITING_REAPPROVAL", "AWAITING_VERIFICATION"].includes(c.stage))

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Here is your resolution overview.</p>
        </div>
        <Button asChild size="lg" className="shadow-lg shadow-[var(--color-primary)]/20">
          <Link href="/cases/new">
            <Stethoscope className="mr-2 h-4 w-4" />
            Resolve an issue
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Package size={80} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">Saved Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={80} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCases.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-surface)] border-[var(--color-primary)]/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-[var(--color-primary)]">
            <ShieldCheck size={80} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-primary)]">Requires Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--color-primary)]">{needsApproval.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Active Resolution</h2>
            <Link href="/cases" className="text-sm text-[var(--color-primary)] hover:underline flex items-center">
              View all <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
          
          {activeCases.length > 0 ? (
            <div className="space-y-4">
              {activeCases.map((c, i) => {
                const product = products.find(p => p.id === c.productId)
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={c.id}
                  >
                    <Link href={`/cases/${c.id}`} className="block">
                      <Card className="border-[var(--color-border-strong)] hover:border-[var(--color-primary)]/50 transition-colors bg-[var(--color-surface-soft)]">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={c.stage.includes("AWAITING") ? "warning" : c.stage === "FAILED" ? "destructive" : "default"}>
                                  {c.stage.replace(/_/g, ' ')}
                                </Badge>
                                <span className="text-xs text-[var(--color-text-muted)]">
                                  Updated {new Date(c.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="font-semibold text-lg">{product?.brand} {product?.productName}</h3>
                              <p className="text-[var(--color-text-secondary)] text-sm mt-1 line-clamp-1">Goal: {c.originalGoal}</p>
                            </div>
                            <div className="flex items-center sm:items-start shrink-0">
                              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                View Case <ArrowRight size={14} className="ml-2" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          ) : (
             <Card className="border-dashed border-[var(--color-border-strong)] bg-transparent">
               <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                 <ShieldCheck className="h-12 w-12 text-[var(--color-text-muted)] mb-4" />
                 <h3 className="text-lg font-medium text-white mb-2">No active cases</h3>
                 <p className="text-[var(--color-text-secondary)] max-w-sm mb-6">You don't have any products currently undergoing resolution.</p>
                 <Button asChild>
                   <Link href="/cases/new">Report an issue</Link>
                 </Button>
               </CardContent>
             </Card>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Product Wallet</h2>
            <Link href="/products" className="text-sm text-[var(--color-primary)] hover:underline flex items-center">
              View all <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {products.slice(0, 3).map((p, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={p.id}
              >
                <Card className="bg-[var(--color-surface)]">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                      <Package className="h-6 w-6 text-[var(--color-text-secondary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{p.brand} {p.productName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                        <span className="text-xs text-[var(--color-text-muted)]">Warranty Active</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            <Button variant="ghost" className="w-full border border-dashed border-[var(--color-border-strong)]" asChild>
              <Link href="/products/new">+ Add Product</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
