"use client"

import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import axios from "axios"

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const onSubmit = async (data) => {
    setError("")
    setSuccess("")
    try {
      await axios.post("http://localhost:5000/auth/register", data)
      setSuccess("Registration successful! You can now log in.")
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-2 pb-0">
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Sign up to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4 pt-6">
            {error && <div className="text-sm text-red-500 text-center">{error}</div>}
            {success && <div className="text-sm text-green-600 text-center">{success}</div>}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-0">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="underline hover:text-primary">Login</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 