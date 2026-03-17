import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

type BookingRequest = {
  amount?: number;
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
  const body = (await request.json()) as BookingRequest;

  const patientName = (body.patientName ?? "").trim();
  const patientPhone = (body.patientPhone ?? "").trim();
  const slotLabel = (body.slotLabel ?? "").trim();
  const dateLabel = (body.dateLabel ?? "").trim();

  if (!patientName || !patientPhone || !slotLabel || !dateLabel) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const fee = Number(body.fee ?? 0);
  const serviceFee = Number(body.serviceFee ?? 0);
  const totalAmount = fee + serviceFee;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        patient_name: patientName,
        patient_phone: patientPhone,
        patient_email: body.patientEmail ?? null,
        concern: body.concern ?? null,
        date_label: dateLabel,
        slot_label: slotLabel,
        doctor_name: body.doctorName ?? "",
        doctor_specialty: body.doctorSpecialty ?? "",
        fee,
        service_fee: serviceFee,
        total_amount: totalAmount,
        payment_status: "confirmed",
      })
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
    const message = err instanceof Error ? err.message : "Supabase error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
