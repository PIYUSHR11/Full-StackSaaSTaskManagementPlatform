// src/lib/stripe/config.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    priceId: null,
    limits: {
      tasks: 10,
      teamMembers: 2,
      storage: 100, // MB
    },
  },
  PRO: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    limits: {
      tasks: -1, // Unlimited
      teamMembers: 10,
      storage: 1024, // 1GB
    },
  },
  ENTERPRISE: {
    name: "Enterprise",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? null,
    limits: {
      tasks: -1,
      teamMembers: -1,
      storage: 10240, // 10GB
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;