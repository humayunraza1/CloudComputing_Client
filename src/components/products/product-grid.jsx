"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"

export function ProductGrid({ products }) {
  const { addToCart, cartItems } = useCart()

  // Helper to check if product is in cart and at max stock
  const isAtMaxStock = (product) => {
    const cartItem = cartItems.find(item => item.id === product.id)
    return cartItem && cartItem.quantity >= product.quantity
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col w-full max-w-sm relative">
          <CardHeader className="flex-none">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-2 flex-1">{product.name}</CardTitle>
              {product.variant && (
                <Badge 
                  variant="secondary" 
                  className="shrink-0"
                >
                  {product.variant}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="aspect-square relative mb-4">
              <img
                src={product.picture || '/placeholder.png'}
                alt={product.name}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 line-clamp-2 text-center">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">PKR {product.price.toLocaleString()}</span>
                <Badge variant={product.stock_status === 'in_stock' ? 'default' : 'destructive'}>
                  {product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                <Badge variant="outline">{product.category}</Badge>
                {product.subcategory && (
                  <Badge variant="outline">{product.subcategory}</Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              disabled={product.stock_status !== 'in_stock' || isAtMaxStock(product)}
              onClick={() => addToCart(product)}
            >
              {product.stock_status !== 'in_stock' ? 'Out of Stock' : isAtMaxStock(product) ? 'Max in Cart' : 'Add to Cart'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 