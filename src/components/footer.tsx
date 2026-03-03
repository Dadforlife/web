import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="relative bg-primary text-primary-foreground overflow-hidden">
      {/* Bande gradient en haut */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-warm via-warm/90 to-chart-2/80" />
      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* À propos */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <Image
                src="/logo.svg"
                alt="Papa pour la vie"
                width={40}
                height={40}
                className="h-10 w-10 object-contain brightness-0 invert"
              />
              <span className="text-xl font-bold tracking-tight">Papa pour la vie</span>
            </Link>
            <p className="text-sm text-primary-foreground/85 leading-relaxed max-w-sm">
              Association loi 1901 d&apos;accompagnement, de soutien et de formation des p&egrave;res dans leur r&ocirc;le parental.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-primary-foreground/90">
              Liens rapides
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="/qui-sommes-nous" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors rounded-md py-1">
                Qui sommes-nous
              </Link>
              <Link href="/devenir-benevole" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors rounded-md py-1">
                Devenir bénévole
              </Link>
              <Link href="/diagnostic" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors rounded-md py-1">
                Demander un accompagnement
              </Link>
              <Link href="/dashboard/annuaire" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors rounded-md py-1">Annuaire partenaires</Link>
              <Link href="/auth/register" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors rounded-md py-1">Adh&eacute;rer gratuitement</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-primary-foreground/90">
              Contact
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@dadforlife.org" className="hover:text-primary-foreground transition-colors">contact@dadforlife.org</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <a href="tel:+33764278987" className="hover:text-primary-foreground transition-colors">07 64 27 89 87</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span>44300 Nantes</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-primary-foreground/15" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/65 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Papa pour la vie. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-end">
            <Link href="/mentions-legales" className="hover:text-primary-foreground transition-colors">
              Mentions légales
            </Link>
            <Link href="/cgu" className="hover:text-primary-foreground transition-colors">
              CGU
            </Link>
            <Link href="/cgv" className="hover:text-primary-foreground transition-colors">
              CGV
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-primary-foreground transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
