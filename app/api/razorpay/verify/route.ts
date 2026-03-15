import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

type VerifyRequest = {
  orderId: string;
  paymentId: string;
  signature: string;
};

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return new Response(
      JSON.stringify({ error: "Razorpay secret missing" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = (await request.json()) as VerifyRequest;
  const payload = `${body.orderId}|${body.paymentId}`;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  const isValid = expected === body.signature;

  if (!isValid) {
    return new Response(JSON.stringify({ verified: false }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("appointments")
      .update({
        payment_status: "paid",
        razorpay_payment_id: body.paymentId,
        razorpay_signature: body.signature,
      })
      .eq("razorpay_order_id", body.orderId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const appointment = Array.isArray(data) ? data[0] : null;
    if (appointment?.patient_email) {
      await sendEmail({
        to: appointment.patient_email,
        subject: "अपॉइंटमेंट कन्फर्मेशन | Ayushman Well Baby Hospital",
        html: `
          <div style="font-family:Arial,sans-serif;">
            <h2>आपका अपॉइंटमेंट कन्फर्म हो गया है</h2>
            <p>प्रिय ${appointment.patient_name},</p>
            <p>आपका अपॉइंटमेंट ${appointment.date_label} को ${appointment.slot_label} के लिए बुक हो गया है।</p>
            <p>डॉक्टर: ${appointment.doctor_name}</p>
            <p>धन्यवाद,<br/>Ayushman Well Baby Hospital</p>
          </div>
        `,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Supabase error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ verified: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
