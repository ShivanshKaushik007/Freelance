# AarogyaDeep Hospital Website

Hindi-first hospital website with appointment booking and Razorpay payment flow.

## Quick Start
```bash
npm install
npm run dev
```

## Pages
- `/` Hospital landing page (Hindi)
- `/booking` Slot selection, doctor selection, patient details, payment
- `/booking/success` Payment success confirmation

## Environment Variables
Create a `.env.local` file in the project root:
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM="Ayushman Well Baby Hospital <no-reply@yourdomain.com>"
```

## Razorpay
- Order creation API: `POST /api/razorpay/order`
- Verification API: `POST /api/razorpay/verify`
- Webhook API: `POST /api/razorpay/webhook`
- Notes in [docs/razorpay-notes.md](docs/razorpay-notes.md)

## Google Ads
- Setup checklist in [docs/google-ads.md](docs/google-ads.md)

## Assets
Replace placeholder visuals with client-provided assets in `public/`.
