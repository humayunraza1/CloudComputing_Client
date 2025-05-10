import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, X, User, Plus, Minus, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useState } from 'react'
import axios from 'axios'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [trackingId, setTrackingId] = useState("")
  const [trackingResult, setTrackingResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [trackingError, setTrackingError] = useState(null)

  const handleTrackOrder = async () => {
    if (!trackingId) return
    
    setIsLoading(true)
    setTrackingResult(null)
    setTrackingError(null)
    
    try {
      const response = await axios.get(`https://cloud-computing-server-cdaqdbameug5gud6.southeastasia-01.azurewebsites.net/api/trackorder/${trackingId}`)
      setTrackingResult(response.data)
    } catch (error) {
      setTrackingError(
        error.response?.data?.error || 
        "An error occurred while tracking your order"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const resetTracking = () => {
    setTrackingId("")
    setTrackingResult(null)
    setTrackingError(null)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full md:w-[90dvw] mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">E-Commerce</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link
                to="/"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  location.pathname === "/" ? "text-foreground" : "text-foreground/60"
                )}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  location.pathname === "/products" ? "text-foreground" : "text-foreground/60"
                )}
              >
                Products
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    location.pathname === "/dashboard" ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  Dashboard
                </Link>
              )}
              {/* Track Order Link */}
              <Dialog onOpenChange={(open) => !open && resetTracking()}>
                <DialogTrigger asChild>
                  <button
                    className={cn(
                      "transition-colors hover:text-foreground/80",
                      "text-foreground/60"
                    )}
                  >
                    Track Order
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Track Your Order</DialogTitle>
                    <DialogDescription>
                      Enter your tracking ID to check the status of your order.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {!trackingResult && !trackingError && (
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="trackingId">Tracking ID</Label>
                        <Input
                          id="trackingId"
                          placeholder="Enter your tracking ID"
                          value={trackingId}
                          onChange={(e) => setTrackingId(e.target.value.trim())}
                        />
                      </div>
                    </div>
                  )}
                  
                  {trackingResult && (
                    <div className="py-4">
                      <div className="rounded-lg border p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Package className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">Order #{trackingResult.order_id}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-muted-foreground">Order Date:</span>
                          <span>{new Date(trackingResult.order_date).toLocaleDateString()}</span>
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium">{trackingResult.status}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" onClick={resetTracking}>
                        Track Another Order
                      </Button>
                    </div>
                  )}
                  
                  {trackingError && (
                    <div className="py-4">
                      <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{trackingError}</AlertDescription>
                      </Alert>
                      <Button variant="outline" className="w-full" onClick={resetTracking}>
                        Try Again
                      </Button>
                    </div>
                  )}
                  
                  {!trackingResult && !trackingError && (
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        onClick={handleTrackOrder}
                        disabled={!trackingId || isLoading}
                      >
                        {isLoading ? "Tracking..." : "Track Order"}
                      </Button>
                    </DialogFooter>
                  )}
                </DialogContent>
              </Dialog>
            </nav>
          </div>

          {/* Right side - Theme, Cart, and User */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                    >
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-w-lg ml-auto w-full">
                <DrawerHeader>
                  <DrawerTitle>Shopping Cart</DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="absolute right-4 top-4">Close</Button>
                  </DrawerClose>
                </DrawerHeader>
                <div className="flex flex-col h-full px-4 pb-4 overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={item.picture || '/placeholder.png'}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                            <p className="font-medium mt-1">PKR {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-1 mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="px-2 min-w-[2ch] text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.quantity_in_stock || item.quantity >= item.quantityAvailable || item.quantity >= item.stock || item.quantity >= item.maxStock || item.quantity >= (item.quantityAvailable ?? item.quantity)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {cartItems.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">PKR {getCartTotal().toLocaleString()}</span>
                      </div>
                      <Button className="w-full" onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
                    </div>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.role === 'User' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/order-history">Order History</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                    </>
                  )}
                  {(user.role === 'Admin' || user.role === 'moderator') && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/order-history">Order History</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar