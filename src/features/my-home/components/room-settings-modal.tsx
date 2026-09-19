import * as React from "react"
import { Settings, X } from "lucide-react"
import { toast } from "sonner"

type RoomSettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  currentName: string
  currentLocation: string
  currentLease: string
  onSave: (name: string, location: string, lease: string) => void
}

export function RoomSettingsModal({
  isOpen,
  onClose,
  currentName,
  currentLocation,
  currentLease,
  onSave,
}: RoomSettingsModalProps) {
  const [name, setName] = React.useState(currentName)
  const [location, setLocation] = React.useState(currentLocation)
  const [lease, setLease] = React.useState(currentLease)

  React.useEffect(() => {
    setName(currentName)
    setLocation(currentLocation)
    setLease(currentLease)
  }, [currentName, currentLocation, currentLease])

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(name, location, lease)
    toast.success("Household settings updated!")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#e8dfd8] bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#f0ebe5] pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#faece6] text-[#7a3418]">
              <Settings className="size-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Room Settings
              </h3>
              <p className="text-xs text-muted-foreground">Manage your shared sanctuary</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Sanctuary Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Neighborhood / Hub</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Lease Expiration</label>
            <input
              type="text"
              value={lease}
              onChange={(e) => setLease(e.target.value)}
              className="w-full rounded-xl border border-[#eee6dc] bg-[#f9f5f0] px-3.5 py-2 text-xs text-foreground focus:border-[#7a3418] focus:outline-none"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#f0ebe5] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#d6cbbe] px-4 py-1.5 text-xs font-medium text-[#4a3b34] hover:bg-[#f6efe8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#7a3418] px-5 py-1.5 text-xs font-medium text-white hover:bg-[#682c14]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
