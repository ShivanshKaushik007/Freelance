export const runtime = "nodejs";

type OrderRequest = {
  amount: number;
  patientName?: string;
  patientPhone?: string;
  doctorId?: string;
  slotId?: string;
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
  const amount = Math.round(Number(body.amount) * 100);

  if (!Number.isFinite(amount) || amount <= 0) {
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
        doctorId: body.doctorId ?? "",
        slotId: body.slotId ?? "",
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
