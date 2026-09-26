import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { cn } from "cn"

import { Container } from "@/components/layout/container"
import { useAuth } from "@/context/auth-context"
import {
  createRoom,
  getErrorMessage,
  isUnauthenticatedError,
} from "@/lib/rooms-api"
import { LivePreview } from "./components/live-preview"
import { ChoresBillsStep } from "./components/steps/chores-bills-step"
import { HouseRulesStep } from "./components/steps/house-rules-step"
import { ReviewStep } from "./components/steps/review-step"
import { RoomDetailsStep } from "./components/steps/room-details-step"
import { RoommatesStep } from "./components/steps/roommates-step"
import { WizardFooter } from "./components/wizard-footer"
import { WizardHeader } from "./components/wizard-header"
import { GUEST_HOST_NAME, WIZARD_STEPS } from "./data/create-room-defaults"
import { useRoomDraft } from "./hooks/use-room-draft"
import { validateRoomDraft } from "./lib/room-calculations"
import { toRoomInsert } from "./lib/to-room-insert"
import type { StepId } from "./types"

const stepIndexOf = (step: StepId) =>
  WIZARD_STEPS.findIndex(({ id }) => id === step)

export function CreateRoomPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const hostName = user?.name ?? GUEST_HOST_NAME

  const { draft, savedAt, saveNow, clearSaved, ...actions } = useRoomDraft()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [furthestIndex, setFurthestIndex] = React.useState(0)
  const [direction, setDirection] = React.useState<"forward" | "back">(
    "forward"
  )
  // Errors stay hidden until the host tries to move on or publish.
  const [showErrors, setShowErrors] = React.useState(false)
  const [isPublishing, setIsPublishing] = React.useState(false)
  const errors = showErrors ? validateRoomDraft(draft) : {}

  const activeStep = WIZARD_STEPS[stepIndex].id
  const shouldFocusStep = React.useRef(false)

  React.useEffect(() => {
    document.title = `Step ${stepIndex + 1} of ${WIZARD_STEPS.length} · Create your room | RoomieMatch`
  }, [stepIndex])

  // Move focus to the new step's heading so keyboard and screen reader users
  // land on the content that just replaced the previous step.
  React.useEffect(() => {
    if (!shouldFocusStep.current) return
    shouldFocusStep.current = false
    document
      .getElementById(`${activeStep}-heading`)
      ?.focus({ preventScroll: true })
  }, [activeStep])

  function roomDetailsAreValid() {
    const isValid = Object.keys(validateRoomDraft(draft)).length === 0
    if (!isValid) {
      setShowErrors(true)
      toast.error("Complete the highlighted room details first.")
    }
    return isValid
  }

  function showStep(index: number) {
    // Every later step builds on the room details, so they must be valid first.
    const target = index > 0 && !roomDetailsAreValid() ? 0 : index
    if (target === stepIndex) return

    setDirection(target > stepIndex ? "forward" : "back")
    setStepIndex(target)
    setFurthestIndex((furthest) => Math.max(furthest, target))
    shouldFocusStep.current = true
    window.scrollTo({ top: 0 })
  }

  function handleSaveDraft() {
    saveNow()
    toast.success("Draft saved")
  }

  async function handlePublish() {
    if (isPublishing) return
    if (!roomDetailsAreValid()) {
      showStep(0)
      return
    }
    if (!user) {
      promptSignIn()
      return
    }

    setIsPublishing(true)
    try {
      const room = await createRoom(toRoomInsert(draft))
      clearSaved()
      toast.success(`${room.name} is live!`, {
        description: "Manage it anytime from My Rooms.",
      })
      navigate("/rooms", { state: { createdRoomId: room.id } })
    } catch (error) {
      if (isUnauthenticatedError(error)) promptSignIn()
      else {
        toast.error("Couldn't publish your room", {
          description: getErrorMessage(error),
        })
      }
      setIsPublishing(false)
    }
  }

  function promptSignIn() {
    // Keep their work so signing in brings them straight back to it.
    saveNow()
    toast.error("Sign in to publish your room", {
      description: "Your draft is saved. You'll come back right here.",
      action: {
        label: "Sign in",
        onClick: () =>
          navigate("/sign-in", { state: { from: location.pathname } }),
      },
    })
  }

  const footer = (
    <WizardFooter
      nextLabel={WIZARD_STEPS[stepIndex + 1]?.cta}
      canGoBack={stepIndex > 0}
      isPublishing={isPublishing}
      onBack={() => showStep(stepIndex - 1)}
      onNext={() => showStep(stepIndex + 1)}
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
    />
  )

  function renderStep() {
    switch (activeStep) {
      case "room-details":
        return (
          <RoomDetailsStep
            footer={footer}
            draft={draft}
            errors={errors}
            update={actions.update}
            setMemberCount={actions.setMemberCount}
          />
        )
      case "roommates":
        return (
          <RoommatesStep
            footer={footer}
            draft={draft}
            hostName={hostName}
            addInvitee={actions.addInvitee}
            removeInvitee={actions.removeInvitee}
          />
        )
      case "house-rules":
        return (
          <HouseRulesStep
            footer={footer}
            draft={draft}
            updateRules={actions.updateRules}
            addGuideline={actions.addGuideline}
            removeGuideline={actions.removeGuideline}
          />
        )
      case "chores-bills":
        return (
          <ChoresBillsStep
            footer={footer}
            draft={draft}
            hostName={hostName}
            update={actions.update}
          />
        )
      case "review":
        return (
          <ReviewStep
            footer={footer}
            draft={draft}
            hostName={hostName}
            onEditStep={(step) => showStep(stepIndexOf(step))}
          />
        )
    }
  }

  return (
    <>
      <WizardHeader
        activeStep={activeStep}
        furthestIndex={furthestIndex}
        savedAt={savedAt}
        onStepSelect={(step) => showStep(stepIndexOf(step))}
      />

      <Container className="grid grid-cols-1 gap-8 py-10 xl:grid-cols-[minmax(0,1fr)_24rem]">
        {/* Re-keyed per step so each one slides in from the direction of travel. */}
        <div
          key={activeStep}
          className={cn(
            "min-w-0 animate-in duration-300 fade-in motion-reduce:animate-none",
            direction === "forward"
              ? "slide-in-from-right-6"
              : "slide-in-from-left-6"
          )}
        >
          {renderStep()}
        </div>

        <LivePreview draft={draft} hostName={hostName} />
      </Container>
    </>
  )
}
