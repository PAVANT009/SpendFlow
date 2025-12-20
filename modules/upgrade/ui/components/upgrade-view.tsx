"use client"

import { authClient } from "@/app/lib/auth-clent"
import { PricingCard } from "./pricing-card"
import { useEffect, useState } from "react"
import type { Product } from "@polar-sh/sdk/models/components/product.js"

type CurrentSubscription = {
  id: string
  name: string
} | null

export const UpgradeView = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [productsRes, subRes] = await Promise.all([
          fetch("/api/upgrade/getProducts"),
          fetch("/api/upgrade/getCurrentSubscription"),
        ])

        if (!productsRes.ok || !subRes.ok) {
          throw new Error("Failed to load premium data")
        }

        const productsData = await productsRes.json()
        const subscriptionData = await subRes.json()

        if (!cancelled) {
          setProducts(productsData)
          setCurrentSubscription(subscriptionData)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return null
  }

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-10">
      <div className="mt-4 flex-1 flex flex-col gap-y-10 items-center">
        <h5 className="font-medium text-2xl md:text-3xl">
          You are on the{" "}
          <span className="font-semibold text-primary">
            {currentSubscription?.name ?? "Free"}
          </span>{" "}
          plan
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => {
            const isCurrentProduct =
              currentSubscription?.id === product.id
            const isPremium = !!currentSubscription

            let buttonText = "Upgrade"
            let onClick = () =>
              authClient.checkout({ products: [product.id] })

            if (isCurrentProduct) {
              buttonText = "Manage"
              onClick = () => authClient.customer.portal()
            } else if (isPremium) {
              buttonText = "Change Plan"
              onClick = () => authClient.customer.portal()
            }

            const price = product.prices[0]

            const priceValue =
              price.amountType === "fixed"
                ? price.priceAmount / 100
                : 0

            const priceSuffix =
              "recurringInterval" in price
                ? `/${price.recurringInterval}`
                : undefined

              const features = product.benefits
                .map((benefit) =>
                  "description" in benefit ? benefit.description : null
                )
                .filter((desc): desc is string => desc !== null)


            return (
              <PricingCard
                key={product.id}
                buttonText={buttonText}
                onClick={onClick}
                variant={
                  product.metadata.variant === "highlighted"
                    ? "highlighted"
                    : "default"
                }
                title={product.name}
                price={priceValue}
                description={product.description}
                priceSuffix={priceSuffix}
                features={features}
                badge={product.metadata.badge as string | null}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
