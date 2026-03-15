import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type OrderRequest = {
  amount: number;
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
  concern?: string;
  doctorId?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  fee?: number;
  serviceFee?: number;
  slotId?: string;
  slotLabel?: string;
  dateLabel?: string;
};

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return new Response(
      JSON.stringify({ error: "Razorpay keys missing" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = (await request.json()) as OrderRequest;
  const fee = Number(body.fee ?? 0);
  const serviceFee = Number(body.serviceFee ?? 99);
  const totalAmount = fee + serviceFee;
  const amount = Math.round(totalAmount * 100);

  if (!Number.isFinite(amount) || amount <= 0 || totalAmount <= 0) {
    return new Response(JSON.stringify({ error: "Invalid amount" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt: `apt_${Date.now()}`,
      notes: {
        patientName: body.patientName ?? "",
        patientPhone: body.patientPhone ?? "",
        patientEmail: body.patientEmail ?? "",
        doctorName: body.doctorName ?? "",
        doctorSpecialty: body.doctorSpecialty ?? "",
        doctorId: body.doctorId ?? "",
        slotId: body.slotId ?? "",
        slotLabel: body.slotLabel ?? "",
        dateLabel: body.dateLabel ?? "",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(JSON.stringify({ error: errorText }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = (await response.json()) as { id: string; amount: number };

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("appointments").insert({
      patient_name: body.patientName ?? "",
      patient_phone: body.patientPhone ?? "",
      patient_email: body.patientEmail ?? null,
      concern: body.concern ?? null,
      date_label: body.dateLabel ?? "",
      slot_label: body.slotLabel ?? "",
      doctor_name: body.doctorName ?? "",
      doctor_specialty: body.doctorSpecialty ?? "",
      fee,
      service_fee: serviceFee,
      total_amount: totalAmount,
      payment_status: "pending",
      razorpay_order_id: data.id,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Supabase error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      orderId: data.id,
      amount: data.amount,
      currency: "INR",
      keyId,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
