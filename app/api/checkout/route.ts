import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  try {
    const { price, users, storage, advancedApps, language } = await req.json()
    console.log("📝 Received request data:", { price, users, storage, advancedApps, language })

    if (!price) {
      console.error("🚨 Error: Missing price in request.")
      return NextResponse.json({ error: "Price is missing!" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!baseUrl) {
      console.error("🚨 Error: NEXT_PUBLIC_SITE_URL is not set")
      return NextResponse.json({ error: "Site URL not configured" }, { status: 500 })
    }

    console.log("🌐 Using base URL:", baseUrl)

    const sessionData = {
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: language === "bg" ? "bgn" : "eur",
            product_data: {
              name: "Nuvex Subscription",
              description: `${users} users, ${storage}GB storage${advancedApps ? ", Advanced Apps Package" : ""}`,
            },
            unit_amount: Math.round(Number(price) * 100),
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
    }

    console.log("📦 Creating Stripe session with data:", sessionData)

    const session = await stripe.checkout.sessions.create(sessionData)

    if (!session?.url) {
      console.error("🚨 Stripe session creation failed - no URL returned")
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
    }

    console.log("✅ Stripe session created successfully:", {
      id: session.id,
      url: session.url,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("🚨 Stripe error:", err)
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}

