export type Message = {
  id: string
  sender: "user" | "other"
  text: string
  time: string
  status?: "Delivered" | "Sent" | "Read"
}

export type Conversation = {
  id: string
  name: string
  initials: string
  avatarBg: string
  verified: boolean
  statusText: string
  matchScore: number
  location: string
  interestedIn: string
  moveInDate: string
  budget: string
  occupation: string
  age: number
  fullLocation: string
  keyHabits: string[]
  unread: boolean
  isRoomRequest?: boolean
  lastMessageTime: string
  lastMessageText: string
  messages: Message[]
}
