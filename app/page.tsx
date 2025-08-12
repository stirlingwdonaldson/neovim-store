"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Terminal, Zap, Package, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import StripeCheckout from "@/components/stripe-checkout"

export default function Component() {
  const [quantity, setQuantity] = useState(1)
  const [currentView, setCurrentView] = useState("product")
  const [cartItems, setCartItems] = useState(0)
  const [orderComplete, setOrderComplete] = useState(false)

  const product = {
    name: "NeoKeys Pro",
    description: "The ultimate mechanical keyboard for vim enthusiasts",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=600",
    specs: [
      "Cherry MX Blue switches",
      "RGB backlighting with vim colorschemes",
      "Programmable macro keys",
      "USB-C connectivity",
      "Aluminum frame construction",
    ],
  }

  const addToCart = () => {
    setCartItems(cartItems + quantity)
    setCurrentView("cart")
  }

  const handlePaymentSuccess = () => {
    setOrderComplete(true)
  }

  const StatusBar = () => (
    <div className="bg-green-500 text-black px-4 py-1 text-sm font-mono flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span>-- INSERT --</span>
        <span>neovim-store.tsx</span>
        <span>1,1</span>
      </div>
      <div className="flex items-center gap-4">
        <span>utf-8</span>
        <span>100%</span>
        <span>{cartItems} items</span>
      </div>
    </div>
  )

  const CommandLine = () => (
    <div className="bg-gray-900 border-t border-gray-700 px-4 py-2 font-mono text-sm">
      <span className="text-green-400">:</span>
      <span className="text-white ml-1">
        {currentView === "product" && "browse /store/neokeys-pro"}
        {currentView === "cart" && "cart show"}
        {currentView === "checkout" && !orderComplete && "checkout --payment-method=stripe"}
        {currentView === "checkout" && orderComplete && "order complete --status=success"}
      </span>
      <span className="animate-pulse">█</span>
    </div>
  )

  const ProductView = () => (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Terminal className="w-5 h-5" />
            <span className="font-mono text-sm">~/store/products</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
          <p className="text-gray-400 text-lg">{product.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-80 object-cover rounded"
              />
            </div>
            <div className="text-gray-500 font-mono text-sm">
              <span className="text-green-400">1</span> │ product_image.jpg
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-white">${product.price}</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    In Stock
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 font-mono text-sm block mb-2">Quantity:</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-mono text-white">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button onClick={addToCart} className="w-full bg-green-600 hover:bg-green-700 text-black font-mono">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    :add-to-cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-green-400 font-mono mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Specifications
                </h3>
                <div className="space-y-2 font-mono text-sm">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex">
                      <span className="text-gray-500 w-6">{index + 1}</span>
                      <span className="text-gray-400">│</span>
                      <span className="text-white ml-2">{spec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  const CartView = () => (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-mono text-sm">~/store/cart</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="text-white font-mono">{product.name}</h3>
                  <p className="text-gray-400 text-sm">${product.price} each</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-gray-700 border-gray-600 hover:bg-gray-600 w-8 h-8"
                    onClick={() => setCartItems(Math.max(1, cartItems - 1))}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-mono text-white text-sm">{cartItems}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-gray-700 border-gray-600 hover:bg-gray-600 w-8 h-8"
                    onClick={() => setCartItems(cartItems + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono">${(product.price * cartItems).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center text-lg font-mono">
                <span className="text-white">Total:</span>
                <span className="text-green-400">${(product.price * cartItems).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentView("product")}
            className="bg-gray-700 border-gray-600 hover:bg-gray-600 font-mono"
          >
            :back
          </Button>
          <Button
            onClick={() => setCurrentView("checkout")}
            className="bg-green-600 hover:bg-green-700 text-black font-mono flex-1"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            :checkout
          </Button>
        </div>
      </div>
    </div>
  )

  const CheckoutView = () => {
    if (orderComplete) {
      return (
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <Package className="w-5 h-5" />
                <span className="font-mono text-sm">~/store/checkout/complete</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Order Complete!</h1>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Terminal className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                  <p className="text-gray-400 font-mono mb-6">Your NeoKeys Pro is being prepared for shipment.</p>
                  <div className="bg-gray-900 rounded p-4 font-mono text-sm text-left">
                    <div className="text-green-400">$ order status</div>
                    <div className="text-white mt-2">
                      Order #NK-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                      <br />
                      Status: Processing
                      <br />
                      Estimated delivery: 3-5 business days
                      <br />
                      Payment: Completed via Stripe
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                setCurrentView("product")
                setCartItems(0)
                setOrderComplete(false)
              }}
              variant="outline"
              className="w-full mt-4 bg-gray-700 border-gray-600 hover:bg-gray-600 font-mono"
            >
              :return-to-store
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 p-6 overflow-auto">
        <StripeCheckout
          amount={product.price * cartItems}
          onSuccess={handlePaymentSuccess}
          onBack={() => setCurrentView("cart")}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col">
      {/* Tab Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-sm">NeoVim Store</span>
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === "product" && <ProductView />}
      {currentView === "cart" && <CartView />}
      {currentView === "checkout" && <CheckoutView />}

      {/* Status Bar */}
      <StatusBar />

      {/* Command Line */}
      <CommandLine />
    </div>
  )
}
