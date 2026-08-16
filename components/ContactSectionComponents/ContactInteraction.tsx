"use client";

import { useState } from "react";
import Form from "./Form";
import ThankYouDialog from "@/components/ThankYouDialog";
import { SITE_CONFIG } from "@/data/site";

export default function ContactInteraction() {
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);

  return (
    <>
      <Form onSubmitSuccess={() => setIsThankYouOpen(true)} />
      <ThankYouDialog
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
        email={SITE_CONFIG.email}
      />
    </>
  );
}
