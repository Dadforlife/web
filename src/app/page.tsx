import { Hero } from "@/components/hero";
import { SectionConstat } from "@/components/landing/section-constat";
import { SectionMission } from "@/components/landing/section-mission";
import { SectionPublic } from "@/components/landing/section-public";
import { SectionProgramme } from "@/components/landing/section-programme";
import { SectionFonctionnement } from "@/components/landing/section-fonctionnement";
import { SectionProfessionnels } from "@/components/landing/section-professionnels";
import { SectionStats } from "@/components/landing/section-stats";
import { SectionTestimonials } from "@/components/landing/section-testimonials";
import { SectionCommunaute } from "@/components/landing/section-communaute";
import { SectionCTA } from "@/components/landing/section-cta";

export default function HomePage() {
  return (
    <main role="main">
      <Hero />
      <SectionStats />
      <SectionConstat />
      <SectionMission />
      <SectionPublic />
      <SectionProgramme />
      <SectionFonctionnement />
      <SectionProfessionnels />
      <SectionTestimonials />
      <SectionCommunaute />
      <SectionCTA />
    </main>
  );
}
