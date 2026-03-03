"use client";

import { useState, useTransition } from "react";
import {
  promoteToAdmin,
  promoteToModerator,
  demoteToMember,
  searchUserByEmail,
} from "../actions";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, ShieldAlert, UserMinus, Search, Loader2 } from "lucide-react";

interface UserRow {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

interface RolesClientProps {
  privilegedUsers: UserRow[];
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  moderator: "Modérateur",
  member: "Membre",
};

function RoleBadge({ role }: { role: string }) {
  const label = ROLE_LABELS[role] ?? role;
  switch (role) {
    case "admin":
      return <Badge>{label}</Badge>;
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

export function RolesClient({ privilegedUsers }: RolesClientProps) {
  const [isPending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
    variant: "destructive" | "default";
  }>({
    open: false,
    title: "",
    description: "",
    action: async () => {},
    variant: "default",
  });

  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState<UserRow | null>(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  function openPromoteAdmin(user: UserRow) {
    setDialog({
      open: true,
      title: "Promouvoir en administrateur",
      description: `Voulez-vous vraiment promouvoir ${user.fullName || user.email} au rôle d'administrateur ?`,
      action: () => promoteToAdmin(user.id),
      variant: "default",
    });
  }

  function openPromoteModerator(user: UserRow) {
    setDialog({
      open: true,
      title: "Promouvoir en modérateur",
      description: `Voulez-vous vraiment promouvoir ${user.fullName || user.email} au rôle de modérateur ?`,
      action: () => promoteToModerator(user.id),
      variant: "default",
    });
  }

  function openDemote(user: UserRow) {
    setDialog({
      open: true,
      title: "Rétrograder en membre",
      description: `Voulez-vous vraiment rétrograder ${user.fullName || user.email} au rôle de membre ?`,
      action: () => demoteToMember(user.id),
      variant: "destructive",
    });
  }

  function handleConfirm() {
    startTransition(async () => {
      await dialog.action();
      setDialog((prev) => ({ ...prev, open: false }));
    });
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchError("");
    setSearchResult(null);

    if (!searchEmail.trim()) return;

    setSearching(true);
    try {
      const result = await searchUserByEmail(searchEmail.trim());
      if (result) {
        setSearchResult(result);
      } else {
        setSearchError("Aucun utilisateur trouvé avec cet email.");
      }
    } catch {
      setSearchError("Erreur lors de la recherche.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">
            Administrateurs et modérateurs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {privilegedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Aucun utilisateur privilégié.
                  </TableCell>
                </TableRow>
              ) : (
                privilegedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.fullName || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((r) => (
                          <RoleBadge key={r} role={r} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!user.roles.includes("admin") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openPromoteAdmin(user)}
                            title="Promouvoir admin"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                        )}
                        {!user.roles.includes("moderator") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openPromoteModerator(user)}
                            title="Promouvoir modérateur"
                          >
                            <ShieldAlert className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDemote(user)}
                          title="Retirer admin/modérateur"
                        >
                          <UserMinus className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Rechercher un utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search-email">Email</Label>
              <Input
                id="search-email"
                type="email"
                placeholder="utilisateur@exemple.com"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={searching}>
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Rechercher
            </Button>
          </form>

          {searchError && (
            <p className="text-sm text-destructive">{searchError}</p>
          )}

          {searchResult && (
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
              <div className="space-y-0.5">
                <p className="font-medium">
                  {searchResult.fullName || "—"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchResult.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {searchResult.roles.map((r) => (
                  <RoleBadge key={r} role={r} />
                ))}
                {!searchResult.roles.includes("admin") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPromoteAdmin(searchResult)}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Button>
                )}
                {!searchResult.roles.includes("moderator") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPromoteModerator(searchResult)}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Modérateur
                  </Button>
                )}
                {(searchResult.roles.includes("admin") || searchResult.roles.includes("moderator")) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDemote(searchResult)}
                  >
                    <UserMinus className="h-4 w-4" />
                    Retirer
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        title={dialog.title}
        description={dialog.description}
        variant={dialog.variant}
        loading={isPending}
        onConfirm={handleConfirm}
        confirmLabel="Confirmer"
        cancelLabel="Annuler"
      />
    </>
  );
}
