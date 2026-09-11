"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Register a new product to your wallet.</p>
      </div>

      <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
        <h2 className="text-lg font-medium mb-4">Demo limited</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Adding new products manually is disabled in this demo environment. The necessary demo products are already seeded in your wallet.
        </p>
        <Button asChild>
          <Link href="/products">Return to Wallet</Link>
        </Button>
      </div>
    </div>
  )
}
