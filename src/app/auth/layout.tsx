import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12 xl:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-chart-2/80" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-warm/10 blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Papa pour la vie"
              width={44}
              height={44}
              className="h-11 w-11 object-contain brightness-0 invert"
            />
            <span className="text-2xl font-bold tracking-tight">Papa pour la vie</span>
          </div>
          <div className="space-y-8 max-w-md flex-1 flex flex-col justify-center">
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight">
              Reprenez votre place de p&egrave;re avec un cadre clair
            </h2>
            <p className="text-primary-foreground/90 text-lg leading-relaxed">
              Rejoignez une communaut&eacute; de p&egrave;res engag&eacute;s :
              accompagnement structur&eacute;, partenaires qualifi&eacute;s et soutien humain.
            </p>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                Adh&eacute;sion gratuite
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                Espace confidentiel et s&eacute;curis&eacute;
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                Accompagnement personnalis&eacute;
              </div>
            </div>
          </div>
          <div className="h-1.5 w-28 rounded-full bg-warm/90" aria-hidden />
        </div>
      </div>

      <div className="relative flex flex-col justify-center bg-background p-6 sm:p-8 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="relative z-10 lg:hidden mb-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/logo.svg" alt="Papa pour la vie" width={34} height={34} className="h-8 w-8 object-contain" />
            <span className="font-bold text-lg tracking-tight">Papa pour la vie</span>
          </Link>
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
