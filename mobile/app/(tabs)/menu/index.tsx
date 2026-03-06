import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useRouter, Stack } from "expo-router";
import {
  User,
  BookOpen,
  Calendar,
  Users,
  MessageCircle,
  BookUser,
  CalendarDays,
  Bell,
  Settings,
  Heart,
  UserPlus,
  Stethoscope,
} from "lucide-react-native";
import { MenuItem } from "../../../components/ui/MenuItem";
import { theme } from "../../../lib/theme";

const MENU_ITEMS = [
  { icon: User, label: "Ma situation", route: "/(tabs)/menu/ma-situation" as const },
  { icon: BookOpen, label: "Programme", route: "/(tabs)/menu/programme" as const },
  { icon: Calendar, label: "Demander un RDV", route: "/(tabs)/rdv" as const },
  { icon: Users, label: "Espace Papas", route: "/(tabs)/menu/espace-papas" as const },
  { icon: MessageCircle, label: "Messagerie", route: "/(tabs)/messagerie" as const },
  { icon: BookUser, label: "Annuaire", route: "/(tabs)/menu/annuaire" as const },
  { icon: CalendarDays, label: "Calendrier", route: "/(tabs)/calendrier" as const },
  { icon: Bell, label: "Notifications", route: "/(tabs)/notifications" as const },
  { icon: Settings, label: "Paramètres", route: "/(tabs)/parametres" as const },
  { icon: Heart, label: "Faire un don", route: "/(tabs)/menu/faire-un-don" as const },
  { icon: UserPlus, label: "Devenir bénévole", route: "/(tabs)/menu/devenir-benevole" as const },
  { icon: Stethoscope, label: "Devenir professionnel", route: "/(tabs)/menu/devenir-professionnel" as const },
];

export default function MenuScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Papa pour la Vie", headerStyle: { backgroundColor: "#2F5BFF" }, headerTintColor: "#fff", headerTitleStyle: { fontWeight: "700" } }} />
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>
          Accédez à tous les services Papa pour la Vie
        </Text>
      </View>

      {MENU_ITEMS.map((item) => (
        <MenuItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          onPress={() => router.push(item.route)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.gray[900],
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.gray[500],
    marginTop: 4,
  },
});
