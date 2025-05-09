"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/me", { withCredentials: true })
      console.log(response.data)
      setUser(response.data)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (identifier, password) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        identifier,
        password,
      }, { withCredentials: true })
      // After login, fetch user info
      await fetchUser()
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
      })
      const { token, user } = response.data
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true })
    } catch (err) {
      // Optionally handle error
      console.log(err)
    }
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 