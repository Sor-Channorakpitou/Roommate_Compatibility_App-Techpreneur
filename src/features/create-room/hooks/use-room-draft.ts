import * as React from "react"

import { DEFAULT_ROOM_DRAFT, MEMBER_LIMITS } from "../data/create-room-defaults"
import type { HouseRules, Invitee, RoomDraft } from "../types"

const STORAGE_KEY = "roomiematch:create-room-draft:v1"
const AUTOSAVE_DELAY_MS = 800

type DraftAction =
  | { type: "update"; patch: Partial<RoomDraft> }
  | { type: "updateRules"; patch: Partial<HouseRules> }
  | { type: "setMemberCount"; count: number }
  | { type: "addInvitee"; invitee: Invitee }
  | { type: "removeInvitee"; id: string }
  | { type: "addGuideline"; text: string }
  | { type: "removeGuideline"; index: number }

/** The host plus everyone invited must always fit in the household. */
export function minMemberCount(draft: RoomDraft) {
  return Math.max(MEMBER_LIMITS.min, draft.invitees.length + 1)
}

function draftReducer(draft: RoomDraft, action: DraftAction): RoomDraft {
  switch (action.type) {
    case "update":
      return { ...draft, ...action.patch }
    case "updateRules":
      return { ...draft, rules: { ...draft.rules, ...action.patch } }
    case "setMemberCount": {
      const count = Math.min(
        MEMBER_LIMITS.max,
        Math.max(minMemberCount(draft), action.count)
      )
      return { ...draft, memberCount: count }
    }
    case "addInvitee":
      return { ...draft, invitees: [...draft.invitees, action.invitee] }
    case "removeInvitee":
      return {
        ...draft,
        invitees: draft.invitees.filter((i) => i.id !== action.id),
        // Their chores fall back to the whole household.
        chores: draft.chores.map((chore) =>
          chore.assignee === action.id
            ? { ...chore, assignee: "shared" }
            : chore
        ),
      }
    case "addGuideline":
      return {
        ...draft,
        rules: {
          ...draft.rules,
          customGuidelines: [...draft.rules.customGuidelines, action.text],
        },
      }
    case "removeGuideline":
      return {
        ...draft,
        rules: {
          ...draft.rules,
          customGuidelines: draft.rules.customGuidelines.filter(
            (_, index) => index !== action.index
          ),
        },
      }
  }
}

type StoredDraft = { draft: RoomDraft; savedAt: number }

function readStoredDraft(): StoredDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredDraft>
    if (!parsed.draft || typeof parsed.savedAt !== "number") return null
    // Merge over the defaults so older drafts pick up newly added fields.
    return {
      draft: { ...DEFAULT_ROOM_DRAFT, ...parsed.draft },
      savedAt: parsed.savedAt,
    }
  } catch {
    return null
  }
}

function writeStoredDraft(draft: RoomDraft) {
  const savedAt = Date.now()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ draft, savedAt }))
  } catch {
    // Storage can be full or blocked (private mode); the in-memory draft still works.
  }
  return savedAt
}

export function useRoomDraft() {
  const [stored] = React.useState(readStoredDraft)
  const [draft, dispatch] = React.useReducer(
    draftReducer,
    stored?.draft ?? DEFAULT_ROOM_DRAFT
  )
  const [savedAt, setSavedAt] = React.useState<number | null>(
    stored?.savedAt ?? null
  )

  // Only autosave real edits, not the draft we just loaded.
  const initialDraft = React.useRef(draft)
  React.useEffect(() => {
    if (draft === initialDraft.current) return
    const timeout = window.setTimeout(
      () => setSavedAt(writeStoredDraft(draft)),
      AUTOSAVE_DELAY_MS
    )
    return () => window.clearTimeout(timeout)
  }, [draft])

  const actions = React.useMemo(
    () => ({
      update: (patch: Partial<RoomDraft>) =>
        dispatch({ type: "update", patch }),
      updateRules: (patch: Partial<HouseRules>) =>
        dispatch({ type: "updateRules", patch }),
      setMemberCount: (count: number) =>
        dispatch({ type: "setMemberCount", count }),
      addInvitee: (invitee: Invitee) =>
        dispatch({ type: "addInvitee", invitee }),
      removeInvitee: (id: string) => dispatch({ type: "removeInvitee", id }),
      addGuideline: (text: string) => dispatch({ type: "addGuideline", text }),
      removeGuideline: (index: number) =>
        dispatch({ type: "removeGuideline", index }),
    }),
    []
  )

  const saveNow = React.useCallback(() => {
    setSavedAt(writeStoredDraft(draft))
  }, [draft])

  const clearSaved = React.useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nothing to clear if storage is unavailable.
    }
  }, [])

  return { draft, savedAt, saveNow, clearSaved, ...actions }
}

export type RoomDraftActions = Omit<
  ReturnType<typeof useRoomDraft>,
  "draft" | "savedAt" | "saveNow" | "clearSaved"
>
