export type RoomArrangement = "private" | "shared"

export type CreateRoomFormData = {
  roomName: string
  district: string
  landmark: string
  monthlyRent: number
  moveInDate: string
  leaseEndDate: string
  arrangementType: RoomArrangement
  householdMembers: number
  quietHours: string
  acGuideline: string
  invitedRoommates: Array<{
    id: string
    name: string
    email: string
    role: string
    status: "active" | "invited" | "pending"
  }>
  houseRules: string[]
  chores: string[]
  billSplitMethod: "equal" | "custom"
}

export type WizardStep = {
  step: number
  title: string
  shortTitle: string
}
