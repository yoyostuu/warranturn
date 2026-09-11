"use client"

import { use } from "react"
import Link from "next/link"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Stethoscope, ChevronLeft, Calendar, FileText, CheckCircle2 } from "lucide-react"

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params)
  const products = useStore(state => state.products)
  const cases = useStore(state => state.cases)
  
  const product = products.find(p => p.id === productId)
  const productCases = cases.filter(c => c.productId === productId)

  if (!product) {
    return <div className="p-12 text-center text-[var(--color-text-muted)]">Product not found</div>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <Link href="/products" className="inline-flex items-center text-sm text-[var(--color-text-secondary)] hover:text-white mb-4">
          <ChevronLeft size={16} className="mr-1" /> Back to Wallet
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
              <Package className="h-8 w-8 text-[var(--color-text-secondary)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{product.brand} {product.productName}</h1>
              <p className="text-[var(--color-text-secondary)] mt-1">Order ID: {product.orderId || "N/A"}</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/cases/new">
              <Stethoscope className="mr-2 h-4 w-4" />
              Report an issue
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)]">
            <CardHeader>
              <CardTitle>Purchase Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-strong)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-1">
                    <Calendar size={14} /> Purchased On
                  </div>
                  <div className="font-medium text-white">{new Date(product.purchaseDate).toLocaleDateString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-strong)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-1">
                    <FileText size={14} /> Source
                  </div>
                  <div className="font-medium text-white">{product.purchaseSource}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Case History</CardTitle>
            </CardHeader>
            <CardContent>
              {productCases.length > 0 ? (
                <div className="space-y-4 pt-4">
                  {productCases.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-4 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-strong)]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{c.stage}</Badge>
                          <span className="text-xs text-[var(--color-text-muted)]">{new Date(c.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <p className="font-medium text-white text-sm">{c.originalGoal}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/cases/${c.id}`}>View Case</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-[var(--color-text-muted)] text-sm">
                  No cases reported for this product yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)]">
            <CardHeader>
              <CardTitle>Warranty Status</CardTitle>
            </CardHeader>
            <CardContent>
              {product.warrantyStatus === "Active" ? (
                <div className="flex flex-col items-center text-center p-6 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-xl mb-4">
                  <CheckCircle2 className="h-8 w-8 text-[var(--color-success)] mb-2" />
                  <span className="text-[var(--color-success)] font-semibold text-lg">Active</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-6 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-xl mb-4">
                  <span className="text-[var(--color-warning)] font-semibold text-lg">Expired</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-text-secondary)]">Expires on:</span>
                <span className="text-white font-medium">{new Date(product.warrantyExpiry).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-surface)] border-[var(--color-border-subtle)]">
            <CardHeader>
              <CardTitle>Saved Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-strong)]">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] text-xs font-bold">PDF</div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[120px]">amazon_invoice.pdf</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
