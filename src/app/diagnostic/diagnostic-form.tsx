"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Loader2,
  AlertCircle,
  Users,
  Baby,
  Scale,
  MessageCircle,
  Shield,
  HelpCircle,
  Share2,
  ArrowRight,
  ArrowLeft,
  Info,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { submitDiagnostic } from "./actions";

const STEP_COUNT = 3;

interface DiagnosticFormProps {
  isLoggedIn: boolean;
}

const inputCls =
  "w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors";

const selectCls =
  "w-full pl-4 pr-10 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors appearance-none cursor-pointer";

const labelCls = "text-sm font-semibold text-foreground";

const sectionHeadingCls =
  "flex items-center gap-3 text-lg font-bold text-foreground mb-6";

export function DiagnosticForm({ isLoggedIn }: DiagnosticFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    // Section A
    fullName: "",
    email: "",
    phone: "",
    password: "",
    // Section B
    situation: "",
    nombreEnfants: "",
    ageEnfants: "",
    residenceEnfants: "",
    decisionJustice: "",
    // Section C
    communication: "",
    avocat: "",
    preoccupation: "",
    source: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function canGoNext(): boolean {
    if (step === 1) {
      if (!isLoggedIn) {
        return !!(
          form.fullName?.trim() &&
          form.email?.trim() &&
          form.password &&
          form.password.length >= 6
        );
      }
      return true;
    }
    if (step === 2) {
      return !!(
        form.situation &&
        form.nombreEnfants !== "" &&
        form.residenceEnfants &&
        form.decisionJustice
      );
    }
    return !!(
      form.communication &&
      form.avocat &&
      form.source
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await submitDiagnostic({
        ...(!isLoggedIn
          ? {
              fullName: form.fullName,
              email: form.email,
              phone: form.phone || undefined,
              password: form.password,
            }
          : {}),
        situation: form.situation,
        nombreEnfants: parseInt(form.nombreEnfants) || 0,
        ageEnfants: form.ageEnfants,
        residenceEnfants: form.residenceEnfants,
        decisionJustice: form.decisionJustice,
        communication: form.communication,
        avocat: form.avocat,
        preoccupation: form.preoccupation,
        source: form.source,
      });

      if (result.success) {
        if (result.isNewUser) {
          router.push("/auth/confirm");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Une erreur inattendue s\u2019est produite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BlurFade delay={0.15} inView>
      <Card className="border-2 border-border/80 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-6 sm:p-8 md:p-10">
          {/* Indicateur d'étapes */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 max-w-24 rounded-full transition-colors ${
                  s === step
                    ? "bg-primary"
                    : s < step
                      ? "bg-primary/40"
                      : "bg-muted"
                }`}
                aria-hidden
              />
            ))}
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground mb-6">
            Étape {step} sur {STEP_COUNT}
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* ─── Étape 1 : Informations générales (ou message connecté) ─── */}
            {step === 1 && (
            <>
            {!isLoggedIn ? (
              <div>
                <div className={sectionHeadingCls}>
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <span>A. Informations g&eacute;n&eacute;rales</span>
                </div>

                <div className="space-y-5">
                  {/* Nom complet */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className={labelCls}>
                      Nom complet <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="fullName"
                        type="text"
                        required
                        placeholder="Jean Dupont"
                        value={form.fullName}
                        onChange={(e) =>
                          updateField("fullName", e.target.value)
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className={labelCls}>
                      Email <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="votre@email.fr"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* T&eacute;l&eacute;phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className={labelCls}>
                      T&eacute;l&eacute;phone{" "}
                      <span className="text-muted-foreground font-normal">
                        (optionnel)
                      </span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="06 12 34 56 78"
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div className="space-y-2">
                    <label htmlFor="password" className={labelCls}>
                      Mot de passe <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="password"
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) =>
                          updateField("password", e.target.value)
                        }
                        className={inputCls}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum 6 caract&egrave;res
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                <Info className="h-4 w-4 text-primary shrink-0" />
                <span className="text-foreground font-medium">
                  Vous &ecirc;tes connect&eacute;(e). Compl&eacute;tez le
                  questionnaire ci-dessous.
                </span>
              </div>
            )}
            </>
            )}

            {/* ─── Étape 2 : Situation familiale ─── */}
            {step === 2 && (
            <div>
              <div className={sectionHeadingCls}>
                <div className="h-9 w-9 rounded-lg bg-warm/10 flex items-center justify-center shrink-0">
                  <Users className="h-4.5 w-4.5 text-warm" />
                </div>
                <span>B. Situation familiale</span>
              </div>

              <div className="space-y-5">
                {/* Situation actuelle */}
                <div className="space-y-2">
                  <label htmlFor="situation" className={labelCls}>
                    Situation actuelle{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="situation"
                      required
                      value={form.situation}
                      onChange={(e) => updateField("situation", e.target.value)}
                      className={selectCls}
                    >
                      <option value="" disabled>
                        S&eacute;lectionnez votre situation
                      </option>
                      <option value="En couple">En couple</option>
                      <option value="En séparation">En s&eacute;paration</option>
                      <option value="Séparé(e)">S&eacute;par&eacute;(e)</option>
                      <option value="Divorcé(e)">Divorc&eacute;(e)</option>
                      <option value="Procédure en cours">
                        Proc&eacute;dure en cours
                      </option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Nombre d'enfants */}
                <div className="space-y-2">
                  <label htmlFor="nombreEnfants" className={labelCls}>
                    Nombre d&apos;enfants{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Baby className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="nombreEnfants"
                      type="number"
                      required
                      min={0}
                      max={20}
                      placeholder="2"
                      value={form.nombreEnfants}
                      onChange={(e) =>
                        updateField("nombreEnfants", e.target.value)
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* &Acirc;ge(s) des enfants */}
                <div className="space-y-2">
                  <label htmlFor="ageEnfants" className={labelCls}>
                    &Acirc;ge(s) des enfants
                  </label>
                  <div className="relative">
                    <Baby className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="ageEnfants"
                      type="text"
                      placeholder="Ex : 4 ans, 8 ans"
                      value={form.ageEnfants}
                      onChange={(e) =>
                        updateField("ageEnfants", e.target.value)
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Mode de r&eacute;sidence */}
                <div className="space-y-2">
                  <label htmlFor="residenceEnfants" className={labelCls}>
                    Mode de r&eacute;sidence des enfants{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="residenceEnfants"
                      required
                      value={form.residenceEnfants}
                      onChange={(e) =>
                        updateField("residenceEnfants", e.target.value)
                      }
                      className={selectCls}
                    >
                      <option value="" disabled>
                        S&eacute;lectionnez
                      </option>
                      <option value="Chez vous">Chez vous</option>
                      <option value="Chez l'autre parent">
                        Chez l&apos;autre parent
                      </option>
                      <option value="Garde alternée">Garde altern&eacute;e</option>
                      <option value="Non défini">Non d&eacute;fini</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* D&eacute;cision de justice */}
                <div className="space-y-2">
                  <label htmlFor="decisionJustice" className={labelCls}>
                    Existe-t-il une d&eacute;cision de justice ?{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <select
                      id="decisionJustice"
                      required
                      value={form.decisionJustice}
                      onChange={(e) =>
                        updateField("decisionJustice", e.target.value)
                      }
                      className={`${selectCls} pl-11`}
                    >
                      <option value="" disabled>
                        S&eacute;lectionnez
                      </option>
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                      <option value="Procédure en cours">
                        Proc&eacute;dure en cours
                      </option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* ─── Étape 3 : Situation personnelle ─── */}
            {step === 3 && (
            <div>
              <div className={sectionHeadingCls}>
                <div className="h-9 w-9 rounded-lg bg-chart-2/10 flex items-center justify-center shrink-0">
                  <Shield className="h-4.5 w-4.5 text-chart-2" />
                </div>
                <span>C. Situation personnelle</span>
              </div>

              <div className="space-y-5">
                {/* Communication */}
                <div className="space-y-2">
                  <label htmlFor="communication" className={labelCls}>
                    Qualit&eacute; de la communication avec l&apos;autre parent{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <select
                      id="communication"
                      required
                      value={form.communication}
                      onChange={(e) =>
                        updateField("communication", e.target.value)
                      }
                      className={`${selectCls} pl-11`}
                    >
                      <option value="" disabled>
                        S&eacute;lectionnez
                      </option>
                      <option value="Correcte">Correcte</option>
                      <option value="Tendue">Tendue</option>
                      <option value="Très conflictuelle">
                        Tr&egrave;s conflictuelle
                      </option>
                      <option value="Inexistante">Inexistante</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Avocat */}
                <div className="space-y-2">
                  <label htmlFor="avocat" className={labelCls}>
                    Disposez-vous d&apos;un avocat ?{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <select
                      id="avocat"
                      required
                      value={form.avocat}
                      onChange={(e) => updateField("avocat", e.target.value)}
                      className={`${selectCls} pl-11`}
                    >
                      <option value="" disabled>
                        S&eacute;lectionnez
                      </option>
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Pr&eacute;occupation principale */}
                <div className="space-y-2">
                  <label htmlFor="preoccupation" className={labelCls}>
                    Quelle est votre pr&eacute;occupation principale ?
                  </label>
                  <div className="relative">
                    <HelpCircle className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                    <textarea
                      id="preoccupation"
                      rows={4}
                      placeholder="D&eacute;crivez bri&egrave;vement votre situation ou votre pr&eacute;occupation principale..."
                      value={form.preoccupation}
                      onChange={(e) =>
                        updateField("preoccupation", e.target.value)
                      }
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Source */}
                <div className="space-y-2">
                  <label htmlFor="source" className={labelCls}>
                    Comment avez-vous entendu parler de Dad for Life ?{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <select
                      id="source"
                      required
                      value={form.source}
                      onChange={(e) => updateField("source", e.target.value)}
                      className={`${selectCls} pl-11`}
                    >
                      <option value="" disabled>
                        S&eacute;lectionnez
                      </option>
                      <option value="Réseaux sociaux">
                        R&eacute;seaux sociaux
                      </option>
                      <option value="Bouche-à-oreille">
                        Bouche-&agrave;-oreille
                      </option>
                      <option value="Recherche internet">
                        Recherche internet
                      </option>
                      <option value="Professionnel">
                        Professionnel (avocat, m&eacute;diateur, etc.)
                      </option>
                      <option value="Autre">Autre</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Disclaimer (étape 3) */}
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                L&apos;analyse r&eacute;alis&eacute;e constitue une aide &agrave;
                l&apos;orientation et ne remplace pas un avis professionnel.
                Aucun conseil juridique n&apos;est dispens&eacute; dans le cadre
                de ce questionnaire. Les donn&eacute;es collect&eacute;es sont
                trait&eacute;es de mani&egrave;re confidentielle.
              </p>
            </div>
            )}

            {/* Navigation entre les étapes */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep((s) => s - 1)}
                  className="rounded-xl h-12 font-semibold order-2 sm:order-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
              ) : null}
              <div className="flex-1" />
              {step < STEP_COUNT ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canGoNext()}
                  className="rounded-xl h-12 font-semibold bg-warm text-warm-foreground hover:bg-warm/90 shadow-md shadow-warm/20 order-1 sm:order-2 w-full sm:w-auto"
                >
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || !canGoNext()}
                  className="rounded-xl h-12 font-semibold bg-warm text-warm-foreground hover:bg-warm/90 shadow-md shadow-warm/20 order-1 sm:order-2 w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer ma demande
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </BlurFade>
  );
}
