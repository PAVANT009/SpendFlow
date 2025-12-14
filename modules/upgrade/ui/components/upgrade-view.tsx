"use client";

import { authClient } from "@/app/lib/auth-clent";
import { PricingCard } from "./pricing-card";
import { useEffect, useState } from "react";
import { Product } from "@polar-sh/sdk/models/components/product.js";



export const UpgradeView = () => {

const [products, setProducts] = useState<Product[]>([]);
const [currentSubscription, setCurrentSubscription] = useState<any | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let cancelled = false;

  async function load() {
    try {
      const [productsRes, subRes] = await Promise.all([
        fetch("/api/upgrade/getProducts"),
        fetch("/api/upgrade/getCurrentSubscription"),
      ]);

      if (!productsRes.ok || !subRes.ok) {
        throw new Error("Failed to load premium data");
      }

      const productsData = await productsRes.json();
      const subscriptionData = await subRes.json();

      if (!cancelled) {
        setProducts(productsData);
        setCurrentSubscription(subscriptionData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  load();

  return () => {
    cancelled = true;
  };
}, []);


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
                        const isCurrentProduct = currentSubscription?.id === product.id;
                        const isPremium = !!currentSubscription;

                        let buttonText = "Upgrade";
                        let onClick = () => authClient.checkout({ products: [product.id] });

                        if (isCurrentProduct) {
                            buttonText = "Manage";
                            onClick = () => authClient.customer.portal();
                        } else if (isPremium) {
                            buttonText = "Change Plan";
                            onClick = () => authClient.customer.portal();
                        }

                        return (
                            <PricingCard 
                                key={product.id}
                                buttonText={buttonText}
                                onClick={onClick}
                                variant={
                                    product.metadata.variant === "highlighted" ? "highlighted" : "default"

                                }
                                title={product.name}
                                price={
                                    product.prices[0].amountType === "fixed" ? product.prices[0].priceAmount / 100 : 0
                                }
                                description={product.description}
                                priceSuffix={`/${product.prices[0].recurringInterval}`}
                                features={product.benefits.map(
                                    (benefit) => benefit.description
                                )}
                                badge={product.metadata.badge as string | null}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

