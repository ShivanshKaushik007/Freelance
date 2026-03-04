import crypto from "crypto";

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

  return new Response(
    JSON.stringify({ verified: isValid }),
    { status: isValid ? 200 : 400, headers: { "Content-Type": "application/json" } }
  );
}
