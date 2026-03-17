# AarogyaDeep Hospital Website

Hindi-first hospital website with appointment booking and confirmation flow.

## Quick Start
```bash
npm install
npm run dev
```

## Pages
- `/` Hospital landing page (Hindi)
- `/booking` Slot selection, doctor selection, patient details, confirmation
- `/booking/success` Booking confirmation

## Environment Variables
Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM="Ayushman Well Baby Hospital <no-reply@yourdomain.com>"
```

## Google Ads
- Setup checklist in [docs/google-ads.md](docs/google-ads.md)

## Assets
Replace placeholder visuals with client-provided assets in `public/`.
