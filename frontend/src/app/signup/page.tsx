"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/store"
import { Stethoscope } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const login = useStore(state => state.login)
  const [name, setName] = useState("Demo User")
  const [email, setEmail] = useState("demo@warranturn.app")
  const [password, setPassword] = useState("password123")
  const [loading, setLoading] = useState(false)

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login(email)
      router.push("/dashboard")
    }, 800)
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-[var(--color-background)]">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white mb-4">
            <Stethoscope size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Create an account</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">Start your demo workspace</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-xl">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Continue with demo account"}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
