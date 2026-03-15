import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

function verifySignature(body: string, signature: string) {
  if (!webhookSecret) {
    throw new Error("Webhook secret missing");
  }

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  return expected === signature;
}

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature");
  const rawBody = await request.text();

  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    if (!verifySignature(rawBody, signature)) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = JSON.parse(rawBody) as {
    event: string;
    payload: {
      payment: {
        entity: {
          id: string;
          order_id: string;
          status: string;
        };
      };
    };
  };

  if (payload.event !== "payment.captured") {
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payment = payload.payload.payment.entity;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("appointments")
      .update({
        payment_status: "paid",
        razorpay_payment_id: payment.id,
      })
      .eq("razorpay_order_id", payment.order_id)
      .select()
      .maybeSingle();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (data?.patient_email) {
      await sendEmail({
        to: data.patient_email,
        subject: "अपॉइंटमेंट कन्फर्मेशन | Ayushman Well Baby Hospital",
        html: `
          <div style="font-family:Arial,sans-serif;">
            <h2>आपका अपॉइंटमेंट कन्फर्म हो गया है</h2>
            <p>प्रिय ${data.patient_name},</p>
            <p>आपका अपॉइंटमेंट ${data.date_label} को ${data.slot_label} के लिए बुक हो गया है।</p>
            <p>डॉक्टर: ${data.doctor_name}</p>
            <p>धन्यवाद,<br/>Ayushman Well Baby Hospital</p>
          </div>
        `,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
