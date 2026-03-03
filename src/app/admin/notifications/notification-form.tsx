"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Users, User, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  sendGlobalNotification,
  sendGroupNotification,
  sendIndividualNotification,
  type NotificationActionState,
} from "./actions";

const ROLE_OPTIONS = [
  { value: "member", label: "Membre" },
  { value: "admin", label: "Administrateur" },
  { value: "partner", label: "Partenaire" },
  { value: "moderator", label: "Modérateur" },
  { value: "volunteer", label: "Bénévole" },
];

function StatusMessage({ state }: { state: NotificationActionState }) {
  if (!state) return null;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
        state.success
          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
          : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
      }`}
    >
      {state.success ? (
        <CheckCircle className="h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      {state.message}
    </div>
  );
}

export function GlobalNotificationForm() {
  const [state, action, isPending] = useActionState(sendGlobalNotification, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-5 w-5 text-blue-600" />
          Notification globale
        </CardTitle>
        <CardDescription>
          Envoyer une notification à tous les utilisateurs de la plateforme.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="global-subject">Sujet</Label>
            <Input
              id="global-subject"
              name="subject"
              placeholder="Sujet de la notification"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="global-body">Message</Label>
            <Textarea
              id="global-body"
              name="body"
              placeholder="Contenu de la notification..."
              rows={4}
              required
            />
          </div>
          <StatusMessage state={state} />
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Envoyer à tous
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function GroupNotificationForm() {
  const [state, action, isPending] = useActionState(sendGroupNotification, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-5 w-5 text-purple-600" />
          Notification par groupe
        </CardTitle>
        <CardDescription>
          Envoyer une notification à tous les utilisateurs d&apos;un rôle spécifique.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-role">Rôle</Label>
            <Select name="role" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-subject">Sujet</Label>
            <Input
              id="group-subject"
              name="subject"
              placeholder="Sujet de la notification"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-body">Message</Label>
            <Textarea
              id="group-body"
              name="body"
              placeholder="Contenu de la notification..."
              rows={4}
              required
            />
          </div>
          <StatusMessage state={state} />
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Envoyer au groupe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function IndividualNotificationForm() {
  const [state, action, isPending] = useActionState(
    sendIndividualNotification,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-5 w-5 text-green-600" />
          Notification individuelle
        </CardTitle>
        <CardDescription>
          Envoyer une notification à un utilisateur spécifique par email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="individual-email">Email de l&apos;utilisateur</Label>
            <Input
              id="individual-email"
              name="email"
              type="email"
              placeholder="utilisateur@exemple.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="individual-subject">Sujet</Label>
            <Input
              id="individual-subject"
              name="subject"
              placeholder="Sujet de la notification"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="individual-body">Message</Label>
            <Textarea
              id="individual-body"
              name="body"
              placeholder="Contenu de la notification..."
              rows={4}
              required
            />
          </div>
          <StatusMessage state={state} />
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Envoyer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
