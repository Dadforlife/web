import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Panneau gauche : branding */}
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12 xl:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-chart-2/80" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-warm/10 blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Dad for Life"
              width={44}
              height={44}
              className="h-11 w-11 object-contain brightness-0 invert"
            />
            <span className="text-2xl font-bold tracking-tight">Dad for Life</span>
          </div>
          <div className="space-y-8 max-w-md flex-1 flex flex-col justify-center">
            <h2 className="text-2xl xl:text-3xl font-bold leading-tight tracking-tight">
              Un père accompagné, un enfant protégé
            </h2>
            <p className="text-primary-foreground/90 text-lg leading-relaxed">
              Rejoignez une communauté de pères engagés. Programme structuré,
              partenaires qualifiés et accompagnement bienveillant.
            </p>
            <blockquote className="border-l-4 border-warm pl-5 text-primary-foreground/85 italic text-lg">
              &quot;Le meilleur cadeau qu&apos;un père puisse faire à ses enfants,
              c&apos;est sa propre stabilité.&quot;
            </blockquote>
          </div>
          <div className="h-1.5 w-28 rounded-full bg-warm/90" aria-hidden />
        </div>
      </div>

      {/* Panneau droit : formulaire / contenu */}
      <div className="flex flex-col justify-center bg-background p-6 sm:p-8 lg:p-12 gradient-mesh">
        {children}
      </div>
    </div>
  );
}
