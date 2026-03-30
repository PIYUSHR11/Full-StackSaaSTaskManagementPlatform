// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/config";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature")!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }
  
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const organizationId = session.metadata?.organizationId;
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  if (!organizationId) return;

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Update subscription in database
  await prisma.subscription.update({
    where: { organizationId },
    data: {
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customerId,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      plan: mapPriceIdToPlan(subscription.items.data[0].price.id),
      status: "ACTIVE",
    },
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.parent?.subscription_details?.subscription as string | undefined;

  if (!subscriptionId) return;

  // Update subscription period end
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!dbSubscription) return;

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      status: "ACTIVE",
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const organization = await prisma.organization.findFirst({
    where: {
      subscription: {
        stripeSubscriptionId: subscription.id,
      },
    },
  });

  if (!organization) return;

  await prisma.subscription.update({
    where: { organizationId: organization.id },
    data: {
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      plan: mapPriceIdToPlan(subscription.items.data[0].price.id),
      status: subscription.status === "active" ? "ACTIVE" : "PAST_DUE",
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) return;

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: "CANCELED",
      plan: "FREE",
    },
  });
}

function mapPriceIdToPlan(priceId: string): "FREE" | "PRO" | "ENTERPRISE" {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "PRO";
  if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) return "ENTERPRISE";
  return "FREE";
}