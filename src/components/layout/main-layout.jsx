"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "@/contexts/auth-context"
import Navbar from "../Navbar"


const API_URL = "http://localhost:5000"

export function MainLayout({ children }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/categories`)
        setCategories(response.data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <div className="container flex gap-8 py-8 px-4 md:px-8">
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="sticky top-24 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-lg">Categories</h4>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="space-y-1">
                      <Link
                        to={`/products?category=${category.id}`}
                        className="block text-sm text-muted-foreground hover:text-foreground"
                      >
                        {category.name}
                      </Link>
                      {category.subcategories?.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              to={`/products?subcategory=${subcategory.id}`}
                              className="block text-sm text-muted-foreground hover:text-foreground"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
} 