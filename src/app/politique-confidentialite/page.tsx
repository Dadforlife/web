import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité - Papa pour la vie",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12">
          Politique de confidentialité
        </h1>

        <div className="prose prose-slate max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              1. Responsable du traitement
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Le responsable du traitement des données personnelles est
              l&apos;association <strong>Papa pour la vie</strong>, association
              loi 1901, dont le siège social est situé au 30 rue de
              l&apos;Ouche Buron, 44300 Nantes.
            </p>
            <ul className="mt-4 space-y-2 text-slate-700">
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
                <strong>Téléphone :</strong> 07 64 27 89 87
              </li>
              <li>
                <strong>Représentant légal :</strong> Munsense Tshibangu,
                Président
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              2. Données collectées
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Dans le cadre de l&apos;utilisation de la plateforme, nous
              collectons les catégories de données suivantes :
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 list-disc pl-6">
              <li>
                <strong>Données d&apos;identification :</strong> nom, prénom,
                adresse email, numéro de téléphone
              </li>
              <li>
                <strong>Données de connexion :</strong> adresse IP, date et
                heure de connexion, navigateur utilisé
              </li>
              <li>
                <strong>Données de profil :</strong> informations renseignées
                lors de l&apos;inscription ou du diagnostic (situation
                familiale, nombre d&apos;enfants, etc.)
              </li>
              <li>
                <strong>Données de contenu :</strong> messages publiés sur le
                forum, messages privés, fichiers partagés
              </li>
              <li>
                <strong>Données de paiement :</strong> les transactions sont
                traitées par notre prestataire de paiement sécurisé ;
                l&apos;association ne stocke aucune donnée bancaire
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              3. Finalités du traitement
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Vos données sont collectées et traitées pour les finalités
              suivantes :
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 list-disc pl-6">
              <li>
                Gestion de votre compte et authentification
              </li>
              <li>
                Fourniture des services de la plateforme (diagnostic,
                accompagnement, forum, messagerie)
              </li>
              <li>
                Mise en relation avec des professionnels qualifiés et des
                bénévoles
              </li>
              <li>
                Envoi de notifications relatives à votre compte et aux services
                souscrits
              </li>
              <li>
                Amélioration de la plateforme et de l&apos;expérience
                utilisateur
              </li>
              <li>
                Respect des obligations légales et réglementaires
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              4. Bases légales du traitement
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Les traitements de données reposent sur les bases légales
              suivantes :
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 list-disc pl-6">
              <li>
                <strong>Consentement :</strong> lors de l&apos;inscription et
                de l&apos;acceptation des CGU
              </li>
              <li>
                <strong>Exécution contractuelle :</strong> pour la fourniture
                des services souscrits
              </li>
              <li>
                <strong>Intérêt légitime :</strong> pour l&apos;amélioration de
                la plateforme et la sécurité
              </li>
              <li>
                <strong>Obligation légale :</strong> pour le respect des
                réglementations applicables
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              5. Destinataires des données
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Vos données personnelles sont destinées exclusivement à
              l&apos;association Papa pour la vie et ne sont en aucun cas
              vendues à des tiers. Elles peuvent être communiquées aux
              prestataires techniques suivants, dans le strict cadre de leur
              mission :
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 list-disc pl-6">
              <li>
                Hébergeur : Vercel Inc. (États-Unis)
              </li>
              <li>
                Base de données : Neon (États-Unis)
              </li>
              <li>
                Service d&apos;envoi d&apos;emails : Resend (États-Unis)
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-2">
              Ces prestataires s&apos;engagent à respecter le RGPD. Les
              transferts de données vers les États-Unis sont encadrés par les
              clauses contractuelles types de la Commission européenne.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              6. Durée de conservation
            </h2>
            <ul className="space-y-2 text-slate-700 list-disc pl-6">
              <li>
                <strong>Données de compte :</strong> conservées pendant toute la
                durée de votre inscription, puis supprimées dans un délai de 3
                ans après la suppression du compte
              </li>
              <li>
                <strong>Données de connexion :</strong> conservées pendant 12
                mois conformément à la réglementation
              </li>
              <li>
                <strong>Données de paiement :</strong> conservées pendant la
                durée légale de conservation comptable (10 ans)
              </li>
              <li>
                <strong>Cookies :</strong> durée maximale de 13 mois
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              7. Vos droits
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi Informatique et Libertés, vous disposez des
              droits suivants :
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 list-disc pl-6">
              <li>
                <strong>Droit d&apos;accès :</strong> obtenir la confirmation
                que vos données sont traitées et en obtenir une copie
              </li>
              <li>
                <strong>Droit de rectification :</strong> corriger des données
                inexactes ou incomplètes
              </li>
              <li>
                <strong>Droit de suppression :</strong> demander
                l&apos;effacement de vos données
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> recevoir vos données
                dans un format structuré et lisible
              </li>
              <li>
                <strong>Droit d&apos;opposition :</strong> vous opposer au
                traitement de vos données
              </li>
              <li>
                <strong>Droit à la limitation :</strong> demander la suspension
                du traitement de vos données
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              Pour exercer ces droits, contactez-nous à :{" "}
              <a
                href="mailto:contact@dadforlife.org"
                className="text-primary hover:underline"
              >
                contact@dadforlife.org
              </a>
            </p>
            <p className="text-slate-700 leading-relaxed mt-2">
              Vous disposez également du droit d&apos;introduire une réclamation
              auprès de la CNIL (Commission Nationale de l&apos;Informatique et
              des Libertés) :{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.cnil.fr
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              8. Cookies
            </h2>
            <p className="text-slate-700 leading-relaxed">
              La plateforme utilise des cookies pour assurer son bon
              fonctionnement. Les cookies utilisés sont :
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 list-disc pl-6">
              <li>
                <strong>Cookies essentiels :</strong> nécessaires au
                fonctionnement du site (session, authentification). Ils ne
                nécessitent pas votre consentement.
              </li>
              <li>
                <strong>Cookies de préférences :</strong> mémorisation de vos
                choix (consentement cookies, thème). Soumis à votre
                consentement.
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-2">
              Vous pouvez à tout moment modifier vos préférences en matière de
              cookies via les paramètres de votre navigateur ou le bandeau de
              consentement affiché sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              9. Sécurité des données
            </h2>
            <p className="text-slate-700 leading-relaxed">
              L&apos;association met en œuvre des mesures techniques et
              organisationnelles appropriées pour protéger vos données
              personnelles contre tout accès non autorisé, modification,
              divulgation ou destruction. Ces mesures incluent notamment :
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 list-disc pl-6">
              <li>Chiffrement des communications (HTTPS/TLS)</li>
              <li>Hachage des mots de passe</li>
              <li>Contrôle d&apos;accès basé sur les rôles</li>
              <li>Hébergement sécurisé avec infrastructure certifiée</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              10. Modification de la politique
            </h2>
            <p className="text-slate-700 leading-relaxed">
              La présente politique de confidentialité peut être modifiée à tout
              moment. En cas de modification substantielle, les utilisateurs
              seront informés par notification sur la plateforme ou par email.
              La date de dernière mise à jour est indiquée en bas de cette page.
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
