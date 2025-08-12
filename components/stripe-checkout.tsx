"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Terminal, CreditCard, Loader2, AlertTriangle } from "lucide-react"

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

const cardElementOptions = {
  style: {
    base: {
      fontSize: "18px", // increased font size for better readability
      color: "#ffffff",
      backgroundColor: "transparent",
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', monospace", // added monospace font
      lineHeight: "1.5", // improved line height
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
    complete: {
      color: "#10b981", // green color when complete
      iconColor: "#10b981",
    },
  },
  hidePostalCode: true, // hide postal code for cleaner interface
}

interface CheckoutFormProps {
  amount: number
  onSuccess: () => void
  onBack: () => void
}

function CheckoutForm({ amount, onSuccess, onBack }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setError(data.error || "Failed to initialize payment")
        }
      })
      .catch(() => setError("Failed to initialize payment"))
  }, [amount])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsLoading(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError("Card element not found")
      setIsLoading(false)
      return
    }

    const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    })

    if (paymentError) {
      setError(paymentError.message || "Payment failed")
      setIsLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-green-400 mb-2">
          <CreditCard className="w-5 h-5" />
          <span className="font-mono text-sm">~/store/checkout/payment</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Payment</h1>
        <p className="text-gray-400 font-mono">Secure payment powered by Stripe</p>
      </div>

      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-green-400 font-mono mb-4">Order Summary</h3>
            <div className="bg-gray-900 rounded p-4 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white">NeoKeys Pro × 1</span>
                <span className="text-green-400">${amount.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between items-center">
                <span className="text-white font-bold">Total:</span>
                <span className="text-green-400 font-bold">${amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-400 font-mono text-sm block mb-3">
                {" "}
                {/* increased margin bottom */}
                Card Details:
              </label>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                {" "}
                {/* increased padding and added hover effect */}
                <CardElement options={cardElementOptions} />
              </div>
              <div className="mt-2 text-xs text-gray-500 font-mono">
                {" "}
                {/* added helpful text */}
                Enter your card number, expiry date, and CVC
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <div className="text-red-400 font-mono text-sm">
                  <Terminal className="w-4 h-4 inline mr-2" />
                  Error: {error}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="bg-gray-700 border-gray-600 hover:bg-gray-600 font-mono"
                disabled={isLoading}
              >
                :back
              </Button>
              <Button
                type="submit"
                disabled={!stripe || isLoading || !clientSecret}
                className="bg-green-600 hover:bg-green-700 text-black font-mono flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    :processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    :pay ${amount.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-gray-900 rounded p-4 font-mono text-xs text-gray-500">
        <Terminal className="w-4 h-4 inline mr-2" />
        Payments are processed securely by Stripe. Your card information is never stored on our servers.
      </div>
    </div>
  )
}

interface StripeCheckoutProps {
  amount: number
  onSuccess: () => void
  onBack: () => void
}

export default function StripeCheckout({ amount, onSuccess, onBack }: StripeCheckoutProps) {
  if (!stripePromise) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-mono text-sm">~/store/checkout/error</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Configuration Error</h1>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Stripe Not Configured</h3>
              <p className="text-gray-400 font-mono mb-6">
                Payment processing is not available. Please configure Stripe environment variables.
              </p>
              <div className="bg-gray-900 rounded p-4 font-mono text-sm text-left">
                <div className="text-red-400">$ env check</div>
                <div className="text-white mt-2">
                  Missing: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                  <br />
                  Missing: STRIPE_SECRET_KEY
                  <br />
                  <br />
                  Please add these environment variables in Project Settings.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full mt-4 bg-gray-700 border-gray-600 hover:bg-gray-600 font-mono"
        >
          :back-to-cart
        </Button>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onBack={onBack} />
    </Elements>
  )
}
