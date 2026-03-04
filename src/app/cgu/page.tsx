import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Conditions Générales d'Utilisation",
  description:
    "Conditions générales d'utilisation du site Papa pour la vie : règles d'inscription, droits et obligations des utilisateurs, modération et responsabilités.",
  path: "/cgu",
});

export default function CGUPage() {
  return (
    <main className="min-h-screen bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12">
          Conditions Générales d&apos;Utilisation
        </h1>

        <div className="prose prose-slate max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 1 - Objet
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Les présentes Conditions Générales d&apos;Utilisation (ci-après
              &laquo; CGU &raquo;) ont pour objet de définir les modalités et
              conditions d&apos;utilisation de la plateforme Papa pour la vie
              (ci-après &laquo; la Plateforme &raquo;), éditée par
              l&apos;association Papa pour la vie, association loi 1901 dont le
              siège social est situé au 30 rue de l&apos;Ouche Buron, 44300
              Nantes.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              L&apos;utilisation de la Plateforme implique l&apos;acceptation
              pleine et entière des présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 2 - Description des services
            </h2>
            <p className="text-slate-700 leading-relaxed">
              La Plateforme propose les services suivants :
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 list-disc pl-6">
              <li>Outil de diagnostic personnalisé de la situation parentale</li>
              <li>Espace communautaire d&apos;échange entre pères (forum)</li>
              <li>
                Annuaire de professionnels qualifiés (avocats, médiateurs,
                psychologues, coachs)
              </li>
              <li>Programmes d&apos;accompagnement et de formation</li>
              <li>Système de bénévolat et de parrainage</li>
              <li>Messagerie privée entre membres</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 3 - Accès et inscription
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;accès à certaines fonctionnalités de la Plateforme
              nécessite la création d&apos;un compte. L&apos;utilisateur
              s&apos;engage à fournir des informations exactes et à les
              maintenir à jour. Chaque compte est personnel et ne peut être cédé
              à un tiers.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              L&apos;utilisateur est responsable de la confidentialité de ses
              identifiants de connexion et de toutes les activités réalisées
              depuis son compte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 4 - Obligations de l&apos;utilisateur
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;utilisateur s&apos;engage à :
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 list-disc pl-6">
              <li>
                Utiliser la Plateforme de manière conforme à sa finalité et aux
                lois en vigueur
              </li>
              <li>
                Respecter les autres utilisateurs et ne pas publier de contenu
                injurieux, diffamatoire, discriminatoire, violent ou contraire à
                l&apos;ordre public
              </li>
              <li>
                Ne pas usurper l&apos;identité d&apos;un tiers ni communiquer de
                fausses informations
              </li>
              <li>
                Ne pas tenter d&apos;accéder à des données non autorisées ou de
                perturber le fonctionnement de la Plateforme
              </li>
              <li>
                Respecter la confidentialité des échanges et des informations
                partagées par les autres membres
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 5 - Modération et sanctions
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;association se réserve le droit de modérer, modifier ou
              supprimer tout contenu contraire aux présentes CGU, à la loi ou
              aux bonnes mœurs, sans préavis ni indemnité.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              En cas de manquement, l&apos;association peut suspendre ou
              supprimer le compte de l&apos;utilisateur, temporairement ou
              définitivement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 6 - Propriété intellectuelle
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;ensemble des éléments de la Plateforme (textes, images,
              graphismes, logo, programmes, base de données, etc.) est protégé
              par le droit de la propriété intellectuelle et est la propriété de
              l&apos;association Papa pour la vie, sauf mention contraire.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              Toute reproduction, représentation ou exploitation non autorisée de
              tout ou partie de ces éléments est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 7 - Données personnelles
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Les données personnelles collectées sont traitées conformément au
              Règlement Général sur la Protection des Données (RGPD) et à la loi
              Informatique et Libertés. Le responsable du traitement est
              l&apos;association Papa pour la vie.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              L&apos;utilisateur dispose d&apos;un droit d&apos;accès, de
              rectification, de suppression, de portabilité de ses données, ainsi
              que d&apos;un droit d&apos;opposition et de limitation du
              traitement. Pour exercer ces droits :{" "}
              <a
                href="mailto:contact@dadforlife.org"
                className="text-primary hover:underline"
              >
                contact@dadforlife.org
              </a>
              .
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              Pour plus d&apos;informations, consultez notre{" "}
              <Link
                href="/politique-confidentialite"
                className="text-primary hover:underline"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 8 - Limitation de responsabilité
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;association Papa pour la vie met tout en œuvre pour assurer
              la disponibilité et le bon fonctionnement de la Plateforme, mais ne
              peut garantir une accessibilité permanente. La Plateforme peut être
              interrompue pour maintenance ou mise à jour.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              Les informations, contenus et outils disponibles sur la Plateforme
              sont fournis à titre informatif et ne se substituent en aucun cas à
              un avis juridique, médical ou psychologique professionnel.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              L&apos;association ne saurait être tenue responsable des contenus
              publiés par les utilisateurs sur le forum ou dans les messages
              privés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 9 - Liens hypertextes
            </h2>
            <p className="text-slate-700 leading-relaxed">
              La Plateforme peut contenir des liens vers des sites tiers.
              L&apos;association Papa pour la vie n&apos;exerce aucun contrôle
              sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 10 - Modification des CGU
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;association se réserve le droit de modifier les présentes
              CGU à tout moment. Les utilisateurs seront informés de toute
              modification par notification sur la Plateforme ou par email.
              L&apos;utilisation continue de la Plateforme après notification
              vaut acceptation des CGU modifiées.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 11 - Droit applicable et juridiction
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Les présentes CGU sont soumises au droit français. En cas de litige
              relatif à l&apos;interprétation ou l&apos;exécution des présentes,
              les parties s&apos;efforceront de trouver une solution amiable.
              À défaut, les tribunaux de Nantes seront seuls compétents.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-slate-500">
          Dernière mise à jour : 1er mars 2026
        </p>
      </div>
    </main>
  );
}
