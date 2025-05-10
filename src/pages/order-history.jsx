import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import UserLayout from "@/components/layout/user-layout"
import axios from "axios"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10

  useEffect(() => {
    if (!user) return
    setLoading(true)
    axios.get(`https://cloud-computing-server-cdaqdbameug5gud6.southeastasia-01.azurewebsites.net/api/user/orders`, { withCredentials: true })
      .then(res => {
        setOrders(res.data)
        setError("")
      })
      .catch(err => {
        setError(err.response?.data?.error || "Failed to fetch orders")
      })
      .finally(() => setLoading(false))
  }, [user])

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(orders.length / ordersPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <UserLayout>
      <h1 className="text-2xl font-bold mb-6 text-center">Order History</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted-foreground">You have not placed any orders yet.</div>
      ) : (
        <div className="space-y-6">
          {currentOrders.map(order => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order #{order.id}</CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-sm text-muted-foreground">Placed on: {new Date(order.created_at).toLocaleString()}</div>
                <div className="mb-2 font-medium">Total: PKR {Number(order.total_amount).toLocaleString()}</div>
                {order.tracking_id && (
                  <div className="mb-4">
                    <span className="text-sm font-medium">Tracking ID: </span>
                    <span className="text-sm bg-muted px-2 py-1 rounded">{order.tracking_id}</span>
                  </div>
                )}
                <div className="mb-2">Items:</div>
                <ul className="list-disc ml-6 text-sm">
                  {order.items && order.items.length > 0 ? order.items.map(item => (
                    <li key={item.id}>{item.name} x {item.quantity} (PKR {Number(item.price).toLocaleString()})</li>
                  )) : <li>No items found</li>}
                </ul>
              </CardContent>
            </Card>
          ))}

          {/* Simple Pagination */}
          {orders.length > ordersPerPage && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index + 1}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </UserLayout>
  )
} 