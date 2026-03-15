"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  fee: number;
};

type Slot = {
  id: string;
  label: string;
};

const doctors: Doctor[] = [
  { id: "doc-1", name: "डॉ. अनन्या वर्मा", specialty: "कार्डियोलॉजी", fee: 1200 },
  { id: "doc-2", name: "डॉ. राघव सैनी", specialty: "ऑन्कोलॉजी", fee: 1500 },
  { id: "doc-3", name: "डॉ. सारा क़ुरैशी", specialty: "स्त्री रोग", fee: 900 },
  { id: "doc-4", name: "डॉ. विवेक देशपांडे", specialty: "न्यूरोलॉजी", fee: 1300 },
];

const slots: Slot[] = [
  { id: "slot-1", label: "सुबह 9:00 - 9:30" },
  { id: "slot-2", label: "सुबह 10:00 - 10:30" },
  { id: "slot-3", label: "दोपहर 12:00 - 12:30" },
  { id: "slot-4", label: "शाम 5:00 - 5:30" },
  { id: "slot-5", label: "शाम 6:00 - 6:30" },
];

const dates = ["आज", "कल", "आगामी शनिवार", "आगामी सोमवार"];

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

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payableAmount = useMemo(() => {
    const base = selectedDoctor?.fee ?? 0;
    return base > 0 ? base + 99 : 0;
  }, [selectedDoctor]);

  const canProceed =
    Boolean(selectedDate) &&
    Boolean(selectedSlot) &&
    Boolean(selectedDoctor) &&
    form.name.trim() &&
    form.phone.trim();

  const handleInputChange = (field: keyof PatientForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const startPayment = async () => {
    setError(null);
    if (!canProceed || !selectedDoctor || !selectedSlot) {
      setError("कृपया सभी आवश्यक जानकारी भरें।");
      return;
    }

    setLoading(true);
    const scriptReady = await loadRazorpay();
    if (!scriptReady) {
      setError("भुगतान स्क्रिप्ट लोड नहीं हुई। कृपया फिर प्रयास करें।");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payableAmount,
          patientName: form.name,
          patientPhone: form.phone,
          patientEmail: form.email,
          concern: form.concern,
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          doctorSpecialty: selectedDoctor.specialty,
          fee: selectedDoctor.fee,
          serviceFee: 99,
          slotId: selectedSlot.id,
          slotLabel: selectedSlot.label,
          dateLabel: selectedDate,
        }),
      });

      if (!response.ok) {
        throw new Error("ऑर्डर बनाने में समस्या हुई।");
      }

      const data = await response.json();

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Ayushman Well Baby Hospital",
        description: "अपॉइंटमेंट शुल्क",
        order_id: data.orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          doctor: selectedDoctor.name,
          slot: selectedSlot.label,
          date: selectedDate,
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setLoading(true);
          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("भुगतान सत्यापन विफल रहा।");
            }

            window.location.href = "/booking/success";
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "सत्यापन में समस्या";
            setError(message);
          } finally {
            setLoading(false);
          }
        },
        theme: {
          color: "#0e7c7b",
        },
      };

      const razorpay = new (window as unknown as { Razorpay: any }).Razorpay(
        options
      );
      razorpay.open();
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
          <div>
            <p className="text-lg font-semibold text-teal-900">
              Ayushman Well Baby Hospital
            </p>
            <p className="text-xs text-slate-500">Care That Never Quits</p>
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
            <div className="mt-4 flex flex-wrap gap-3">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedDate === date
                      ? "bg-teal-800 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    selectedSlot?.id === slot.id
                      ? "border-teal-700 bg-teal-50"
                      : "border-slate-200"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-900">
              2. डॉक्टर चुनें
            </h2>
            <div className="mt-4 grid gap-3">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    selectedDoctor?.id === doctor.id
                      ? "border-teal-700 bg-teal-50"
                      : "border-slate-200"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{doctor.name}</p>
                    <p className="text-xs text-slate-500">{doctor.specialty}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    ₹{doctor.fee}
                  </p>
                </button>
              ))}
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
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white shadow">
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
              4. समीक्षा और भुगतान
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
                  {selectedDoctor?.name ?? "चयनित नहीं"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>कंसल्टेशन शुल्क</span>
                <span className="font-semibold text-slate-900">
                  ₹{selectedDoctor?.fee ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>सेवा शुल्क</span>
                <span className="font-semibold text-slate-900">₹99</span>
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
              onClick={startPayment}
              disabled={!canProceed || loading}
              className="mt-5 w-full rounded-2xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "भुगतान जारी है..." : "Razorpay से भुगतान करें"}
            </button>
            <p className="mt-3 text-xs text-slate-500">
              भुगतान सुरक्षित है और आपकी जानकारी एन्क्रिप्टेड रहती है।
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
