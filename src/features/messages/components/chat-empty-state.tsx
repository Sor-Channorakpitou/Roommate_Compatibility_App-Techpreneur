import { MessageSquare } from "lucide-react"

export function ChatEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MessageSquare className="size-8" />
      </div>
      <h2 className="mt-4 font-heading text-lg font-bold text-foreground">
        Your Messages
      </h2>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
        Select a conversation from the inbox on the left to start chatting with potential roommates.
      </p>
    </div>
  )
}
