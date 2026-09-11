"use client"

import Link from "next/link"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Plus, ShieldAlert, ShieldCheck } from "lucide-react"

export default function ProductsPage() {
  const products = useStore(state => state.products)

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Wallet</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your owned products and their warranties.</p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} className="block">
              <Card className="h-full hover:border-[var(--color-primary)]/50 transition-colors bg-[var(--color-surface)]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center border border-[var(--color-border-subtle)]">
                      <Package className="h-6 w-6 text-[var(--color-text-secondary)]" />
                    </div>
                    {product.warrantyStatus === "Active" ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-xs font-medium border border-[var(--color-success)]/20">
                        <ShieldCheck size={14} /> Active
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)] text-xs font-medium border border-[var(--color-warning)]/20">
                        <ShieldAlert size={14} /> Expired
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg leading-tight mb-1">{product.brand}</h3>
                  <p className="text-[var(--color-text-main)] font-medium text-lg mb-4">{product.productName}</p>
                  
                  <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex justify-between">
                      <span>Purchased:</span>
                      <span className="text-white">{new Date(product.purchaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Source:</span>
                      <span className="text-white">{product.purchaseSource}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[var(--color-border-strong)] rounded-2xl bg-[var(--color-surface)]/50">
          <Package className="h-12 w-12 text-[var(--color-text-muted)] mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No products saved</h3>
          <p className="text-[var(--color-text-secondary)] max-w-sm mb-6">Add your first product to start managing warranties and resolutions.</p>
          <Button asChild>
            <Link href="/products/new">Add a Product</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
