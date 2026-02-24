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
                alt="Dad for Life"
                width={40}
                height={40}
                className="h-10 w-10 object-contain brightness-0 invert"
              />
              <span className="text-xl font-bold tracking-tight">Dad for Life</span>
            </Link>
            <p className="text-sm text-primary-foreground/85 leading-relaxed max-w-sm">
              Association d&apos;accompagnement des p&egrave;res : stabilisation
              &eacute;motionnelle, cadre parental et orientation vers des professionnels qualifi&eacute;s.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-primary-foreground/90">
              Liens rapides
            </h3>
            <nav className="flex flex-col gap-3">
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
                <span>contact@dadforlife.fr</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-primary-foreground/15" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/65 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Dad for Life. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-end">
            <Link href="#" className="hover:text-primary-foreground transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-primary-foreground transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
