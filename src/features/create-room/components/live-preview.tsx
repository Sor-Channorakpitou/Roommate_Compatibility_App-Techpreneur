import type * as React from "react"
import {
  DoorOpen,
  Handshake,
  MapPin,
  Moon,
  Thermometer,
  Users,
  type LucideIcon,
} from "lucide-react"

import roomPreviewImage from "@/assets/images/create-room-preview.jpg"
import { ARRANGEMENT_OPTIONS } from "../data/create-room-defaults"
import {
  acModeLabel,
  equalShareLabel,
  formatMonthYear,
  formatTime,
  formatUsd,
  rentPerPerson,
} from "../lib/room-calculations"
import type { RoomDraft } from "../types"
import { MemberAvatar } from "./member-avatar"

type LivePreviewProps = {
  draft: RoomDraft
  hostName: string
}

/** Previews the published room card so hosts see the result as they type. */
export function LivePreview({ draft, hostName }: LivePreviewProps) {
  const { rules } = draft
  const arrangement = ARRANGEMENT_OPTIONS.find(
    (option) => option.value === draft.arrangement
  )
  const leaseEnd = formatMonthYear(draft.leaseEndDate)
  const openSlots = draft.memberCount - draft.invitees.length - 1

  return (
    <aside
      aria-label="Live preview"
      className="mx-auto flex w-full max-w-md flex-col gap-4 self-start xl:sticky xl:top-24 xl:max-w-none"
    >
      <div className="flex items-center justify-between px-1">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-[0.01em] text-foreground">
          Live Preview
          <span
            aria-hidden
            className="size-2 rounded-full bg-sage-foreground"
          />
        </h2>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
          Updates in real-time
        </span>
      </div>

      <article className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lifted">
        <div className="relative h-44 bg-surface-dim">
          <img
            src={roomPreviewImage}
            alt=""
            className="size-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"
          />
          <span className="absolute top-3 right-3 rounded-full bg-sage-foreground px-2.5 text-xs leading-4 font-bold text-white shadow-card">
            Active Home
          </span>
          {draft.district && (
            <span className="absolute bottom-3 left-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.02em] text-primary backdrop-blur-[2px]">
              <MapPin aria-hidden className="size-2.5" />
              {draft.district}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-2xl leading-tight text-foreground">
              {draft.name || "Your room name"}
            </h3>
            <p className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
              <Users aria-hidden className="size-3.5 shrink-0" />
              {draft.memberCount} roommates
              {leaseEnd && ` · Lease until ${leaseEnd}`}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/30 bg-surface p-4">
            <div>
              <p className="text-[0.6875rem] font-bold tracking-[0.05em] text-subtle-foreground uppercase">
                Rent share
              </p>
              <p className="font-heading text-xl text-primary">
                {formatUsd(rentPerPerson(draft))}
                <span className="text-xs text-muted-foreground">/person</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
              <p className="text-xs text-muted-foreground">
                {formatUsd(draft.monthlyRent ?? 0)} total/mo
              </p>
              <p className="text-[0.6875rem] font-bold text-sage-foreground">
                {equalShareLabel(draft.memberCount)}
              </p>
            </div>
          </div>

          <dl className="flex flex-col gap-2 border-t border-muted pt-1.5 text-xs">
            <PreviewDetail icon={DoorOpen} label="Room type">
              {arrangement?.summary}
            </PreviewDetail>
            <PreviewDetail icon={Moon} label="Quiet hours">
              {formatTime(rules.quietHours.start)} -{" "}
              {formatTime(rules.quietHours.end)}
            </PreviewDetail>
            <PreviewDetail icon={Thermometer} label="AC guideline">
              {rules.acTemperature}°C {acModeLabel(rules.acTemperature)} mode
            </PreviewDetail>
          </dl>

          <div className="flex items-center justify-between border-t border-muted pt-3">
            <div className="flex -space-x-2">
              <MemberAvatar
                name={hostName}
                isHost
                className="ring-2 ring-card"
              />
              {draft.invitees.map((invitee) => (
                <MemberAvatar
                  key={invitee.id}
                  name={invitee.name}
                  className="ring-2 ring-card"
                />
              ))}
            </div>
            <p className="text-xs text-subtle-foreground">
              {openSlots > 0
                ? `${openSlots} of ${draft.memberCount} slots open`
                : `All ${draft.memberCount} slots occupied`}
            </p>
          </div>
        </div>

        <p className="border-t border-border/30 bg-secondary/60 px-6 pt-4 pb-3 text-center text-[0.6875rem] text-muted-foreground">
          How your room will look to roommates
        </p>
      </article>

      <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-surface p-4">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-[0.02em] text-primary">
          <Handshake aria-hidden className="size-4" />
          RoomieMatch Agreement
        </h3>
        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
          By publishing, all roommates agree to household conflict mediation and
          transparent digital receipt tracking via the RoomieMatch system.
        </p>
      </div>
    </aside>
  )
}

function PreviewDetail({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-1 text-muted-foreground">
        <Icon aria-hidden className="size-2.5" />
        {label}:
      </dt>
      <dd className="font-bold text-foreground">{children}</dd>
    </div>
  )
}
