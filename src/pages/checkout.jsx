"use client"

import { useForm, Controller } from "react-hook-form"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [trackingId, setTrackingId] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    setError("")
    setSuccess("")
    setTrackingId("")
    try {
      const orderData = {
        name: data.name,
        address: data.address,
        phone: data.phone,
        user_id: user?.id,
        total_amount: getCartTotal(),
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      }
      const response = await axios.post("http://localhost:5000/api/orders", orderData,{withCredentials: true})
      setSuccess("Order placed successfully!")
      setTrackingId(response.data.tracking_id)
      setDialogOpen(true)
      clearCart()
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place order")
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground">Your cart is empty.</div>
          ) : (
            <ul className="divide-y">
              {cartItems.map(item => (
                <li key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <span className="font-medium">{item.name}</span> x {item.quantity}
                  </div>
                  <div>PKR {item.price.toLocaleString()}</div>
                </li>
              ))}
              <li className="flex items-center justify-between pt-4 font-bold">
                <span>Total</span>
                <span>PKR {getCartTotal().toLocaleString()}</span>
              </li>
            </ul>
          )}
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <div className="text-sm text-red-500 text-center">{error}</div>}
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <Input {...field} placeholder="Full Name" className={errors.name ? "border-red-500" : ""} />
          )}
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        <Controller
          name="address"
          control={control}
          defaultValue=""
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <Input {...field} placeholder="Address" className={errors.address ? "border-red-500" : ""} />
          )}
        />
        {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{ required: "Phone number is required" }}
          render={({ field }) => (
            <Input {...field} placeholder="Phone Number" className={errors.phone ? "border-red-500" : ""} />
          )}
        />
        {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        <Button type="submit" className="w-full" disabled={isSubmitting || cartItems.length === 0}>
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </form>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Placed Successfully!</DialogTitle>
            <DialogDescription>Your order has been placed.</DialogDescription>
          </DialogHeader>
          {trackingId && (
            <div className="bg-green-100 text-green-800 rounded p-4 my-4 text-center font-mono">
              Tracking ID: <span className="font-bold">{trackingId}</span>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} className="w-full">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 