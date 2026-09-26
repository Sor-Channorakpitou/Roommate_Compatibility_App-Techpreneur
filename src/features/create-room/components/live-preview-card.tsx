import { FileText, MapPin, Moon, Shield, Snowflake, Users } from "lucide-react"
import roomPreviewImg from "@/assets/images/room-preview.jpg"
import type { CreateRoomFormData } from "../types"

type LivePreviewCardProps = {
  formData: CreateRoomFormData
}

function formatLeaseEnd(dateStr: string): string {
  if (!dateStr) return "Oct 2027"
  try {
    const parts = dateStr.includes("/") ? dateStr.split("/") : dateStr.split("-")
    if (parts.length === 3) {
      // MM/DD/YYYY
      if (dateStr.includes("/")) {
        const monthNum = parseInt(parts[0], 10)
        const year = parts[2]
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        if (monthNum >= 1 && monthNum <= 12) {
          return `${months[monthNum - 1]} ${year}`
        }
      }
    }
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    }
  } catch {
    // fallback
  }
  return dateStr
}

export function LivePreviewCard({ formData }: LivePreviewCardProps) {
  const members = Math.max(1, formData.householdMembers)
  const rentPerPerson = Math.round(formData.monthlyRent / members)
  const splitPercent = Math.round(100 / members)
  const leaseFormatted = formatLeaseEnd(formData.leaseEndDate)

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#1c1c18]">Live Preview</span>
          <span className="size-2 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
        </div>
        <span className="rounded-full border border-[#e4dbd1] bg-[#fbf9f6] px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          Updates in real-time
        </span>
      </div>

      {/* Preview Card */}
      <div className="overflow-hidden rounded-2xl border border-[#e8dfd8] bg-white shadow-xs">
        {/* Apartment Hero Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e8dfd8]">
          <img
            src={roomPreviewImg}
            alt={formData.roomName || "Sunflower Sanctuary"}
            className="h-full w-full object-cover object-center"
          />

          {/* Active Home Badge */}
          <span className="absolute top-3 right-3 rounded-full bg-[#1b3d1f]/85 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-200 backdrop-blur-xs shadow-2xs">
            Active Home
          </span>

          {/* Location Chip */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#1c1c18] backdrop-blur-md shadow-2xs">
            <MapPin className="size-3 text-[#7a3418]" />
            <span className="truncate max-w-[200px]">{formData.district || "Toul Kork, Phnom Penh"}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Room Name */}
          <h3 className="font-serif text-2xl font-semibold tracking-tight text-[#1c1c18]">
            {formData.roomName || "Sunflower Sanctuary"}
          </h3>

          {/* Meta line */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5 text-muted-foreground/80" />
            <span>
              {members} {members === 1 ? "roommate" : "roommates"} · Lease until {leaseFormatted}
            </span>
          </div>

          {/* Rent Share Box */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-[#ede2d6] bg-[#f6efe7] p-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Rent Share
              </span>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-[#7a3418]">
                  ${rentPerPerson}
                </span>
                <span className="text-xs text-muted-foreground">/person</span>
              </div>
            </div>

            <div className="text-right">
              <span className="block text-xs font-semibold text-[#1c1c18]">
                ${formData.monthlyRent} total/mo
              </span>
              <span className="mt-0.5 inline-block rounded bg-[#d7ecd8] px-2 py-0.5 text-[10px] font-semibold text-[#276e33]">
                Equal {splitPercent}% split
              </span>
            </div>
          </div>

          {/* Details list */}
          <div className="mt-4 space-y-2.5 border-t border-[#f2ebe4] pt-3 text-xs">
            <div className="flex items-center justify-between text-[#55433c]">
              <span className="flex items-center gap-2 text-muted-foreground">
                <FileText className="size-3.5 text-[#7a3418]" />
                Room type:
              </span>
              <span className="font-semibold text-[#1c1c18]">
                {formData.arrangementType === "private" ? "Private rooms" : "Shared room"}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#55433c]">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Moon className="size-3.5 text-[#7a3418]" />
                Quiet hours:
              </span>
              <span className="font-semibold text-[#1c1c18]">
                {formData.quietHours || "10:00 PM - 7:00 AM"}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#55433c]">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Snowflake className="size-3.5 text-[#7a3418]" />
                AC guideline:
              </span>
              <span className="font-semibold text-[#1c1c18]">
                {formData.acGuideline || "26°C Eco mode"}
              </span>
            </div>
          </div>

          {/* Avatars row */}
          <div className="mt-4 flex items-center justify-between border-t border-[#f2ebe4] pt-3.5">
            <div className="flex items-center -space-x-2">
              <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#f8dfd4] text-[11px] font-bold text-[#8c3b19] shadow-2xs">
                MH
              </div>
              <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#d9edd9] text-[11px] font-bold text-[#2b7235] shadow-2xs">
                SL
              </div>
              {members > 2 && (
                <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#f0ebe3] text-[10px] font-bold text-muted-foreground shadow-2xs">
                  +{members - 2}
                </div>
              )}
            </div>

            <span className="text-xs text-muted-foreground">
              All {members} slots occupied
            </span>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="border-t border-[#e8dfd8] bg-[#f7f2ea] py-2.5 text-center text-[11px] font-medium text-[#7c6a61]">
          Replicating My Home dashboard preview
        </div>
      </div>

      {/* RoomieMatch Agreement Box */}
      <div className="rounded-2xl border border-[#ebdccf] bg-[#faf6f0] p-4 text-xs">
        <div className="mb-1.5 flex items-center gap-1.5 font-bold text-[#7a3418]">
          <Shield className="size-3.5 text-[#7a3418]" />
          <span>RoomieMatch Agreement</span>
        </div>
        <p className="leading-relaxed text-[#6e584f]">
          By publishing, all roommates agree to household conflict mediation and transparent digital receipt tracking via the RoomieMatch system.
        </p>
      </div>
    </div>
  )
}
