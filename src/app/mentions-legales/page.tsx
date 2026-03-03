import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales - Papa pour la vie",
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12">
          Mentions légales
        </h1>

        <div className="prose prose-slate max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              1. Éditeur du site
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Le présent site est édité par l&apos;association{" "}
              <strong>Papa pour la vie</strong>, association régie par la loi du
              1er juillet 1901 et le décret du 16 août 1901.
            </p>
            <ul className="mt-4 space-y-2 text-slate-700">
              <li>
                <strong>Siège social :</strong> 30 rue de l&apos;Ouche Buron,
                44300 Nantes
              </li>
              <li>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:contact@dadforlife.org"
                  className="text-primary hover:underline"
                >
                  contact@dadforlife.org
                </a>
              </li>
              <li>
                <strong>Directeur de la publication :</strong> Munsense
                Tshibangu, Président de l&apos;association
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              2. Objet de l&apos;association
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;association a pour objet l&apos;accompagnement, le soutien
              et la formation des pères dans leur rôle parental, la promotion
              d&apos;une paternité responsable, engagée et stable, la prévention
              des conflits parentaux et la protection de l&apos;intérêt supérieur
              de l&apos;enfant, ainsi que le développement d&apos;outils
              numériques et de programmes d&apos;accompagnement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              3. Hébergement
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Le site est hébergé par Vercel Inc., 440 N Baxter St, Coppell, TX
              75019, États-Unis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              4. Propriété intellectuelle
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;ensemble du contenu de ce site (textes, images, graphismes,
              logo, icônes, etc.) est la propriété exclusive de l&apos;association
              Papa pour la vie ou de ses partenaires. Toute reproduction,
              représentation, modification, publication ou adaptation de tout ou
              partie des éléments du site est interdite sans autorisation écrite
              préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              5. Protection des données personnelles
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi Informatique et Libertés, vous disposez
              d&apos;un droit d&apos;accès, de rectification, de suppression et
              de portabilité de vos données, ainsi que d&apos;un droit
              d&apos;opposition et de limitation du traitement. Pour exercer ces
              droits, contactez-nous à{" "}
              <a
                href="mailto:contact@dadforlife.org"
                className="text-primary hover:underline"
              >
                contact@dadforlife.org
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              6. Cookies
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Le site peut utiliser des cookies pour assurer son bon
              fonctionnement et améliorer l&apos;expérience utilisateur. Vous
              pouvez configurer votre navigateur pour refuser les cookies. Pour
              plus d&apos;informations, consultez notre{" "}
              <a
                href="/politique-confidentialite"
                className="text-primary hover:underline"
              >
                politique de confidentialité
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              7. Droit applicable
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Le présent site et ses mentions légales sont soumis au droit
              français. En cas de litige, les tribunaux de Nantes seront seuls
              compétents.
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
