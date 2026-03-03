"use client";

import { useActionState, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  updateUser,
  suspendUser,
  banUser,
  reactivateUser,
  toggleVerifiedPapa,
} from "../actions";
import {
  Save,
  ShieldAlert,
  Ban,
  RotateCcw,
  MessageCircle,
  FileText,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface SerializedUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  roles: string[];
  status: string;
  isVerifiedPapa: boolean;
  avatarUrl: string | null;
  lastActiveAt: string | null;
  suspendedAt: string | null;
  suspendedReason: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    discussions: number;
    messages: number;
    diagnostics: number;
  };
}

interface SerializedDiscussion {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  categoryName: string;
  messageCount: number;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  partner: "Partenaire",
  moderator: "Modérateur",
  member: "Membre",
  volunteer: "Bénévole",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  suspended: "Suspendu",
  banned: "Banni",
};

function RoleBadge({ role }: { role: string }) {
  const label = ROLE_LABELS[role] ?? role;
  switch (role) {
    case "admin":
      return <Badge>{label}</Badge>;
    case "partner":
      return <Badge variant="secondary">{label}</Badge>;
    case "moderator":
      return (
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          {label}
        </Badge>
      );
    default:
      return <Badge variant="outline">{label}</Badge>;
  }
}

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  switch (status) {
    case "active":
      return (
        <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          {label}
        </Badge>
      );
    case "suspended":
      return (
        <Badge className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300">
          {label}
        </Badge>
      );
    case "banned":
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {label}
        </Badge>
      );
    default:
      return <Badge variant="outline">{label}</Badge>;
  }
}

type FormState = { success: boolean; error?: string } | null;

export function UserDetailClient({
  user,
  recentDiscussions,
}: {
  user: SerializedUser;
  recentDiscussions: SerializedDiscussion[];
}) {
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [banOpen, setBanOpen] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [formState, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData) => {
      try {
        await updateUser(user.id, {
          fullName: formData.get("fullName") as string,
          email: formData.get("email") as string,
          phone: (formData.get("phone") as string) || null,
          roles: (formData.get("roles") as string).split(",").filter(Boolean),
        });
        return { success: true };
      } catch {
        return { success: false, error: "Erreur lors de la mise à jour." };
      }
    },
    null
  );

  async function handleSuspend() {
    setActionLoading(true);
    try {
      await suspendUser(user.id, reason);
    } finally {
      setActionLoading(false);
      setSuspendOpen(false);
      setReason("");
    }
  }

  async function handleBan() {
    setActionLoading(true);
    try {
      await banUser(user.id, reason);
    } finally {
      setActionLoading(false);
      setBanOpen(false);
      setReason("");
    }
  }

  async function handleReactivate() {
    setActionLoading(true);
    try {
      await reactivateUser(user.id);
    } finally {
      setActionLoading(false);
      setReactivateOpen(false);
    }
  }

  async function handleToggleVerified() {
    await toggleVerifiedPapa(user.id);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={user.status} />
        {user.roles.map((r) => (
        <RoleBadge key={r} role={r} />
      ))}
        {user.isVerifiedPapa && (
          <Badge className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
            Papa vérifié
          </Badge>
        )}
        <span className="text-sm text-muted-foreground ml-auto">
          Inscrit le{" "}
          {new Date(user.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <Tabs defaultValue="infos">
        <TabsList>
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="activite">Activité</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="infos" className="space-y-6 mt-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">
                Modifier les informations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      defaultValue={user.fullName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={user.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={user.phone ?? ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rôles</Label>
                    <input type="hidden" name="roles" id="roles-hidden" defaultValue={user.roles.join(",")} />
                    <div className="flex flex-wrap gap-2">
                      {["member", "moderator", "admin", "partner", "volunteer"].map((r) => {
                        const isActive = user.roles.includes(r);
                        return (
                          <Button
                            key={r}
                            type="button"
                            size="sm"
                            variant={isActive ? "default" : "outline"}
                            className="text-xs"
                            onClick={() => {
                              const hidden = document.getElementById("roles-hidden") as HTMLInputElement;
                              const current = hidden.value.split(",").filter(Boolean);
                              const next = current.includes(r)
                                ? current.filter((x) => x !== r)
                                : [...current, r];
                              if (next.length === 0) return;
                              hidden.value = next.join(",");
                              (hidden.closest("form") as HTMLFormElement)?.requestSubmit();
                            }}
                          >
                            {ROLE_LABELS[r] ?? r}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Switch
                    id="verifiedPapa"
                    checked={user.isVerifiedPapa}
                    onCheckedChange={handleToggleVerified}
                  />
                  <Label htmlFor="verifiedPapa">Papa vérifié</Label>
                </div>

                {formState?.error && (
                  <p className="text-sm text-destructive">{formState.error}</p>
                )}
                {formState?.success && (
                  <p className="text-sm text-green-600">
                    Informations mises à jour.
                  </p>
                )}

                <Button type="submit" disabled={isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {isPending ? "Enregistrement…" : "Enregistrer"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {user.suspendedAt && (
            <Card className="rounded-2xl border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="text-base text-orange-700 dark:text-orange-300">
                  Suspension
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Date :</span>{" "}
                  {new Date(user.suspendedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {user.suspendedReason && (
                  <p>
                    <span className="font-medium">Raison :</span>{" "}
                    {user.suspendedReason}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activite" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="rounded-2xl">
              <CardContent className="pt-6 flex flex-col items-center gap-2">
                <MessageCircle className="h-8 w-8 text-blue-600" />
                <p className="text-2xl font-bold">
                  {user._count.discussions}
                </p>
                <p className="text-sm text-muted-foreground">Discussions</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="pt-6 flex flex-col items-center gap-2">
                <FileText className="h-8 w-8 text-violet-600" />
                <p className="text-2xl font-bold">{user._count.messages}</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="pt-6 flex flex-col items-center gap-2">
                <Activity className="h-8 w-8 text-emerald-600" />
                <p className="text-2xl font-bold">
                  {user._count.diagnostics}
                </p>
                <p className="text-sm text-muted-foreground">Diagnostics</p>
              </CardContent>
            </Card>
          </div>

          {user.lastActiveAt && (
            <p className="text-sm text-muted-foreground mt-4">
              Dernière activité :{" "}
              {new Date(user.lastActiveAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </TabsContent>

        <TabsContent value="discussions" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">
                Discussions récentes ({recentDiscussions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDiscussions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Aucune discussion.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentDiscussions.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell>
                          <Link
                            href={`/espace-papas/${d.id}`}
                            className="font-medium hover:underline"
                          >
                            {d.title}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {d.categoryName}
                        </TableCell>
                        <TableCell>{d.messageCount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(d.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4 mt-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">
                Actions de modération
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {user.status === "active" && (
                <>
                  <Button
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950"
                    onClick={() => setSuspendOpen(true)}
                  >
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    Suspendre
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setBanOpen(true)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Bannir
                  </Button>
                </>
              )}
              {user.status === "suspended" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setReactivateOpen(true)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Réactiver
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setBanOpen(true)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Bannir
                  </Button>
                </>
              )}
              {user.status === "banned" && (
                <Button
                  variant="outline"
                  onClick={() => setReactivateOpen(true)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réactiver
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        title="Suspendre l'utilisateur"
        description="Cette action suspendra le compte de l'utilisateur. Il ne pourra plus accéder à la plateforme."
        confirmLabel="Suspendre"
        variant="destructive"
        loading={actionLoading}
        onConfirm={handleSuspend}
      >
        <div className="space-y-2 py-2">
          <Label htmlFor="suspend-reason">Raison de la suspension</Label>
          <Textarea
            id="suspend-reason"
            placeholder="Décrivez la raison…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={banOpen}
        onOpenChange={setBanOpen}
        title="Bannir l'utilisateur"
        description="Cette action bannira définitivement le compte. L'utilisateur ne pourra plus accéder à la plateforme."
        confirmLabel="Bannir"
        variant="destructive"
        loading={actionLoading}
        onConfirm={handleBan}
      >
        <div className="space-y-2 py-2">
          <Label htmlFor="ban-reason">Raison du bannissement</Label>
          <Textarea
            id="ban-reason"
            placeholder="Décrivez la raison…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={reactivateOpen}
        onOpenChange={setReactivateOpen}
        title="Réactiver l'utilisateur"
        description="Cette action réactivera le compte. L'utilisateur pourra à nouveau accéder à la plateforme."
        confirmLabel="Réactiver"
        variant="default"
        loading={actionLoading}
        onConfirm={handleReactivate}
      />
    </>
  );
}
