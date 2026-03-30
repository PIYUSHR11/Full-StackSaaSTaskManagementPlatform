// src/app/api/stripe/create-checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { requireAuth } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const { priceId, successUrl, cancelUrl } = await req.json();
    
    // Get or create Stripe customer
    const organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      include: { subscription: true },
    });
    
    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }
    
    let customerId = organization.subscription?.stripeCustomerId;
    
    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: organization.name,
        metadata: {
          organizationId: organization.id,
        },
      });
      
      customerId = customer.id;
      
      // Update organization with Stripe customer ID
      await prisma.subscription.upsert({
        where: { organizationId: organization.id },
        update: { stripeCustomerId: customerId },
        create: {
          organizationId: organization.id,
          stripeCustomerId: customerId,
          plan: "FREE",
        },
      });
    }
    
    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        organizationId: organization.id,
      },
      subscription_data: {
        metadata: {
          organizationId: organization.id,
        },
      },
    });
    
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}