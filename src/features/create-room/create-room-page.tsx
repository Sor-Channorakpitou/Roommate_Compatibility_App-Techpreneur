import * as React from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Container } from "@/components/layout/container"
import { LivePreviewCard } from "./components/live-preview-card"
import { Step1RoomDetails } from "./components/step1-room-details"
import { Step2Roommates } from "./components/step2-roommates"
import { Step3HouseRules } from "./components/step3-house-rules"
import { Step4ChoresBills } from "./components/step4-chores-bills"
import { Step5Review } from "./components/step5-review"
import { StepWizardNav } from "./components/step-wizard-nav"
import { WizardHeader } from "./components/wizard-header"
import type { CreateRoomFormData } from "./types"

const INITIAL_FORM_DATA: CreateRoomFormData = {
  roomName: "Sunflower Sanctuary",
  district: "Toul Kork, Phnom Penh",
  landmark: "St 315, near TK Avenue",
  monthlyRent: 560,
  moveInDate: "11/01/2025",
  leaseEndDate: "10/31/2027",
  arrangementType: "private",
  householdMembers: 2,
  quietHours: "10:00 PM - 7:00 AM",
  acGuideline: "26°C Eco mode",
  invitedRoommates: [
    {
      id: "invite-sl",
      name: "Sereyroth L.",
      email: "sereyroth.l@univ.edu.kh",
      role: "Roommate 2",
      status: "invited",
    },
  ],
  houseRules: [
    "Quiet Hours Policy",
    "Overnight Guests Courtesy",
    "Kitchen Cleanliness Guarantee",
    "Climate & Energy Eco-Mode",
    "Front Door Lock & Key Safety",
  ],
  chores: [
    "Deep Kitchen Clean & Counter Wipe",
    "Balcony & Plant Watering Rotation",
    "Recycling & Trash Duty",
    "Common Area & Living Room Vacuum",
  ],
  billSplitMethod: "equal",
}

export function CreateRoomPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [formData, setFormData] = React.useState<CreateRoomFormData>(INITIAL_FORM_DATA)
  const [lastSaved, setLastSaved] = React.useState("Draft autosaved 2m ago")
  const [isPublishing, setIsPublishing] = React.useState(false)

  React.useEffect(() => {
    document.title = "Create Your Room — RoomieMatch Phnom Penh"
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  function handleFormChange(updates: Partial<CreateRoomFormData>) {
    setFormData((prev) => ({ ...prev, ...updates }))
    setLastSaved("Draft autosaved just now")
  }

  function handleSaveDraft() {
    try {
      localStorage.setItem("roomiematch_draft_room", JSON.stringify(formData))
    } catch {
      // ignore storage errors
    }
    setLastSaved("Draft autosaved just now")
    toast.success("Draft saved successfully!", {
      description: "You can return to finish setting up this room at any time.",
    })
  }

  function handlePublish() {
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      toast.success(`"${formData.roomName}" is now active!`, {
        description: "Welcome to your new shared home dashboard.",
      })
      navigate("/my-home")
    }, 800)
  }

  return (
    <div className="min-h-full bg-background py-8 sm:py-10">
      <Container className="space-y-8">
        {/* Wizard Header (Tag, Title, Subtitle, Autosave indicator) */}
        <WizardHeader lastSavedText={lastSaved} />

        {/* Stepper Progress bar (1 to 5) */}
        <div className="border-b border-[#e8dfd8] pb-4">
          <StepWizardNav
            currentStep={currentStep}
            onStepChange={(step) => setCurrentStep(step)}
          />
        </div>

        {/* Main Wizard Form & Live Preview Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Active Step Panel (7 cols on large screens) */}
          <div className="lg:col-span-7 xl:col-span-8">
            {currentStep === 1 && (
              <Step1RoomDetails
                formData={formData}
                onChange={handleFormChange}
                onNext={() => setCurrentStep(2)}
                onCreateRoom={handlePublish}
                onSaveDraft={handleSaveDraft}
              />
            )}

            {currentStep === 2 && (
              <Step2Roommates
                formData={formData}
                onChange={handleFormChange}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
                onSaveDraft={handleSaveDraft}
              />
            )}

            {currentStep === 3 && (
              <Step3HouseRules
                formData={formData}
                onChange={handleFormChange}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
                onSaveDraft={handleSaveDraft}
              />
            )}

            {currentStep === 4 && (
              <Step4ChoresBills
                formData={formData}
                onChange={handleFormChange}
                onNext={() => setCurrentStep(5)}
                onBack={() => setCurrentStep(3)}
                onSaveDraft={handleSaveDraft}
              />
            )}

            {currentStep === 5 && (
              <Step5Review
                formData={formData}
                onBack={() => setCurrentStep(4)}
                onPublish={handlePublish}
                isSubmitting={isPublishing}
              />
            )}
          </div>

          {/* Live Preview Panel (5 cols on large screens, sticky) */}
          <aside className="lg:sticky lg:top-24 lg:col-span-5 xl:col-span-4" aria-label="Real-time Live Preview">
            <LivePreviewCard formData={formData} />
          </aside>
        </div>
      </Container>
    </div>
  )
}

export default CreateRoomPage
