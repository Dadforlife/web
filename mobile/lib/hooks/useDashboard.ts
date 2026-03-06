import { useQuery } from "@tanstack/react-query";
import api from "../api";

interface PapaDashboard {
  role: "papa_aide";
  diagnostic: {
    scoreGlobal: number;
    classification: string;
    planTitle: string;
    planContent: string;
    createdAt: string;
  } | null;
  nextAppointment: {
    id: string;
    type: string;
    scheduledAt: string;
    duration: number;
    location: string | null;
    volunteer: { fullName: string };
  } | null;
  enfants: { id: string; prenom: string; sexe: string }[];
}

interface VolunteerDashboard {
  role: "papa_benevole";
  profile: {
    volunteerRole: string;
    bio: string | null;
    city: string | null;
    maxAssignments: number;
    isActive: boolean;
  };
  stats: {
    assignedPapas: number;
    upcomingAppointments: number;
    activeAlerts: number;
  };
  assignments: Array<{
    id: string;
    father: { id: string; fullName: string };
    status: string;
    startDate: string;
    diagnostic: { classification: string } | null;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    priority: string;
    title: string;
    description: string | null;
    createdAt: string;
  }>;
  upcomingAppointments: Array<{
    id: string;
    type: string;
    scheduledAt: string;
    duration: number;
    location: string | null;
    father: { fullName: string };
  }>;
}

interface MamanDashboard {
  role: "maman_demande";
  request: {
    id: string;
    status: string;
    fatherFirstName: string;
    fatherCity: string | null;
    createdAt: string;
  } | null;
}

type DashboardData = PapaDashboard | VolunteerDashboard | MamanDashboard;

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/api/mobile/dashboard");
      return res.data as DashboardData;
    },
    staleTime: 60 * 1000,
  });
}
