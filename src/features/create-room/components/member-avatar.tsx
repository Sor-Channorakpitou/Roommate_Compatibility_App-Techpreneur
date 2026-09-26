import { cn } from "cn"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

type MemberAvatarProps = {
  name: string
  isHost?: boolean
  size?: "default" | "lg"
  className?: string
}

/** Hosts get the warm peach tone; invitees stay neutral until they join. */
export function MemberAvatar({
  name,
  isHost = false,
  size = "default",
  className,
}: MemberAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback
        className={cn(
          "font-bold",
          size === "lg" ? "text-sm" : "text-xs",
          isHost
            ? "bg-peach text-peach-foreground"
            : "bg-surface-dim text-muted-foreground"
        )}
      >
        {getInitials(name.replace(/^@/, ""))}
      </AvatarFallback>
    </Avatar>
  )
}
