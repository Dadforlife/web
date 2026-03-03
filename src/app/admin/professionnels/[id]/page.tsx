import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { setProfessionalStatus, saveInterview, verifyProfessionalDocument, generateProfessionalDocument } from "../actions";
import { ProfessionalStatusBadge } from "@/components/professional-status-badge";
import { ProfessionalLevelBadge } from "@/components/professional-level-badge";
import { GeneratedDocumentType, ProfessionalStatus } from "@prisma/client";

export default async function AdminProfessionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      professionalVerification: true,
      professionalDocuments: {
        orderBy: { uploadedAt: "desc" },
      },
      generatedDocuments: {
        orderBy: { createdAt: "desc" },
      },
      professionalReviewsReceived: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: { professionalReviewsReceived: true },
      },
    },
  });

  if (!user || !user.professionalRole) notFound();

  const verifyAction = verifyProfessionalDocument;
  const markValidated = setProfessionalStatus.bind(
    null,
    user.id,
    ProfessionalStatus.valide,
  );
  const markRefused = setProfessionalStatus.bind(
    null,
    user.id,
    ProfessionalStatus.refuse,
  );
  const markSuspended = setProfessionalStatus.bind(
    null,
    user.id,
    ProfessionalStatus.suspendu,
  );
  const createCharter = generateProfessionalDocument.bind(
    null,
    user.id,
    GeneratedDocumentType.charte_ethique,
  );
  const createConvention = generateProfessionalDocument.bind(
    null,
    user.id,
    GeneratedDocumentType.convention_partenariat,
  );

  const reviewAvg =
    user.professionalReviewsReceived.length > 0
      ? user.professionalReviewsReceived.reduce((acc, r) => acc + r.rating, 0) /
        user.professionalReviewsReceived.length
      : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title={user.fullName || user.email}
        description={`Dossier professionnel (${user.professionalRole})`}
        backHref="/admin/professionnels"
      />

      <Card>
        <CardContent className="pt-6 grid sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Statut</p>
            <ProfessionalStatusBadge status={user.professionalStatus} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Niveau</p>
            <ProfessionalLevelBadge level={user.professionalLevel} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avis</p>
            <p className="font-medium">
              {user._count.professionalReviewsReceived} avis ({reviewAvg.toFixed(1)}/5)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents uploades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.professionalDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun document.</p>
            ) : (
              user.professionalDocuments.map((doc) => (
                <div key={doc.id} className="rounded-lg border p-3">
                  <p className="font-medium">{doc.documentType}</p>
                  <a className="text-sm text-primary hover:underline" href={doc.fileUrl}>
                    Ouvrir le document
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Verifie: {doc.verified ? "Oui" : "Non"}
                  </p>
                  {!doc.verified && (
                    <form action={verifyAction.bind(null, doc.id)} className="mt-2">
                      <Button size="sm" type="submit">Verifier</Button>
                    </form>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validation admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              action={async (formData) => {
                "use server";
                const score = parseInt((formData.get("interviewScore") as string) || "0", 10);
                const notes = (formData.get("notes") as string) || "";
                await saveInterview(user.id, score, notes);
              }}
              className="space-y-2"
            >
              <Label htmlFor="interviewScore">Score entretien</Label>
              <Input id="interviewScore" name="interviewScore" type="number" min={0} max={10} required />
              <Label htmlFor="notes">Notes internes</Label>
              <Textarea id="notes" name="notes" />
              <Button type="submit" variant="outline">Enregistrer entretien</Button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              <form action={markValidated}>
                <Button type="submit">Valider</Button>
              </form>
              <form action={markRefused}>
                <Button type="submit" variant="destructive">Refuser</Button>
              </form>
              <form action={markSuspended}>
                <Button type="submit" variant="outline">Suspendre</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generation documentaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <form action={createCharter}>
              <Button type="submit" variant="outline">Generer charte ethique</Button>
            </form>
            <form action={createConvention}>
              <Button type="submit" variant="outline">Generer convention</Button>
            </form>
          </div>

          <div className="space-y-2">
            {user.generatedDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun document genere.</p>
            ) : (
              user.generatedDocuments.map((doc) => (
                <div key={doc.id} className="rounded-lg border p-3">
                  <p className="font-medium">{doc.documentType}</p>
                  <a className="text-sm text-primary hover:underline" href={doc.fileUrl}>
                    Telecharger
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Signe: {doc.isSigned ? "Oui" : "Non"}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

