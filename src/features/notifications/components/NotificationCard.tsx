"use client";

import type { NotificationItem } from "@data/notification";


export function NotificationCard({ n }: { n: NotificationItem }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Badge kiri (kategori) */}
        <div className="mt-0.5 rounded-md bg-emerald-600/10 px-2 py-0.5 text-xs font-medium text-emerald-700">
          {n.badge ?? "Info"}
        </div>

        <div className="flex-1">
          <div className="text-[15px] font-semibold text-gray-900">
            {n.title}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            {n.message}
          </p>

          {n.action ? (
            <a
              href={n.action.href}
              className="mt-2 inline-block text-sm font-medium text-sky-700 hover:underline"
            >
              {n.action.label}
            </a>
          ) : null}
        </div>

        {/* Dot waktu */}
        <div className="ml-2 shrink-0 text-xs text-gray-400">
          {new Date(n.date).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
