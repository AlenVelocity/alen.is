"use client"

import Cal, { getCalApi } from "@calcom/embed-react"
import { useEffect } from "react"
import { PageTransition } from "@/components/ui/page-transition"
import JsonLd from "@/components/JsonLd"

export default function MeetingPage() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi()
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  const meetingSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Meeting with Alen Yohannan",
    "description": "Book a one-hour meeting with Alen Yohannan",
    "provider": {
      "@type": "Person",
      "name": "Alen Yohannan",
      "url": "https://alen.is"
    },
    "serviceType": "Consultation",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  return (
    <PageTransition>
      <JsonLd data={meetingSchema} />
      <div className="container min-h-screen py-12">
        <Cal
          namespace="1-hour-meeting"
          calLink="xlxnyx/1-hour-meeting" 
          style={{
            width: "100%",
            height: "calc(100vh - 6rem)",
            borderRadius: "0.5rem",
          }}
          config={{
            layout: "month_view",
            theme: "light",
          }}
        />
      </div>
    </PageTransition>
  )
}