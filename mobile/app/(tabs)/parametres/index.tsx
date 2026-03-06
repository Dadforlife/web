import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../lib/stores/auth";
import {
  User,
  Bell,
  Baby,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import { theme } from "../../../lib/theme";

const ROLE_LABELS: Record<string, string> = {
  papa_aide: "Papa en recherche d'aide",
  maman_demande: "Maman en demande",
  papa_benevole: "Papa bénévole",
  professionnel: "Professionnel",
};

export default function ParametresScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Déconnexion", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userCard}>
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {ROLE_LABELS[user?.primaryRole ?? ""] ?? user?.primaryRole}
          </Text>
        </View>
      </View>

      <View style={styles.menuGroup}>
        <SettingsItem
          icon={<User size={20} color={theme.colors.gray[700]} />}
          label="Mon profil"
          onPress={() => router.push("/(tabs)/parametres/profil")}
        />
        <SettingsItem
          icon={<Bell size={20} color={theme.colors.gray[700]} />}
          label="Préférences de notifications"
          onPress={() => router.push("/(tabs)/parametres/notifications")}
        />
        <SettingsItem
          icon={<Baby size={20} color={theme.colors.gray[700]} />}
          label="Mes enfants"
          onPress={() => router.push("/(tabs)/parametres/enfants")}
        />
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.versionBox}>
        <Text style={styles.versionText}>Papa pour la Vie v1.0.0</Text>
      </View>
    </View>
  );
}

function SettingsItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        {icon}
        <Text style={styles.settingsItemLabel}>{label}</Text>
      </View>
      <ChevronRight size={18} color={theme.colors.gray[400]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  userCard: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.gray[900],
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.gray[500],
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  menuGroup: {
    marginTop: 16,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsItemLabel: {
    fontSize: 16,
    color: theme.colors.gray[900],
    marginLeft: 12,
  },
  logoutSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    color: "#dc2626",
    fontWeight: "500",
    marginLeft: 12,
  },
  versionBox: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    color: theme.colors.gray[400],
  },
});
