import * as React from "react"
import { Compass, Home } from "lucide-react"

import { LinkButton, StatePanel } from "@/components/common/state-panel"
import { Container } from "@/components/layout/container"

export function NotFoundPage() {
  React.useEffect(() => {
    document.title = "Page not found | RoomieMatch"
  }, [])

  return (
    <Container className="py-16">
      <StatePanel
        icon={Compass}
        title="This page doesn't exist yet"
        description="The link may be out of date. Head back home or browse roommates."
        action={
          <LinkButton to="/">
            <Home />
            Back to home
          </LinkButton>
        }
      />
    </Container>
  )
}
