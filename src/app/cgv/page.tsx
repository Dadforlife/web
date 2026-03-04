import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Conditions Générales de Vente",
  description:
    "Conditions générales de vente de Papa pour la vie : tarifs des services, modalités de paiement, droit de rétractation et remboursement.",
  path: "/cgv",
});

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12">
          Conditions Générales de Vente
        </h1>

        <div className="prose prose-slate max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 1 - Objet
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Les présentes Conditions Générales de Vente (ci-après
              &laquo; CGV &raquo;) s&apos;appliquent à l&apos;ensemble des
              prestations et services payants proposés par l&apos;association
              Papa pour la vie, association loi 1901 dont le siège social est
              situé au 30 rue de l&apos;Ouche Buron, 44300 Nantes, via sa
              plateforme en ligne (ci-après &laquo; la Plateforme &raquo;).
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              Toute commande ou souscription implique l&apos;acceptation sans
              réserve des présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 2 - Services proposés
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;association propose, dans le cadre de son objet social, des
              services pouvant donner lieu à une contrepartie financière :
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 list-disc pl-6">
              <li>Programmes de formation et d&apos;accompagnement</li>
              <li>
                Ateliers, conférences et événements de sensibilisation
              </li>
              <li>Dons et contributions volontaires</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-2">
              L&apos;association étant à but non lucratif, les recettes sont
              exclusivement affectées à la réalisation de son objet social
              conformément à ses statuts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 3 - Tarifs
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Les prix des services sont indiqués en euros (EUR) sur la
              Plateforme. L&apos;association étant non assujettie à la TVA (sauf
              mention contraire), les prix affichés sont nets.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              L&apos;association se réserve le droit de modifier ses tarifs à
              tout moment. Les tarifs applicables sont ceux en vigueur au moment
              de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 4 - Commande et paiement
            </h2>
            <p className="text-slate-700 leading-relaxed">
              La commande est confirmée après validation du paiement en ligne.
              Le paiement s&apos;effectue par carte bancaire via un prestataire
              de paiement sécurisé. L&apos;association ne stocke aucune donnée
              bancaire.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              Un email de confirmation est envoyé à l&apos;utilisateur après
              validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 5 - Dons
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Les dons effectués via la Plateforme sont des contributions
              volontaires. L&apos;association pourra, dans le respect des
              conditions légales applicables aux organismes d&apos;intérêt
              général, délivrer des reçus fiscaux permettant une réduction
              d&apos;impôt conformément aux articles 200 et 238 bis du Code
              Général des Impôts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 6 - Droit de rétractation
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Conformément aux articles L.221-18 et suivants du Code de la
              consommation, l&apos;utilisateur dispose d&apos;un délai de
              quatorze (14) jours à compter de la date de souscription pour
              exercer son droit de rétractation, sans avoir à justifier de
              motifs.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              Ce droit ne s&apos;applique pas aux services pleinement exécutés
              avant la fin du délai de rétractation et dont l&apos;exécution a
              commencé avec l&apos;accord exprès de l&apos;utilisateur.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              Pour exercer ce droit, adressez votre demande à :{" "}
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
              Article 7 - Remboursement
            </h2>
            <p className="text-slate-700 leading-relaxed">
              En cas d&apos;exercice du droit de rétractation, le remboursement
              sera effectué dans un délai de quatorze (14) jours à compter de la
              réception de la demande, par le même moyen de paiement que celui
              utilisé pour la transaction initiale.
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              Les dons ne sont pas remboursables sauf erreur de paiement avérée.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 8 - Responsabilité
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;association s&apos;engage à fournir les services décrits
              avec diligence. Les contenus et programmes proposés ont un
              caractère informatif et d&apos;accompagnement ; ils ne se
              substituent pas à un avis juridique, médical ou psychologique
              professionnel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Article 9 - Données personnelles
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Les données collectées dans le cadre des commandes sont traitées
              conformément au RGPD. Elles sont utilisées pour la gestion des
              commandes et la communication relative aux services souscrits. Pour
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
              Article 10 - Médiation
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Conformément aux articles L.612-1 et suivants du Code de la
              consommation, en cas de litige non résolu, l&apos;utilisateur peut
              recourir gratuitement à un médiateur de la consommation. Les
              coordonnées du médiateur compétent seront communiquées sur simple
              demande à{" "}
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
              Article 11 - Droit applicable et juridiction
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Les présentes CGV sont soumises au droit français. En cas de litige
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
