"use client"

import { useForm, Controller } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function Login() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")

  const onSubmit = async (data) => {
    setError("")
    try {
      const result = await login(data.identifier, data.password)
      if (result.success) {
        navigate("/")
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("An error occurred during login")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-2 pb-0">
          <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">Enter your credentials to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4 pt-6">
            {error && <div className="text-sm text-red-500 text-center">{error}</div>}
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-sm font-medium">Email or Username</label>
              <Controller
                name="identifier"
                control={control}
                defaultValue=""
                rules={{ required: "Email or username is required" }}
                render={({ field }) => (
                  <Input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your email or username"
                    {...field}
                    className={errors.identifier ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.identifier && <span className="text-xs text-red-500">{errors.identifier.message}</span>}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...field}
                    className={errors.password ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-0">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="underline hover:text-primary">Register</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 