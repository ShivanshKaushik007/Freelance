# Google Ads Setup Checklist

## Account + Billing
- Create a Google Ads account using the hospital marketing email.
- Add billing profile and payment method.
- Link the Google Ads account with the Google Analytics property (if available).

## Conversion Tracking
- Create a new conversion action: "Appointment Booking".
- Choose "Website" as the source and set the category to "Lead".
- Set the conversion value to match the average appointment fee (or "No value").
- Save and note the conversion ID and label.

## Tag Implementation (Site)
- Add GTM container ID in the site layout.
- Create a GTM trigger for the booking success page: `/booking/success`.
- Fire the Google Ads conversion tag on that trigger.

## Testing
- Use GTM preview mode to verify the tag fires on the success page.
- Use Google Ads conversion diagnostics to ensure conversion received.

## Notes
- Replace placeholder IDs in the environment variables.
- If Analytics is available, enable enhanced conversions for better attribution.
