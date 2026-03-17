"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slot = {
  id: string;
  label: string;
};

const doctorInfo = {
  id: "doc-1",
  name: "डॉ. रवि एस० त्रिपाठी",
  specialty: "बाल रोग विशेषज्ञ",
};

const opdFee = 200;
const emergencyFee = 500;
const serviceFee = 0;

type ServiceType = "opd" | "emergency";

const slots: Slot[] = Array.from({ length: 20 }, (_, index) => {
  const startMinutes = 10 * 60 + index * 30;
  const endMinutes = startMinutes + 30;
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const displayHours = hours.toString().padStart(2, "0");
    const displayMinutes = mins.toString().padStart(2, "0");
    return `${displayHours}:${displayMinutes}`;
  };
  const startLabel = formatTime(startMinutes);
  const endLabel = formatTime(endMinutes);
  return {
    id: `slot-${index + 1}`,
    label: `${startLabel} - ${endLabel}`,
  };
});

const defaultDate = new Date().toISOString().split("T")[0];

type PatientForm = {
  name: string;
  phone: string;
  email: string;
  concern: string;
};

const initialForm: PatientForm = {
  name: "",
  phone: "",
  email: "",
  concern: "",
};

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>("opd");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payableAmount = useMemo(() => {
    const base = serviceType === "emergency" ? emergencyFee : opdFee;
    return base + serviceFee;
  }, [serviceType]);

  const canProceed =
    Boolean(selectedDate) &&
    Boolean(selectedSlot) &&
    form.name.trim() &&
    form.phone.trim();

  const handleInputChange = (field: keyof PatientForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitBooking = async () => {
    setError(null);
    if (!canProceed || !selectedSlot) {
      setError("कृपया सभी आवश्यक जानकारी भरें।");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payableAmount,
          patientName: form.name,
          patientPhone: form.phone,
          patientEmail: form.email,
          concern: form.concern,
          doctorId: doctorInfo.id,
          doctorName: doctorInfo.name,
          doctorSpecialty: doctorInfo.specialty,
          fee: serviceType === "emergency" ? emergencyFee : opdFee,
          serviceFee,
          slotId: selectedSlot.id,
          slotLabel: selectedSlot.label,
          dateLabel: selectedDate,
        }),
      });

      if (!response.ok) {
        throw new Error("अपॉइंटमेंट सेव नहीं हुआ।");
      }
      window.location.href = "/booking/success";
    } catch (err) {
      const message = err instanceof Error ? err.message : "अज्ञात त्रुटि";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white shadow">
              <Image
                src="/logo.png"
                alt="Ayushman Well Baby Hospital"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-teal-900">
                Ayushman Well Baby Hospital
              </p>
              <p className="text-xs text-slate-500">Care That Never Quits</p>
            </div>
          </div>
          <Link href="/" className="text-sm font-semibold text-teal-800">
            होम पर जाएं
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900">
              1. दिन और स्लॉट चुनें
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-slate-600">
                तारीख
                <input
                  type="date"
                  value={selectedDate}
                  min={defaultDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                />
              </label>
              <label className="text-sm text-slate-600">
                समय स्लॉट
                <select
                  value={selectedSlot?.id ?? ""}
                  onChange={(event) => {
                    const slot = slots.find((item) => item.id === event.target.value);
                    setSelectedSlot(slot ?? null);
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                >
                  <option value="" disabled>
                    स्लॉट चुनें
                  </option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900">
              2. सेवा चुनें
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <button
                type="button"
                onClick={() => setServiceType("opd")}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  serviceType === "opd"
                    ? "border-teal-700 bg-teal-50"
                    : "border-slate-200"
                }`}
              >
                <span className="font-semibold text-slate-900">OPD शुल्क</span>
                <span className="font-semibold text-slate-900">₹{opdFee}</span>
              </button>
              <button
                type="button"
                onClick={() => setServiceType("emergency")}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  serviceType === "emergency"
                    ? "border-teal-700 bg-teal-50"
                    : "border-slate-200"
                }`}
              >
                <span className="font-semibold text-slate-900">
                  इमरजेंसी शुल्क
                </span>
                <span className="font-semibold text-slate-900">
                  ₹{emergencyFee}
                </span>
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900">
              3. मरीज विवरण
            </h2>
            <div className="mt-4 grid gap-4">
              <input
                value={form.name}
                onChange={(event) => handleInputChange("name", event.target.value)}
                placeholder="पूरा नाम"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <input
                value={form.phone}
                onChange={(event) => handleInputChange("phone", event.target.value)}
                placeholder="मोबाइल नंबर"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <input
                value={form.email}
                onChange={(event) => handleInputChange("email", event.target.value)}
                placeholder="ईमेल (वैकल्पिक)"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <textarea
                value={form.concern}
                onChange={(event) =>
                  handleInputChange("concern", event.target.value)
                }
                placeholder="आपकी समस्या / लक्षण"
                className="min-h-[110px] rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="flex items-center gap-3 rounded-3xl bg-white p-5 shadow">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white shadow">
              <Image
                src="/logo.png"
                alt="Ayushman Well Baby Hospital"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Ayushman Well Baby Hospital
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-teal-700">
                Care That Never Quits
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow">
            <h3 className="text-base font-semibold text-slate-900">
              4. समीक्षा और पुष्टि
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>दिन</span>
                <span className="font-semibold text-slate-900">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>स्लॉट</span>
                <span className="font-semibold text-slate-900">
                  {selectedSlot?.label ?? "चयनित नहीं"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>डॉक्टर</span>
                <span className="font-semibold text-slate-900">
                  {doctorInfo.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>चयनित सेवा</span>
                <span className="font-semibold text-slate-900">
                  {serviceType === "emergency" ? "इमरजेंसी" : "OPD"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>सेवा शुल्क</span>
                <span className="font-semibold text-slate-900">
                  ₹{serviceType === "emergency" ? emergencyFee : opdFee}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed pt-3">
                <span className="font-semibold text-slate-900">कुल राशि</span>
                <span className="text-lg font-semibold text-teal-800">
                  ₹{payableAmount}
                </span>
              </div>
            </div>
            {error && (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}
            <button
              onClick={submitBooking}
              disabled={!canProceed || loading}
              className="mt-5 w-full rounded-2xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "बुकिंग सेव हो रही है..." : "बुकिंग कन्फर्म करें"}
            </button>
            <p className="mt-3 text-xs text-slate-500">
              आपकी जानकारी सुरक्षित रहती है और टीम जल्द पुष्टि भेजेगी।
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-sm text-slate-600 shadow">
            <p className="font-semibold text-slate-900">क्या चाहिए?</p>
            <ul className="mt-3 space-y-2">
              <li>सरकारी पहचान पत्र</li>
              <li>पूर्व रिपोर्ट या प्रिस्क्रिप्शन</li>
              <li>परिवारिक मेडिकल इतिहास</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
