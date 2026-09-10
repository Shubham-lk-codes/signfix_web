import type { Metadata } from "next";
import { PageHero } from "@/components/page/PageHero";
import { FaqList } from "@/components/page/FaqList";

export const metadata: Metadata = {
  title: "FAQ — Sign Board Repair, LED & Signage",
  description:
    "Answers to common questions about sign board repair, LED signage, restoration, name plates and pan-India supply before you request a quote from SignFix.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ — SIGN BOARD REPAIR, LED & SIGNAGE"
        title="Useful answers for customers before they request a quote"
        lead="You do not need to know technical signage terminology before contacting SignFix. If your question isn't answered here, send us a photo and a short description and we'll take it from there."
        cta={{ label: "Ask us directly", href: "/contact" }}
      />
      <FaqList />
    </>
  );
}
