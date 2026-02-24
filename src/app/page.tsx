import { Hero } from "@/components/hero";
import { SectionConstat } from "@/components/landing/section-constat";
import { SectionMission } from "@/components/landing/section-mission";
import { SectionProgramme } from "@/components/landing/section-programme";
import { SectionFonctionnement } from "@/components/landing/section-fonctionnement";
import { SectionProfessionnels } from "@/components/landing/section-professionnels";
import { SectionCTA } from "@/components/landing/section-cta";

export default function HomePage() {
  return (
    <main role="main">
      <Hero />
      <SectionConstat />
      <SectionMission />
      <SectionProgramme />
      <SectionFonctionnement />
      <SectionProfessionnels />
      <SectionCTA />
    </main>
  );
}
