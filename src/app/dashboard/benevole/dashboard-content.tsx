"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/admin/stats-card";
import Link from "next/link";
import {
  Users,
  AlertTriangle,
  Mail,
  MapPin,
  Phone,
  Headphones,
  Briefcase,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";

interface Profile {
  id: string;
  volunteerRole: string;
  bio: string | null;
  city: string | null;
  maxAssignments: number;
  isActive: boolean;
}

interface Assignment {
  id: string;
  fatherId: string;
  startDate: string;
  notes: string | null;
  father: {
    id: string;
    fullName: string;
    email: string;
    diagnostics: {
      scoreGlobal: number;
      classification: string;
      createdAt: string;
    }[];
  };
}

interface Alert {
  id: string;
  type: string;
  priority: string;
  title: string;
  description: string | null;
  createdAt: string;
  father: { fullName: string } | null;
}

interface UpcomingAppointment {
  id: string;
  type: string;
  scheduledAt: string;
  duration: number;
  location: string | null;
  notes: string | null;
  father: { id: string; fullName: string };
}

const ROLE_CONFIG: Record<
  string,
  { label: string; description: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  accompagnateur_terrain: {
    label: "Accompagnateur terrain",
    description: "Accompagnement et visites aupres des papas",
    icon: MapPin,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  ecoute_soutien: {
    label: "Ecoute & soutien",
    description: "Ecoute active et soutien moral des papas",
    icon: Headphones,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  expertise_metier: {
    label: "Expertise metier",
    description: "Conseil et expertise professionnelle",
    icon: Briefcase,
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border-red-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-gray-100 text-gray-700 border-gray-300",
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: "Critique",
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

const APPOINTMENT_TYPE_CONFIG: Record<string, { label: string; icon: typeof MapPin; color: string }> = {
  accompagnement_terrain: {
    label: "Terrain",
    icon: MapPin,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  telephonique: {
    label: "Tel.",
    icon: Phone,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

function classificationBadge(classification: string) {
  switch (classification) {
    case "critique":
      return "bg-red-100 text-red-700 border-red-200";
    case "élevé":
    case "eleve":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "modéré":
    case "modere":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-green-100 text-green-700 border-green-200";
  }
}

export function DashboardContent({
  profile,
  assignments,
  alerts,
  upcomingAppointments,
  unreadConversations,
  userName,
}: {
  profile: Profile;
  assignments: Assignment[];
  alerts: Alert[];
  upcomingAppointments: UpcomingAppointment[];
  unreadConversations: number;
  userName: string;
}) {
  const roleConfig = ROLE_CONFIG[profile.volunteerRole] || ROLE_CONFIG.accompagnateur_terrain;
  const RoleIcon = roleConfig.icon;
  const criticalAlerts = alerts.filter((a) => a.priority === "critical" || a.priority === "high");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bonjour {userName.split(" ")[0]} 👋
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={roleConfig.color}>
            <RoleIcon className="h-3.5 w-3.5 mr-1" />
            {roleConfig.label}
          </Badge>
          {!profile.isActive && (
            <Badge variant="outline" className="text-muted-foreground">
              Inactif
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{roleConfig.description}</p>
      </div>

      {/* Urgent alerts banner */}
      {criticalAlerts.length > 0 && (
        <Card className="rounded-2xl border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-800">
                  {criticalAlerts.length} alerte{criticalAlerts.length > 1 ? "s" : ""} urgente
                  {criticalAlerts.length > 1 ? "s" : ""}
                </p>
                <ul className="mt-1 space-y-1">
                  {criticalAlerts.slice(0, 3).map((alert) => (
                    <li key={alert.id} className="text-sm text-red-700">
                      • {alert.title}
                      {alert.father && (
                        <span className="text-red-500"> — {alert.father.fullName}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard/benevole/alertes">
                  <Button variant="outline" size="sm" className="mt-3 border-red-300 text-red-700 hover:bg-red-100">
                    Voir toutes les alertes
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          title="Papas assignes"
          value={assignments.length}
          description={`/ ${profile.maxAssignments} max`}
          icon={Users}
          iconColor="text-blue-600"
          borderColor="border-t-blue-500"
        />
        <StatsCard
          title="Prochains RDV"
          value={upcomingAppointments.length}
          icon={CalendarCheck}
          iconColor="text-amber-600"
          borderColor="border-t-amber-500"
          description={upcomingAppointments.length === 0 ? "Aucun RDV" : undefined}
        />
        <StatsCard
          title="Alertes actives"
          value={alerts.length}
          icon={AlertTriangle}
          iconColor={alerts.length > 0 ? "text-red-600" : "text-green-600"}
          borderColor={alerts.length > 0 ? "border-t-red-500" : "border-t-green-500"}
          description={alerts.length === 0 ? "Aucune alerte" : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned papas */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Mes papas
            </CardTitle>
            <Link href="/dashboard/benevole/papas">
              <Button variant="ghost" size="sm">
                Tout voir <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Aucun papa assigne pour le moment.
              </p>
            ) : (
              <div className="space-y-3">
                {assignments.slice(0, 4).map((assignment) => {
                  const latestDiag = assignment.father.diagnostics[0];
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {assignment.father.fullName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {latestDiag && (
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${classificationBadge(latestDiag.classification)}`}
                            >
                              {latestDiag.classification}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Depuis {new Date(assignment.startDate).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                      <Link href="/dashboard/messagerie">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming appointments */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-amber-600" />
              Prochains rendez-vous
            </CardTitle>
            <Link href="/dashboard/benevole/rendez-vous">
              <Button variant="ghost" size="sm">
                Tout voir <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Aucun rendez-vous a venir.
                </p>
                <Link href="/dashboard/benevole/rendez-vous">
                  <Button variant="outline" size="sm">
                    <CalendarCheck className="h-4 w-4 mr-1" />
                    Planifier un RDV
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 4).map((appt) => {
                  const typeConf = APPOINTMENT_TYPE_CONFIG[appt.type] || APPOINTMENT_TYPE_CONFIG.accompagnement_terrain;
                  const TypeIcon = typeConf.icon;
                  const dateObj = new Date(appt.scheduledAt);

                  return (
                    <div
                      key={appt.id}
                      className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors"
                    >
                      <div className="shrink-0 w-10 text-center">
                        <p className="text-lg font-bold leading-none">{dateObj.getDate()}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          {dateObj.toLocaleDateString("fr-FR", { month: "short" })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{appt.father.fullName}</p>
                          <Badge variant="outline" className={`text-[10px] ${typeConf.color}`}>
                            <TypeIcon className="h-3 w-3 mr-0.5" />
                            {typeConf.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          {" · "}{appt.duration} min
                          {appt.location && ` · ${appt.location}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent alerts */}
      {alerts.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Alertes recentes
            </CardTitle>
            <Link href="/dashboard/benevole/alertes">
              <Button variant="ghost" size="sm">
                Tout voir <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                >
                  <Badge
                    variant="outline"
                    className={`text-[10px] shrink-0 mt-0.5 ${PRIORITY_COLORS[alert.priority] || ""}`}
                  >
                    {PRIORITY_LABELS[alert.priority] || alert.priority}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.title}</p>
                    {alert.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {alert.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
