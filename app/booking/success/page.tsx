"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BookingSuccessPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && "dataLayer" in window) {
      (window as { dataLayer: Array<Record<string, unknown>> }).dataLayer.push({
        event: "appointment_success",
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-lg rounded-3xl bg-white p-8 text-center shadow">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
          बुकिंग सफल
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          आपका अपॉइंटमेंट कन्फर्म हो गया है
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          हमारी टीम 15 मिनट के भीतर आपको कॉल या ईमेल पर कन्फर्मेशन भेजेगी।
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-teal-800 px-5 py-3 text-sm font-semibold text-white"
          >
            होम पर जाएं
          </Link>
          <Link
            href="/booking"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            नया स्लॉट बुक करें
          </Link>
        </div>
      </div>
    </div>
  );
}
