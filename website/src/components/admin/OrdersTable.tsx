"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/types";
import { formatPKR, optionsLabel } from "@/lib/format";
import { api } from "@/lib/api";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  new: "confirmed",
  confirmed: "in_production",
  in_production: "ready",
  ready: "delivered",
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" />
        {ORDER_STATUSES.map((s) => (
          <FilterChip
            key={s}
            active={filter === s}
            onClick={() => setFilter(s)}
            label={`${STATUS_LABELS[s]} (${orders.filter((o) => o.status === s).length})`}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="panel-c mt-6 p-8 text-center text-sand">No orders in this view.</p>
      ) : (
        <div className="panel-c mt-6 divide-y divide-line">
          {visible.map((o) => {
            const id = String(o._id);
            const open = expanded === id;
            const next = NEXT_STATUS[o.status];
            return (
              <div key={id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : id)}
                    className="min-w-0 text-left"
                  >
                    <p className="font-display text-[14px] font-semibold text-cream">
                      {o.number} · {o.customer.name}
                      <span className="ml-2 font-body text-[13.5px] font-normal normal-case tracking-normal text-sand">
                        {o.items.length} piece{o.items.length === 1 ? "" : "s"} · {formatPKR(o.total)} ·{" "}
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                        o.status === "new"
                          ? "bg-terra text-deep"
                          : o.status === "cancelled"
                            ? "bg-walnut-2 text-sand"
                            : "bg-ink text-cream"
                      }`}
                    >
                      {STATUS_LABELS[o.status]}
                    </span>
                    {next ? (
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch(api("/api/") + `admin/orders/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: next }),
                          });
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        → {STATUS_LABELS[next]}
                      </button>
                    ) : null}
                    <a
                      href={`https://wa.me/${o.customer.phone.replace(/\D/g, "").replace(/^0/, "92")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      title="Message the customer on WhatsApp"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>

                {open ? (
                  <div className="mt-4 rounded-card bg-walnut-2 p-4">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-sand">
                          Pieces
                        </h3>
                        <ul className="mt-2 space-y-2 text-[15px]">
                          {o.items.map((item, i) => (
                            <li key={i}>
                              {item.name}
                              {Object.keys(item.options).length ? (
                                <span className="text-sand"> — {optionsLabel(item.options)}</span>
                              ) : null}
                              <span className="text-sand"> × {item.qty}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 font-display text-[14px] font-semibold text-cream">
                          Total: {formatPKR(o.total)}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-sand">
                          Customer
                        </h3>
                        <p className="mt-2 text-[15px]">{o.customer.name}</p>
                        <p className="text-[15px]">{o.customer.phone}</p>
                        <p className="text-[15px] text-sand/85">
                          {o.customer.address}
                          {o.customer.city ? `, ${o.customer.city}` : ""}
                        </p>
                        {o.customer.note ? (
                          <p className="mt-2 text-[14.5px] italic text-sand">“{o.customer.note}”</p>
                        ) : null}
                      </div>
                    </div>

                    {o.status !== "cancelled" && o.status !== "delivered" ? (
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch(api("/api/") + `admin/orders/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "cancelled" }),
                          });
                        }}
                        className="mt-4 text-[13.5px] text-sand underline underline-offset-4 hover:text-terra"
                      >
                        Cancel order
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
        active ? "bg-ink text-cream" : "bg-walnut-2 text-sand hover:text-cream"
      }`}
    >
      {label}
    </button>
  );
}
