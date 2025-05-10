import { useEffect, useState } from "react"
import axios from "axios"
import { ProductGrid } from "@/components/products/product-grid"

const API_URL = "https://cloud-computing-server-cdaqdbameug5gud6.southeastasia-01.azurewebsites.net"

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`)
        console.log('Fetched products:', response.data)
        setProducts(response.data)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err.response?.data?.error || 'Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Products</h1>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">No products found</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
} 