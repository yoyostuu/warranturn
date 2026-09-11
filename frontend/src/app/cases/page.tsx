"use client"

import Link from "next/link"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Plus, ChevronRight, Activity } from "lucide-react"
import { motion } from "framer-motion"

export default function CasesPage() {
  const cases = useStore(state => state.cases)
  const products = useStore(state => state.products)

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resolution Cases</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Track and manage your ongoing product resolutions.</p>
        </div>
        <Button asChild>
          <Link href="/cases/new">
            <Plus className="mr-2 h-4 w-4" />
            Report an issue
          </Link>
        </Button>
      </div>

      {cases.length > 0 ? (
        <div className="space-y-4">
          {cases.map((c, i) => {
            const product = products.find(p => p.id === c.productId)
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={c.id}
              >
                <Link href={`/cases/${c.id}`} className="block">
                  <Card className="hover:border-[var(--color-primary)]/50 transition-colors bg-[var(--color-surface)]">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant={c.stage.includes("AWAITING") ? "warning" : c.stage === "FAILED" ? "destructive" : c.stage === "RESOLVED" ? "success" : "default"}>
                              {c.stage.replace(/_/g, ' ')}
                            </Badge>
                            <span className="text-xs text-[var(--color-text-muted)]">
                              Case ID: {c.id}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold text-xl mb-1">{product?.brand} {product?.productName}</h3>
                          
                          <div className="space-y-1 mt-4">
                            <div className="flex gap-2 text-sm">
                              <span className="text-[var(--color-text-secondary)] min-w-[60px]">Goal:</span>
                              <span className="text-white font-medium">{c.originalGoal}</span>
                            </div>
                            <div className="flex gap-2 text-sm">
                              <span className="text-[var(--color-text-secondary)] min-w-[60px]">Issue:</span>
                              <span className="text-[var(--color-text-main)] line-clamp-1">{c.issueDescription}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-start sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-[var(--color-border-subtle)] pt-4 sm:pt-0 sm:pl-6 shrink-0">
                          <div className="text-sm text-[var(--color-text-secondary)] mb-4 sm:mb-0">
                            Updated {new Date(c.updatedAt).toLocaleDateString()}
                          </div>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto mt-auto">
                            View Case <ChevronRight size={14} className="ml-2" />
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
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[var(--color-border-strong)] rounded-2xl bg-[var(--color-surface)]/50">
          <Stethoscope className="h-12 w-12 text-[var(--color-text-muted)] mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No resolution cases</h3>
          <p className="text-[var(--color-text-secondary)] max-w-sm mb-6">You don't have any active or past resolutions.</p>
          <Button asChild>
            <Link href="/cases/new">Report an issue</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
