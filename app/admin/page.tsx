"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

const supabase = getSupabaseClient();

type Appointment = {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  concern: string | null;
  date_label: string;
  slot_label: string;
  doctor_name: string;
  doctor_specialty: string;
  fee: number;
  service_fee: number;
  total_amount: number;
  payment_status: string;
  created_at: string;
};

type AuthState = {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
};

const initialAuthState: AuthState = {
  email: "",
  password: "",
  loading: false,
  error: null,
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function normalizeStatus(status: string) {
  if (status === "paid" || status === "not_required") {
    return "confirmed";
  }
  return status;
}

export default function AdminDashboardPage() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"] | null>(
    null
  );
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session ?? null);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const loadAppointments = async () => {
    if (!session?.access_token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/appointments", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error ?? "Failed to load appointments");
      }

      const payload = (await response.json()) as { data: Appointment[] };
      setAppointments(payload.data ?? []);
      setLastUpdated(new Date().toISOString());
      if (!selectedId && payload.data?.length) {
        setSelectedId(payload.data[0].id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.access_token) {
      void loadAppointments();
    }
  }, [session?.access_token]);

  const handleSignIn = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authState.email,
      password: authState.password,
    });

    setAuthState((prev) => ({
      ...prev,
      loading: false,
      error: signInError?.message ?? null,
    }));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAppointments([]);
    setSelectedId(null);
  };

  const filteredAppointments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return appointments.filter((appointment) => {
      const normalizedStatus = normalizeStatus(appointment.payment_status);
      const matchesStatus = statusFilter === "all" || normalizedStatus === statusFilter;
      if (!normalizedQuery) {
        return matchesStatus;
      }
      const searchable = [
        appointment.patient_name,
        appointment.patient_phone,
        appointment.patient_email ?? "",
        appointment.doctor_name,
        appointment.date_label,
        appointment.slot_label,
      ]
        .join(" ")
        .toLowerCase();
      return matchesStatus && searchable.includes(normalizedQuery);
    });
  }, [appointments, statusFilter, query]);

  const summary = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter(
      (item) => normalizeStatus(item.payment_status) === "confirmed"
    );
    const pending = appointments.filter(
      (item) => normalizeStatus(item.payment_status) === "pending"
    );
    const revenue = confirmed.reduce((sum, item) => sum + (item.total_amount ?? 0), 0);

    return {
      total,
      confirmed: confirmed.length,
      pending: pending.length,
      revenue,
    };
  }, [appointments]);

  const selectedAppointment = useMemo(() => {
    return appointments.find((item) => item.id === selectedId) ?? null;
  }, [appointments, selectedId]);

  if (!session) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff4d6,transparent_50%),radial-gradient(circle_at_80%_10%,#e1f7f2,transparent_45%),linear-gradient(135deg,#f8f5ef,#ffffff)] px-6 py-12">
        <div className="mx-auto max-w-xl">
          <div className="rounded-[32px] border border-amber-100 bg-white/80 p-8 shadow-[0_20px_50px_rgba(16,32,39,0.12)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-teal-700">
              Admin Console
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              Sign in to manage bookings
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Use your Supabase admin account credentials to access appointments and booking status.
            </p>

            <div className="mt-8 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Email
                <input
                  type="email"
                  value={authState.email}
                  onChange={(event) =>
                    setAuthState((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  placeholder="admin@hospital.com"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Password
                <input
                  type="password"
                  value={authState.password}
                  onChange={(event) =>
                    setAuthState((prev) => ({ ...prev, password: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  placeholder="••••••••"
                />
              </label>
            </div>

            {authState.error ? (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-2 text-xs text-rose-700">
                {authState.error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleSignIn}
              disabled={authState.loading}
              className="mt-6 w-full rounded-2xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {authState.loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff4d6,transparent_50%),radial-gradient(circle_at_80%_10%,#e1f7f2,transparent_45%),linear-gradient(135deg,#f8f5ef,#ffffff)]">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal-700">
              Admin Console
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Booking Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            {lastUpdated ? (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                Updated {formatDate(lastUpdated)}
              </span>
            ) : null}
            <button
              type="button"
              onClick={loadAppointments}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/80 p-5 shadow-[0_20px_50px_rgba(16,32,39,0.12)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                Total bookings
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.total}</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5 shadow-[0_20px_50px_rgba(16,32,39,0.12)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Total billed
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {formatCurrency(summary.revenue)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/80 p-5 shadow-[0_20px_50px_rgba(16,32,39,0.12)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Confirmed
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {summary.confirmed}
              </p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5 shadow-[0_20px_50px_rgba(16,32,39,0.12)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-700">
                Pending
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.pending}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/80 p-5 shadow-[0_20px_50px_rgba(16,32,39,0.12)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                  Booking list
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Review booking data, confirmation status, and patient details.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  <option value="all">All statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                </select>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search patient, doctor, slot..."
                  className="w-60 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                />
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-2 text-xs text-rose-700">
                {error}
              </p>
            ) : null}

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Slot</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-sm">
                        Loading bookings...
                      </td>
                    </tr>
                  ) : null}
                  {!loading && filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-sm">
                        No bookings found.
                      </td>
                    </tr>
                  ) : null}
                  {!loading
                    ? filteredAppointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          onClick={() => setSelectedId(appointment.id)}
                          className={`cursor-pointer border-t border-slate-100 transition hover:bg-teal-50/40 ${
                            appointment.id === selectedId ? "bg-teal-50/70" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">
                              {appointment.patient_name}
                            </div>
                            <div>{appointment.patient_phone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">
                              {appointment.date_label}
                            </div>
                            <div>{appointment.slot_label}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">
                              {appointment.doctor_name}
                            </div>
                            <div>{appointment.doctor_specialty}</div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {formatCurrency(appointment.total_amount)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                                normalizeStatus(appointment.payment_status) === "confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {normalizeStatus(appointment.payment_status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white/80 p-6 shadow-[0_20px_50px_rgba(16,32,39,0.12)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
              Booking details
            </p>
            {selectedAppointment ? (
              <div className="mt-4 space-y-4 text-sm text-slate-700">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Patient
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {selectedAppointment.patient_name}
                  </p>
                  <p>{selectedAppointment.patient_phone}</p>
                  {selectedAppointment.patient_email ? (
                    <p>{selectedAppointment.patient_email}</p>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Appointment
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedAppointment.date_label} • {selectedAppointment.slot_label}
                  </p>
                  <p className="text-xs text-slate-600">
                    Created {formatDate(selectedAppointment.created_at)}
                  </p>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span>Consultation fee</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(selectedAppointment.fee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Service fee</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(selectedAppointment.service_fee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-dashed pt-2">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(selectedAppointment.total_amount)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Doctor
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedAppointment.doctor_name}
                  </p>
                  <p className="text-xs text-slate-600">
                    {selectedAppointment.doctor_specialty}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </p>
                  <div className="mt-2 space-y-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <span className="font-semibold text-slate-900">
                        {normalizeStatus(selectedAppointment.payment_status)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedAppointment.concern ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Concern
                    </p>
                    <p className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                      {selectedAppointment.concern}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                Select a booking to see detailed information.
              </p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
