"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Loader2,
  AlertCircle,
  Shield,
  Baby,
  Plus,
  Trash2,
} from "lucide-react";
import { submitAccompagnementRequest } from "./actions";

interface ChildEntry {
  prenom: string;
  sexe: "garcon" | "fille" | "";
}

interface Props {
  motherPhone: string;
}

export function AccompagnementRequestForm({ motherPhone }: Props) {
  const [state, formAction, isPending] = useActionState(
    submitAccompagnementRequest,
    undefined,
  );
  const [charCount, setCharCount] = useState(0);
  const [children, setChildren] = useState<ChildEntry[]>([
    { prenom: "", sexe: "" },
  ]);

  function addChild() {
    setChildren([...children, { prenom: "", sexe: "" }]);
  }

  function removeChild(index: number) {
    if (children.length <= 1) return;
    setChildren(children.filter((_, i) => i !== index));
  }

  function updateChild(index: number, field: keyof ChildEntry, value: string) {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  }

  return (
    <Card className="rounded-2xl border border-border/70 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Informations sur le p&egrave;re
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="fatherFirstName" className="text-sm font-semibold">
              Pr&eacute;nom du p&egrave;re <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="fatherFirstName"
                name="fatherFirstName"
                type="text"
                required
                placeholder="Pr&eacute;nom"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="fatherCity" className="text-sm font-semibold">
              Ville du p&egrave;re <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="fatherCity"
                name="fatherCity"
                type="text"
                required
                placeholder="Ville"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="fatherPhone" className="text-sm font-semibold">
              T&eacute;l&eacute;phone du p&egrave;re <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="fatherPhone"
                name="fatherPhone"
                type="tel"
                required
                placeholder="06 12 34 56 78"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="fatherEmail" className="text-sm font-semibold">
              Email du p&egrave;re{" "}
              <span className="text-muted-foreground font-normal">(optionnel)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="fatherEmail"
                name="fatherEmail"
                type="email"
                placeholder="email@exemple.fr"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Section enfant(s) */}
          <div className="border-t pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Baby className="h-4 w-4 text-primary" />
                Enfant(s) concern&eacute;(s) <span className="text-destructive">*</span>
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg text-xs h-8"
                onClick={addChild}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Ajouter un enfant
              </Button>
            </div>

            {children.map((child, index) => (
              <div
                key={index}
                className="relative p-4 rounded-xl border-2 border-input bg-muted/30 space-y-3"
              >
                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(index)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Retirer cet enfant"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}

                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Enfant {index + 1}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`childPrenom_${index}`}
                      className="text-sm font-medium"
                    >
                      Pr&eacute;nom <span className="text-destructive">*</span>
                    </label>
                    <input
                      id={`childPrenom_${index}`}
                      name={`childPrenom_${index}`}
                      type="text"
                      required
                      placeholder="Pr&eacute;nom de l'enfant"
                      value={child.prenom}
                      onChange={(e) =>
                        updateChild(index, "prenom", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor={`childSexe_${index}`}
                      className="text-sm font-medium"
                    >
                      Sexe <span className="text-destructive">*</span>
                    </label>
                    <select
                      id={`childSexe_${index}`}
                      name={`childSexe_${index}`}
                      required
                      value={child.sexe}
                      onChange={(e) =>
                        updateChild(index, "sexe", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    >
                      <option value="">S&eacute;lectionner...</option>
                      <option value="garcon">Gar&ccedil;on</option>
                      <option value="fille">Fille</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <input
              type="hidden"
              name="childrenCount"
              value={children.length}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="situationDescription" className="text-sm font-semibold">
              Description de la situation <span className="text-destructive">*</span>
            </label>
            <textarea
              id="situationDescription"
              name="situationDescription"
              required
              minLength={100}
              rows={5}
              placeholder="D&eacute;crivez la situation du p&egrave;re : contexte familial, difficult&eacute;s rencontr&eacute;es, raisons de la demande d'accompagnement..."
              className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors resize-y"
              onChange={(e) => setCharCount(e.target.value.length)}
            />
            <p className={`text-xs ${charCount < 100 ? "text-muted-foreground" : "text-chart-4"}`}>
              {charCount}/100 caract&egrave;res minimum
            </p>
          </div>

          <div className="border-t pt-5 space-y-4">
            <p className="text-sm font-semibold">Vos coordonn&eacute;es</p>

            <div className="space-y-2">
              <label htmlFor="motherPhone" className="text-sm font-semibold">
                Votre t&eacute;l&eacute;phone <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="motherPhone"
                  name="motherPhone"
                  type="tel"
                  required
                  defaultValue={motherPhone}
                  placeholder="06 12 34 56 78"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground leading-relaxed">
                Je certifie que les informations fournies sont exactes et j&apos;autorise
                Papa pour la vie &agrave; contacter le p&egrave;re de mon enfant dans le cadre
                d&apos;un accompagnement. Je comprends que mes donn&eacute;es sont trait&eacute;es
                conform&eacute;ment &agrave; la politique de confidentialit&eacute;.
                <span className="text-destructive"> *</span>
              </span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl h-11 font-semibold"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Soumettre la demande
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Toutes les informations sont confidentielles et s&eacute;curis&eacute;es.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
