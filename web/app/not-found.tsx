"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center">
        {/* 404 Illustration */}
        <div className="relative">
          <h1 className="select-none text-[120px] font-black leading-none tracking-tight text-emerald-100 md:text-[180px]">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50">
                <span className="text-3xl font-black text-emerald-700">
                  TS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="-mt-2 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Oops! Page not found
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            The page you are trying to access does not exist or may have been
            moved. Continue exploring Thermosnoop from the dashboard.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}