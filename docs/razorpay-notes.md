# Razorpay Notes

## Required Environment Variables
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM`

## Flow Summary
1. Frontend calls `/api/razorpay/order` with amount and appointment notes.
2. Server creates Razorpay order and returns `orderId` + `keyId`.
3. Razorpay checkout completes and redirects to `/booking/success`.
4. (Recommended) Call `/api/razorpay/verify` with order + payment details.
5. Webhook `/api/razorpay/webhook` captures payment confirmation and sends email.

## Recommended Next Steps
- Store appointments + payment status in Supabase.
- Use Razorpay webhooks for robust payment confirmation.
- Send confirmation email after verification.
